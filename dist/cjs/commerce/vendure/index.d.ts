import { IProduct, IProductGroup } from '../../record/interfaces';
export interface VendureLoginResult {
    success: boolean;
    authToken?: string;
}
export interface VendureStringTranslation {
    languageCode: string;
    name: string;
    customFields: any;
}
export interface VendureOptionCode {
    group: string;
    option: string;
}
export interface VendureOptionInput {
    groupId?: string;
    code: string;
    name: string;
}
export interface VendureOptionUpdate {
    code?: string;
    name?: string;
}
export interface VendureOptionGroupInput {
    name: string;
    code: string;
    options?: VendureOptionInput[];
}
export interface VendureOptionGroupUpdate {
    name?: string;
    code?: string;
}
export interface VendureFacetValue {
    code: string;
    name: string;
}
export interface VendureFacetValueUpdate {
    identifier: string;
    name?: string;
    code?: string;
}
export interface VendureCollectionInput {
    name: string;
    slug: string;
    atellixUrl?: string;
    description?: string;
    facetValueIds?: string[];
}
export interface VendureCollectionUpdate {
    identifier: string;
    name?: string;
    slug?: string;
    atellixUrl?: string;
    description?: string;
    facetValueIds?: string[];
}
export interface VendureCategoryOptions {
    take?: number;
    skip?: number;
    sort?: number;
}
export interface VendureCategoryInput {
    code: string;
    name: string;
    atellixUrl?: string;
    description?: string;
}
export interface VendureCategoryUpdate {
    identifier: string;
    code?: string;
    name?: string;
    atellixUrl?: string;
    description?: string;
}
export interface VendureCategory {
    identifier?: string;
    code?: string;
    name?: string;
    atellixUrl?: string;
}
export interface VendureCategoryRecord {
    identifier: string;
}
export interface VendureDeleteResult {
    result: string;
    message: string;
}
export interface VendureAssetTag {
    value: string;
}
export interface VendureAssetUpload {
    file: string;
    tags?: VendureAssetTag[];
}
export interface VendureProduct extends IProduct {
    category?: VendureCategory;
    assets?: VendureAssetUpload[];
    enabled?: boolean;
    assetIds?: string;
    optionIds?: string[];
    optionCodes?: VendureOptionCode[];
    facetValueIds?: string;
    taxCategoryId?: string;
    featuredAssetId?: string;
}
export interface VendureProductGroup extends IProductGroup {
    category?: VendureCategory;
    assets?: VendureAssetUpload[];
    optionGroups?: VendureOptionGroupInput[];
    enabled?: boolean;
    assetIds?: string;
    facetValueIds?: string;
    featuredAssetId?: string;
}
export declare class VendureClient {
    private adminApiUrl;
    private authToken;
    private categoryFacetId;
    private gqlClient;
    constructor(adminApiUrl: string);
    setAuthToken(authToken: string): void;
    gqlRequest(doc: string, vars: any, authToken?: string): Promise<any>;
    login(token: string): Promise<VendureLoginResult>;
    getProducts(params: any): Promise<any>;
    createProductVariants(productId: any, variants: VendureProduct[], groupSpec?: any): Promise<string[]>;
    updateProductVariants(variants: VendureProduct[]): Promise<string[]>;
    deleteProductVariants(ids: string[]): Promise<VendureDeleteResult[]>;
    createProduct(item: VendureProduct | VendureProductGroup): Promise<string>;
    updateProduct(item: VendureProduct): Promise<any>;
    deleteProduct(productId: string): Promise<VendureDeleteResult>;
    getAssets(options: any): Promise<any>;
    createAssets(assets: VendureAssetUpload[]): Promise<any>;
    findOrCreateAsset(asset: VendureAssetUpload, force?: boolean): Promise<string>;
    deleteAssets(assetIds: string[], force?: boolean): Promise<VendureDeleteResult>;
    getFacets(options: any): Promise<any>;
    getFacetValues(options: any): Promise<any>;
    createFacetValues(facetId: string, values: VendureFacetValue[]): Promise<string>;
    updateFacetValues(updates: VendureFacetValueUpdate[]): Promise<string>;
    deleteFacetValues(ids: string[], force?: boolean): Promise<VendureDeleteResult[]>;
    getCategoryFacetId(): Promise<string>;
    hasCategoryFacet(categoryCode: string): Promise<boolean>;
    createCategoryFacet(facet: VendureFacetValue): Promise<string>;
    deleteCategoryFacet(categoryCode: string): Promise<void>;
    hasCollection(slug: string): Promise<boolean>;
    getCollections(options: any): Promise<any>;
    createCollection(collection: VendureCollectionInput): Promise<string>;
    updateCollection(collection: VendureCollectionUpdate): Promise<string>;
    deleteCollections(ids: string[]): Promise<VendureDeleteResult[]>;
    getCategories(opts?: VendureCategoryOptions): Promise<VendureCategory[]>;
    createCategory(category: VendureCategoryInput): Promise<string>;
    updateCategory(category: VendureCategoryUpdate): Promise<string>;
    deleteCategory(identifier: string): Promise<VendureDeleteResult>;
    getProductOptionGroup(groupId: string): Promise<any>;
    getProductOptionGroups(filterTerm: string): Promise<any>;
    createProductOptionGroup(optgrp: VendureOptionGroupInput): Promise<any>;
    createProductOption(option: VendureOptionInput): Promise<void>;
    deleteProductOption(optionId: string): Promise<VendureDeleteResult>;
    addOptionGroupToProduct(productId: string, optiontGroupId: string): Promise<void>;
    removeOptionGroupFromProduct(productId: string, optiontGroupId: string, force?: boolean): Promise<any>;
}
//# sourceMappingURL=index.d.ts.map