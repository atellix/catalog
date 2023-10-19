/// <reference types="node" />
import { Signer, PublicKey, ConfirmOptions, Connection, Transaction } from '@solana/web3.js';
import { AnchorProvider } from '@coral-xyz/anchor';
import { Buffer } from 'buffer';
import { VendureClient } from '../vendure';
import { PaymentRequest } from '../../commerce';
export interface MerchantCheckoutParams {
    swap: boolean;
    swapKey?: string;
    wrapSOL: boolean;
    wrapAmount?: string;
    tokensTotal: number;
}
export interface TransactionResult {
    uuid: string;
    signature: string;
}
export interface CheckoutResult {
    result: string;
    error?: string;
    payments: PaymentRequest[];
    transactions: TransactionResult[];
}
export interface AdminTokenResult {
    token: string;
    claims: any;
}
export declare class AtellixClient {
    private provider;
    private apiUrl;
    private program;
    private netData;
    private tokenData;
    private swapData;
    private orderData;
    private math;
    constructor(provider: AnchorProvider, apiUrl: string | undefined);
    updateNetData(data: any): void;
    updateTokenData(data: any): void;
    updateSwapData(data: any): void;
    updateOrderData(data: any[]): void;
    associatedTokenAddress(walletAddress: PublicKey, tokenMintAddress: PublicKey): Promise<{
        pubkey: string;
        nonce: number;
    }>;
    programAddress(inputs: any[], program: PublicKey): Promise<{
        pubkey: string;
        nonce: number;
    }>;
    getPaymentTokens(): Promise<any>;
    getOrder(orderUuid: string): Promise<any>;
    registerSignature(sig: string, orderUuid: string, pubkey: string): Promise<boolean>;
    hasTokenAccount(ataPK: PublicKey): Promise<boolean>;
    getLamports(walletPK: PublicKey): Promise<number>;
    getTokenBalance(mintPK: PublicKey, walletPK: PublicKey): Promise<string>;
    getTokenBalances(tokens: string[], walletPK: PublicKey): Promise<{
        [key: string]: string;
    }>;
    sendAndConfirmRawTransaction(connection: Connection, rawTransaction: Buffer | Uint8Array, options?: ConfirmOptions): Promise<string>;
    sendRegistered(tx: Transaction, register: (sig: Buffer | null) => Promise<boolean>, signers: Signer[]): Promise<string>;
    merchantCheckout(params: MerchantCheckoutParams[], walletPK: PublicKey): Promise<CheckoutResult>;
    checkout(payments: PaymentRequest[], walletPK: PublicKey, paymentToken: string): Promise<CheckoutResult>;
    getAdminToken(tokenType: string, apiKey: string): Promise<AdminTokenResult>;
    getVendureClient(apiKey: string): Promise<VendureClient>;
}
//# sourceMappingURL=index.d.ts.map