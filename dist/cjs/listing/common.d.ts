import { Keypair } from '@solana/web3.js';
export declare function associatedTokenAddress(walletAddress: any, tokenMintAddress: any): Promise<{
    pubkey: string;
    nonce: number;
}>;
export declare function programAddress(inputs: any, program: any): Promise<{
    pubkey: string;
    nonce: number;
}>;
export declare function exportSecretKey(keyPair: any): string;
export declare function importSecretKey(keyStr: any): Keypair;
//# sourceMappingURL=common.d.ts.map