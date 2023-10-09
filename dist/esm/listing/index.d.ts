import { PublicKey, Keypair, Transaction, TransactionInstruction } from '@solana/web3.js';
import { AnchorProvider, Program } from '@coral-xyz/anchor';
export declare const ATELLIX_CATALOG: {
    metadata: number;
    public: number;
    commerce: number;
    event: number;
    realestate: number;
    investment: number;
    employment: number;
};
export declare const ATELLIX_CATALOG_ID: {
    '0': string;
    '1': string;
    '2': string;
    '3': string;
    '4': string;
    '5': string;
    '6': string;
};
export interface Listing {
    catalog: string;
    listing_account: string;
    listing_index: number;
    category: string;
    locality: string[];
    url: string;
    uuid: string;
    label: string;
    detail: string;
    latitude?: number;
    longitude?: number;
    owner: string;
    attributes: any;
    update_count: number;
    update_ts: Date;
}
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
export interface ListingQuery {
    catalog: string;
    category?: string;
    source?: 'solana' | 'catalog';
    take?: number;
    skip?: number;
}
export interface ListingQueryResult {
    count: number;
    listings: Listing[];
}
export interface ListingResult {
    result: string;
    error?: string;
    count: number;
    listings: any[];
}
export interface ListingEntriesQuery {
    url: string;
    take?: number;
    skip?: number;
    sort?: 'price' | 'name';
    reverse?: boolean;
}
export interface ListingEntriesResult {
    result: string;
    error?: string;
    count: number;
    entries: any[];
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
export interface ListingCategoryURL {
    url: string;
}
export interface CategoryTreePath {
    key: string;
    name: string;
}
export interface CategoryTreeNode {
    url: string;
    name?: string;
    slug?: string;
    path?: CategoryTreePath[];
    parent?: string;
    subcategories?: CategoryTreeNode[];
    listing_categories?: ListingCategoryURL[];
}
export interface GetCategortListRequest {
    tree?: string;
    base?: string;
    depth?: number;
}
export interface GetCategortListResult {
    categories: CategoryTreeNode[];
    result: string;
    error?: string;
}
export interface SearchRequest {
    query: string;
    take?: number;
    skip?: number;
    catalog?: string;
    category?: string;
}
export interface SearchResult {
    result: string;
    error?: string;
    count: number;
    entries: any[];
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
    getListings(query: ListingQuery): Promise<ListingQueryResult>;
    getListingEntries(query: ListingEntriesQuery): Promise<ListingEntriesResult>;
    getCategoryList(req: GetCategortListRequest): Promise<GetCategortListResult>;
    search(req: SearchRequest): Promise<SearchResult>;
    getURLEntry(url: string, expandMode?: number): Promise<PublicKey>;
    getURLEntryInstruction(entry: URLEntry, feePayer: Keypair): Promise<URLEntryInstruction>;
    writeAttributes(attrs: any): number;
    getListingSpec(listingData: ListingData): ListingSpec;
    getListingInstructions(listingSpec: ListingSpec, owner: Keypair, feePayer: Keypair, catalog: string): Promise<ListingInstructions>;
    getCatalogRootData(): Promise<CatalogRootData>;
    removeListing(programRoot: CatalogRootData, listing: string, owner: Keypair, feeRecipient: Keypair): Promise<string>;
    applyListingSync(syncData: ListingSyncData, catalog: string, owner: Keypair, feePayer: Keypair): Promise<ListingSyncResult>;
    sendListingInstructions(li: ListingInstructions, owner: Keypair, feePayer: Keypair): Promise<string[]>;
    syncListings(owner: Keypair, feePayer: Keypair, catalog?: string): Promise<ListingSyncResult>;
    getToken(): Promise<string>;
    getURI(uriData: Array<number>): Promise<string>;
}
//# sourceMappingURL=index.d.ts.map