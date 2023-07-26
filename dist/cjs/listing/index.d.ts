import { PublicKey, Keypair, Transaction, TransactionInstruction } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
export interface ListingData {
    catalog: string;
    base: string;
    category: string;
    label: string;
    detail: string;
    attributes: string[];
    latitude?: number;
    longitude?: number;
    locality: string[];
    owner: PublicKey;
}
export interface ListingSpec {
    owner: PublicKey;
    catalog: string;
    category: string;
    filter_by_1: string;
    filter_by_2: string;
    filter_by_3: string;
    attributes: number;
    latitude: string;
    longitude: string;
    listing_url: URLEntry;
    label_url: URLEntry;
    detail_url: URLEntry;
}
export interface URLEntry {
    text: string;
    expand: number;
}
export interface URLEntryInstruction {
    entry: URLEntry;
    exists: boolean;
    publicKey: PublicKey;
    instruction?: TransactionInstruction;
}
export interface ListingInstructions {
    uuid: string;
    catalog: number;
    urlEntries: URLEntryInstruction[];
    transaction: Transaction;
}
export interface ListingAddData {
    attributes: string[];
    category: string;
    detail: object;
    filter_by_1: string | null;
    filter_by_2: string | null;
    filter_by_3: string | null;
    label: string;
    latitude: string | null;
    longitude: string | null;
}
export interface ListingSyncData {
    result: string;
    listing_add: Array<ListingAddData>;
    listing_remove: string[];
}
export interface ListingSyncResult {
    listingsAdded: string[];
    listingsRemoved: string[];
}
export interface CatalogRootData {
    rootData: PublicKey;
    authData: PublicKey;
}
export interface AccessTokenData {
    access_token: string;
}
export declare const listingAttributes: string[];
export declare function postJson(url: string, jsonData: any, token?: string | undefined): Promise<any>;
export declare function graphToJsonld(store: any, baseIRI: string): Promise<string>;
export declare function jsonldToGraph(jsonText: string): Promise<any>;
export declare class ListingClient {
    accessToken: string;
    private provider;
    private catalogProgram;
    private baseUrl;
    private authUrl;
    private apiKey;
    constructor(provider: AnchorProvider, catalogProgram: Program, baseUrl: string | undefined, authUrl: string | undefined, apiKey: string | undefined);
    getListings(catalog: number, categoryUri: string): string;
    getURLEntry(url: string, expandMode?: number): Promise<PublicKey>;
    getURLEntryInstruction(entry: URLEntry, feePayer: Keypair): Promise<URLEntryInstruction>;
    writeAttributes(attrs: any): number;
    getListingSpec(listingData: ListingData): ListingSpec;
    getListingInstructions(listingSpec: ListingSpec, owner: Keypair, feePayer: Keypair, catalog: string): Promise<ListingInstructions>;
    getCatalogRootData(): Promise<CatalogRootData>;
    removeListing(programRoot: CatalogRootData, listing: string, owner: Keypair, feeRecipient: Keypair): Promise<string>;
    applyListingSync(syncData: ListingSyncData, catalog: string, owner: Keypair, feePayer: Keypair): Promise<ListingSyncResult>;
    sendListingInstructions(li: ListingInstructions, owner: Keypair, feePayer: Keypair): Promise<string[]>;
    storeRecord(user: string, record: string, data: any): Promise<any>;
    storeListing(user: string, record: string, catalog: number, listing: string): Promise<any>;
    storeRecordAndListing(user: string, record: string, data: any, catalog: number, listing: string): Promise<any>;
    syncListings(owner: Keypair, feePayer: Keypair, catalog?: string): Promise<ListingSyncResult>;
    getToken(): Promise<string>;
}
//# sourceMappingURL=index.d.ts.map