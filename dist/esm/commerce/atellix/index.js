import { PublicKey, Transaction, SystemProgram } from '@solana/web3.js';
import { parse as uuidparse } from 'uuid';
import { BN, Program } from '@coral-xyz/anchor';
import { getAccount, TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, createAssociatedTokenAccountInstruction, createSyncNativeInstruction, createCloseAccountInstruction, TokenAccountNotFoundError } from '@solana/spl-token';
import { create, all } from 'mathjs';
import { encode } from 'js-base64';
import { Buffer } from 'buffer';
import fetch from 'cross-fetch';
import bs58 from 'bs58';
import { decodeJwt } from 'jose';
import { VendureClient } from '../vendure';
import tokenAgentIDL from './token_agent.json';
function postJson(url, jsonData, apiKey = '') {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (apiKey) {
        headers.append('Authorization', 'Basic ' + encode('api:' + apiKey));
    }
    const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(jsonData),
    };
    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then(response => { return response.json(); })
            .then(json => { resolve(json); })
            .catch(error => { reject(error); });
    });
}
export class AtellixClient {
    constructor(provider, apiUrl) {
        this.provider = provider;
        this.apiUrl = apiUrl !== null && apiUrl !== void 0 ? apiUrl : 'https://app.atellix.com/api/checkout';
        this.math = create(all, {
            number: 'BigNumber',
            precision: 64
        });
    }
    updateNetData(data) {
        this.netData = data;
    }
    updateTokenData(data) {
        this.tokenData = data;
    }
    updateSwapData(data) {
        this.swapData = data;
    }
    updateOrderData(data) {
        this.orderData = data;
    }
    async associatedTokenAddress(walletAddress, tokenMintAddress) {
        const addr = await PublicKey.findProgramAddress([walletAddress.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()], ASSOCIATED_TOKEN_PROGRAM_ID);
        const res = { 'pubkey': await addr[0].toString(), 'nonce': addr[1] };
        return res;
    }
    async programAddress(inputs, program) {
        const addr = await PublicKey.findProgramAddress(inputs, program);
        const res = { 'pubkey': await addr[0].toString(), 'nonce': addr[1] };
        return res;
    }
    async getPaymentTokens() {
        const tokens = await postJson(this.apiUrl, {
            'command': 'get_tokens',
        });
        this.updateNetData(tokens.net_data);
        this.updateSwapData(tokens.swap_data);
        return tokens;
    }
    async getOrder(orderUuid) {
        const orderSpec = await postJson(this.apiUrl, {
            'command': 'load',
            'mode': 'order',
            'uuid': orderUuid,
        });
        return orderSpec;
    }
    async registerSignature(sig, orderUuid, pubkey) {
        const register = await postJson(this.apiUrl, {
            'command': 'register_signature',
            'op': 'checkout',
            'sig': sig,
            'uuid': orderUuid,
            'timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
            'user_key': pubkey,
        });
        //console.log('Register Result')
        //console.log(register)
        return (register['result'] === 'ok') ? true : false;
    }
    async hasTokenAccount(ataPK) {
        const provider = this.provider;
        try {
            await getAccount(provider.connection, ataPK);
        }
        catch (error) {
            return false;
        }
        return true;
    }
    async getLamports(walletPK) {
        const provider = this.provider;
        const walletInfo = await provider.connection.getAccountInfo(walletPK, 'confirmed');
        if (walletInfo && typeof walletInfo['lamports'] !== 'undefined') {
            return walletInfo.lamports;
        }
        return Number(0);
    }
    async getTokenBalance(mintPK, walletPK) {
        const provider = this.provider;
        const tokenInfo = await this.associatedTokenAddress(walletPK, mintPK);
        const tokenPK = new PublicKey(tokenInfo.pubkey);
        var amount = '0';
        try {
            const tokenAccount = await getAccount(provider.connection, tokenPK);
            //console.log('Token Account - Wallet: ' + wallet + ' Mint: ' + mint)
            //console.log(tokenAccount)
            amount = tokenAccount.amount.toString();
        }
        catch (error) {
            if (error instanceof TokenAccountNotFoundError) {
                // Do nothing
            }
            else {
                console.error(error);
            }
        }
        return amount;
    }
    async getTokenBalances(tokens, walletPK) {
        var balances = {};
        for (var t = 0; t < tokens.length; t++) {
            const tk = tokens[t];
            if (this.tokenData[tk]) {
                try {
                    balances[tk] = await this.getTokenBalance(new PublicKey(this.tokenData[tk].mint), walletPK);
                }
                catch (error) {
                    break;
                }
            }
        }
        // Get SOL balance and combine with Wrapped SOL balance
        var solBalance = await this.getLamports(walletPK);
        balances['SOL'] = solBalance.toString();
        if (typeof balances['WSOL'] !== 'undefined') { // Combine SOL into WSOL for net total as 'WSOL' (keep 'SOL' for unwrapped total)
            solBalance = solBalance + Number(balances['WSOL']);
            balances['WSOL'] = solBalance.toString();
        }
        return balances;
    }
    async sendAndConfirmRawTransaction(connection, rawTransaction, options) {
        const sendOptions = options && {
            skipPreflight: options.skipPreflight,
            preflightCommitment: options.preflightCommitment || options.commitment,
        };
        const signature = await connection.sendRawTransaction(rawTransaction, sendOptions);
        const status = (await connection.confirmTransaction(signature, options && options.commitment)).value;
        if (status.err) {
            throw new Error(`Raw transaction ${signature} failed (${JSON.stringify(status)})`);
        }
        return signature;
    }
    async sendRegistered(tx, register, signers) {
        tx.feePayer = this.provider.wallet.publicKey;
        tx.recentBlockhash = (await this.provider.connection.getRecentBlockhash(this.provider.opts.preflightCommitment)).blockhash;
        tx = await this.provider.wallet.signTransaction(tx);
        signers.forEach((kp) => {
            tx.partialSign(kp);
        });
        if (!await register(tx.signature)) {
            throw new Error("Signature registration failed");
        }
        const rawTx = tx.serialize();
        const sig = await this.sendAndConfirmRawTransaction(this.provider.connection, rawTx, this.provider.opts);
        return sig;
    }
    async merchantCheckout(params, walletPK) {
        //console.log('Checkout')
        //console.log(params)
        const tokenAgentPK = new PublicKey(this.netData.program['token-agent']);
        const tokenAgent = new Program(tokenAgentIDL, tokenAgentPK);
        const netAuth = new PublicKey(this.netData.program['atx-net-authority']);
        const orders = [];
        for (var i = 0; i < this.orderData.length; i++) {
            const tokenMint = new PublicKey(this.orderData[i].tokenMint);
            const destPK = new PublicKey(this.orderData[i].merchantWallet);
            const merchantAP = new PublicKey(this.orderData[i].merchantApproval);
            const merchantTK = await this.associatedTokenAddress(destPK, tokenMint);
            const feesPK = new PublicKey(this.orderData[i].feesAccount);
            const feesTK = await this.associatedTokenAddress(feesPK, tokenMint);
            const rootKey = await this.programAddress([tokenAgentPK.toBuffer()], tokenAgentPK);
            var walletToken = await this.associatedTokenAddress(walletPK, tokenMint);
            var tokenAccount = new PublicKey(walletToken.pubkey);
            var operationSpec = {
                accounts: {
                    netAuth: netAuth,
                    rootKey: new PublicKey(rootKey.pubkey),
                    merchantApproval: merchantAP,
                    merchantToken: new PublicKey(merchantTK.pubkey),
                    userKey: walletPK,
                    tokenProgram: TOKEN_PROGRAM_ID,
                    tokenAccount: tokenAccount,
                    feesAccount: new PublicKey(feesTK.pubkey),
                }
            };
            var bump_root = 0;
            var bump_inb = 0;
            var bump_out = 0;
            var bump_dst = 0;
            var swapDirection = false;
            var tx = new Transaction();
            var unwrapSOL = false;
            var walletTokenPK;
            if (params[i].swap) {
                const swapSpec = this.swapData[params[i].swapKey];
                swapDirection = swapSpec.swapDirection;
                const swapContractPK = new PublicKey(this.netData.program['atx-swap-contract']);
                const tokenMint1 = new PublicKey(swapSpec.tokenMint1);
                const tokenMint2 = new PublicKey(swapSpec.tokenMint2);
                const swapDataPK = new PublicKey(swapSpec.swapData);
                const swapFeesTK = new PublicKey(swapSpec.feesToken);
                const swapId = 0; // TODO: Make this dynamic
                var buf = Buffer.alloc(2);
                buf.writeInt16LE(swapId);
                var swapData;
                if (swapDirection) {
                    swapData = await this.programAddress([tokenMint1.toBuffer(), tokenMint2.toBuffer(), buf], swapContractPK);
                }
                else {
                    swapData = await this.programAddress([tokenMint2.toBuffer(), tokenMint1.toBuffer(), buf], swapContractPK);
                }
                const tokData1 = await this.associatedTokenAddress(swapDataPK, tokenMint1);
                const tokData2 = await this.associatedTokenAddress(swapDataPK, tokenMint2);
                const agentToken = await this.associatedTokenAddress(new PublicKey(rootKey.pubkey), tokenMint);
                //console.log('Root Key: ' + rootKey.pubkey)
                tokenAccount = new PublicKey(agentToken.pubkey);
                //console.log('Token Account: ' + agentToken.pubkey)
                walletToken = await this.associatedTokenAddress(walletPK, tokenMint1);
                walletTokenPK = new PublicKey(walletToken.pubkey);
                bump_root = swapData.nonce;
                bump_inb = tokData1.nonce;
                bump_out = tokData2.nonce;
                bump_dst = agentToken.nonce;
                var remainAccts = [
                    { pubkey: walletTokenPK, isWritable: true, isSigner: false },
                    { pubkey: swapContractPK, isWritable: false, isSigner: false },
                    { pubkey: swapDataPK, isWritable: true, isSigner: false },
                    { pubkey: new PublicKey(tokData1.pubkey), isWritable: true, isSigner: false },
                    { pubkey: new PublicKey(tokData2.pubkey), isWritable: true, isSigner: false },
                    { pubkey: swapFeesTK, isWritable: true, isSigner: false },
                ];
                if (typeof swapSpec['oracleChain'] !== 'undefined') {
                    remainAccts.push({ pubkey: new PublicKey(swapSpec.oracleChain), isWritable: false, isSigner: false });
                }
                operationSpec['accounts']['tokenAccount'] = tokenAccount;
                operationSpec['remainingAccounts'] = remainAccts;
                if (params[i].wrapSOL) {
                    //console.log('Wrap Estimate: ' + params.wrapAmount)
                    var wrapAmount = new BN(params[i].wrapAmount);
                    const walletSOL = await this.getLamports(walletPK);
                    if (Number(params[i].wrapAmount) > walletSOL) {
                        let minimumSOL = Number(0.01 * (10 ** 9));
                        let amountToWrap = walletSOL - minimumSOL;
                        wrapAmount = new BN(amountToWrap);
                    }
                    let hasWSOL = await this.hasTokenAccount(walletTokenPK);
                    if (!hasWSOL) {
                        unwrapSOL = true; // Unwrap the remaining SOL after the payment
                        //let size = AccountLayout.span
                        //let rent = await provider.connection.getMinimumBalanceForRentExemption(size)
                        //wrapAmount = wrapAmount - rent
                        tx.add(createAssociatedTokenAccountInstruction(walletPK, walletTokenPK, walletPK, tokenMint1));
                    }
                    //console.log('Wrap Amount: ' + wrapAmount.toString())
                    tx.add(SystemProgram.transfer({
                        fromPubkey: walletPK,
                        lamports: BigInt(wrapAmount.toString()),
                        toPubkey: walletTokenPK,
                    }));
                    tx.add(createSyncNativeInstruction(walletTokenPK));
                }
            }
            let paymentUuid = uuidparse(this.orderData[i].orderId);
            let amount = new BN(params[i].tokensTotal);
            //console.log('Amount: ' + amount.toString())
            tx.add(tokenAgent.instruction.merchantPayment(merchantTK.nonce, // inp_merchant_nonce (merchant associated token account nonce)
            rootKey.nonce, // inp_root_nonce
            new BN(paymentUuid), // inp_payment_id
            amount, // inp_amount
            params[i].swap, // inp_swap
            swapDirection, // inp_swap_direction
            0, // inp_swap_mode
            bump_root, // inp_swap_data_nonce
            bump_inb, // inp_swap_inb_nonce
            bump_out, // inp_swap_out_nonce
            bump_dst, // inp_swap_dst_nonce
            operationSpec));
            if (unwrapSOL) {
                tx.add(createCloseAccountInstruction(walletTokenPK, walletPK, walletPK));
            }
            orders.push(tx);
        }
        var transactions = [];
        try {
            this.provider.opts['skipPreflight'] = true;
            for (var i = 0; i < orders.length; i++) {
                var order = orders[i];
                var orderId = this.orderData[i].orderId;
                var sig = await this.sendRegistered(order, async (sig) => {
                    const sigtxt = bs58.encode(new Uint8Array(sig));
                    const success = await this.registerSignature(sigtxt, orderId, walletPK.toString());
                    return success;
                }, []);
                transactions.push({
                    uuid: orderId,
                    signature: sig,
                });
            }
        }
        catch (error) {
            return {
                'result': 'error',
                'error': error,
                'transactions': transactions,
                'payments': [],
            };
        }
        return {
            'result': 'ok',
            'transactions': transactions,
            'payments': [],
        };
    }
    async checkout(payments, walletPK, paymentToken) {
        const merchantToken = 'USDV';
        const orders = [];
        const orderParams = [];
        for (let i = 0; i < payments.length; i++) {
            const orderUuid = payments[i].data['uuid'];
            const order = await this.getOrder(orderUuid);
            const dcm = order.tokens[merchantToken].decimals;
            const tknTotal = this.math.evaluate('prc * 10^dcm', { prc: order.order_data.priceTotal, dcm: dcm });
            var params = {
                'swap': false,
                'wrapSOL': false,
                'tokensTotal': tknTotal.toString(),
            };
            if (paymentToken !== merchantToken) {
                const swapKey = merchantToken + '-' + paymentToken;
                params['swap'] = true;
                params['swapKey'] = swapKey;
                if (paymentToken === 'WSOL') {
                    const tokenQuote = '10'; // Dynamic
                    const wrapAmount = Number(this.math.evaluate('amt * 1.025 * (10 ^ dcm)', {
                        amt: tokenQuote,
                        dcm: order.tokens[paymentToken].decimals
                    }).toString());
                    params['wrapSOL'] = true;
                    params['wrapAmount'] = wrapAmount.toFixed(0);
                }
            }
            orders.push(order);
            orderParams.push(params);
        }
        //console.log('AtellixPay Order Ready')
        var orderList = [];
        orders.map((order) => { orderList.push(order.order_data); });
        this.updateNetData(orders[0].net_data);
        this.updateSwapData(orders[0].swap_data);
        this.updateOrderData(orderList);
        var ckres = await this.merchantCheckout(orderParams, walletPK);
        ckres.payments = payments;
        return ckres;
    }
    async getAdminToken(tokenType, apiKey) {
        if (tokenType === 'vendure') {
            var url = this.apiUrl;
            url = url.replace(/checkout$/, '');
            url = url + 'auth_gateway/v1/get_token';
            const info = await postJson(url, {
                'audience': 'atellix-client',
            }, apiKey);
            if (info['result'] === 'ok') {
                const tokenResult = {
                    'token': info['access_token'],
                    'claims': decodeJwt(info['access_token']),
                };
                return tokenResult;
            }
            else {
                throw new Error('Get admin token error: ' + info['error']);
            }
        }
        else {
            throw new Error('Invalid token type: ' + tokenType);
        }
    }
    async getVendureClient(apiKey) {
        const result = await this.getAdminToken('vendure', apiKey);
        const vendureAdminApi = 'https://' + result.claims.vendure_instance[0] + '/admin-api';
        const vcl = new VendureClient(vendureAdminApi);
        const login = await vcl.login(result.token);
        if (!login.success) {
            throw new Error('Vendure admin login failed');
        }
        return vcl;
    }
}
//# sourceMappingURL=index.js.map