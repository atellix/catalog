"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VendureClient = void 0;
const awesome_graphql_client_1 = require("awesome-graphql-client");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const https = require('https');
const FormData = require('form-data');
const { createReadStream } = require('fs');
function basename(path) {
    return path.split('/').reverse()[0];
}
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
function randomString(len) {
    let result = '';
    const charactersLength = CHARS.length;
    for (let i = 0; i < len; i++) {
        result += CHARS.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
class VendureClient {
    constructor(adminApiUrl) {
        this.adminApiUrl = adminApiUrl;
    }
    setAuthToken(authToken) {
        this.authToken = authToken;
    }
    async gqlRequest(doc, vars, authToken = '') {
        var headers = {};
        if (authToken) {
            headers['authorization'] = 'Bearer ' + authToken;
        }
        //console.log('GQL Headers')
        //console.log(headers)
        const gqlClient = new awesome_graphql_client_1.AwesomeGraphQLClient({
            endpoint: this.adminApiUrl,
            fetch: cross_fetch_1.default,
            FormData,
            fetchOptions: {
                headers: new Headers(headers),
                agent: new https.Agent({ keepAlive: true }),
            },
        });
        return new Promise((resolve, reject) => {
            gqlClient.requestSafe(doc, vars).then((result) => {
                //console.log('GQL Result')
                //console.log(result)
                if (result.ok) {
                    resolve({
                        'headers': result.response.headers,
                        'data': result.data,
                    });
                }
                else {
                    console.error(result.error);
                    reject(result.error);
                }
            }).catch((error) => {
                console.error(error);
                reject(error);
            });
        });
    }
    async login(token) {
        const doc = `
mutation Authenticate($token: String!) {
    authenticate(input: {
        keycloak: {
            token: $token
        }
    }) {
        ...on CurrentUser { id }
    }
}`;
        const vars = {
            'token': token
        };
        const result = await this.gqlRequest(doc, vars);
        if ('authenticate' in result.data && 'id' in result.data.authenticate) {
            const authToken = result.headers.get('vendure-auth-token');
            this.authToken = authToken;
            return {
                'success': true,
                'authToken': authToken,
            };
        }
        return { 'success': false };
    }
    // Products
    async getProducts(params) {
        const doc = `
query search ($input: SearchInput!) {
    search(input: $input) {
        totalItems
        items {
            sku
            slug
            productId
            productName
            productAsset {
                preview
            }
            productVariantId
            productVariantName
            productVariantAsset {
                preview
            }
            description
            currencyCode
            facetIds
            facetValueIds
            collectionIds
            price {
                ... on PriceRange {
                    min
                    max
                }
                ... on SinglePrice {
                    value
                }
            }
            priceWithTax {
                ... on PriceRange {
                    min
                    max
                }
                ... on SinglePrice {
                    value
                }
            }
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        const result = await this.gqlRequest(doc, { 'input': params }, this.authToken);
        return result.data.search;
    }
    async createProductVariants(productId, variants, groupSpec = {}) {
        var variantList = [];
        for (var i = 0; i < variants.length; i++) {
            const variant = variants[i];
            var variantInfo = {
                'productId': productId,
                'translations': [{
                        'languageCode': 'en',
                        'name': variant.name,
                        'customFields': {},
                    }],
                'facetValueIds': [],
                'sku': variant.sku,
                'price': variant.offers[0].price,
                'taxCategoryId': 0,
                'optionIds': [],
                'featuredAssetId': 0,
                'assetIds': [],
                'stockOnHand': 0,
                'stockLevels': [],
                'outOfStockThreshold': 0,
                'useGlobalOutOfStockThreshold': false,
                'trackInventory': 'FALSE',
                'customFields': {},
            };
            for (var k of ['facetValueIds', 'taxCategoryId', 'optionIds', 'assetIds', 'featuredAssetId']) {
                if (k in variant) {
                    variantInfo[k] = variant[k];
                }
            }
            if (!('optionIds' in variant)) {
                if ('optionCodes' in variant) {
                    var optionIds = [];
                    for (var optcode of variant.optionCodes) {
                        if (optcode.group in groupSpec && optcode.option in groupSpec[optcode.group]) {
                            optionIds.push(groupSpec[optcode.group][optcode.option]);
                        }
                    }
                    variantInfo.optionIds = optionIds;
                }
            }
            variantList.push(variantInfo);
        }
        const doc = `
mutation CreateProductVariants($input: [CreateProductVariantInput!]!) {
    createProductVariants(input: $input) {
        ...on ProductVariant {
            id
            productId
            name
            sku
            price
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        const result = await this.gqlRequest(doc, { 'input': variantList }, this.authToken);
        var ids = [];
        for (var i = 0; i < result.data.createProductVariants.length; i++) {
            ids.push(result.data.createProductVariants[i].id);
        }
        if (variantList.length !== ids.length) {
            throw new Error('Unable to create all variants');
        }
        return ids;
    }
    async updateProductVariants(variants) {
        var variantList = [];
        for (var i = 0; i < variants.length; i++) {
            const variant = variants[i];
            var variantInfo = {
                'id': variant.identifier,
            };
            if ('name' in variant) {
                variantInfo['translations'] = [{
                        'languageCode': 'en',
                        'name': variant.name,
                    }];
            }
            if ('offers' in variant && variant.offers.length > 0 && 'price' in variant.offers[0]) {
                variantInfo['price'] = variant.offers[0].price;
            }
            for (var k of ['sku', 'enabled', 'facetValueIds', 'taxCategoryId', 'optionIds', 'assetIds']) {
                if (k in variant) {
                    variantInfo[k] = variant[k];
                }
            }
            variantList.push(variantInfo);
        }
        const doc = `
mutation UpdateProductVariants($input: [UpdateProductVariantInput!]!) {
    updateProductVariants(input: $input) {
        ...on ProductVariant {
            id
            productId
            name
            sku
            price
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        const result = await this.gqlRequest(doc, { 'input': variantList }, this.authToken);
        var ids = [];
        for (var i = 0; i < result.data.updateProductVariants.length; i++) {
            ids.push(result.data.updateProductVariants[i].id);
        }
        if (variantList.length !== ids.length) {
            throw new Error('Unable to update all variants');
        }
        return ids;
    }
    async deleteProductVariants(ids) {
        const doc = `
mutation deleteProductVariants ($ids: [ID!]!) {
    deleteProductVariants(ids: $ids) {
        result
        message
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        const res = await this.gqlRequest(doc, { 'ids': ids }, this.authToken);
        return res.data.deleteProductVariants;
    }
    async createProduct(item) {
        var _a;
        var variants = [];
        var productGroup = false;
        if ('hasVariant' in item) {
            productGroup = true;
            variants = item.hasVariant;
        }
        else {
            variants = [item];
        }
        var params = {
            'featuredAssetId': 0,
            'enabled': true,
            'assetIds': [],
            'facetValueIds': [],
            'translations': [{
                    'languageCode': 'en',
                    'name': item.name,
                    'slug': item.slug,
                    'description': item.description,
                    'customFields': {},
                }],
            'customFields': {},
        };
        for (var k of ['enabled', 'facetValueIds', 'assetIds', 'featuredAssetId']) {
            if (k in item) {
                params[k] = item[k];
            }
        }
        // Include category facet value if specified directly (when including other facets)
        if (!('facetValueIds' in item)) {
            if ('category' in item) {
                var facetId;
                if ('identifier' in item.category) {
                    facetId = (_a = item === null || item === void 0 ? void 0 : item.category) === null || _a === void 0 ? void 0 : _a.identifier;
                }
                else {
                    // TODO: cache lookup
                    facetId = await this.createCategory(item === null || item === void 0 ? void 0 : item.category);
                }
                params.facetValueIds = [facetId];
            }
        }
        // Skip if assets are defined specifically
        if (!('assetIds' in item)) {
            if ('assets' in item) {
                if (item.assets.length > 0) {
                    var assetUploads = item.assets.map((asset) => {
                        return this.findOrCreateAsset(asset);
                    });
                    params.assetIds = await Promise.all(assetUploads);
                }
                if (params.assetIds.length > 0) {
                    params.featuredAssetId = params.assetIds[0];
                }
            }
        }
        const doc = `
mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
        ...on Product {
            id
            name
            slug
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        // Create products
        const cres = await this.gqlRequest(doc, { 'input': params }, this.authToken);
        const productId = cres.data.createProduct.id;
        var groupSpec = {};
        // Create product variant options
        if (productGroup) {
            const optionGroups = item.optionGroups;
            for (var group of optionGroups) {
                // Translate code
                var origCode = group.code;
                var grpCode = randomString(8) + '-' + origCode;
                var opts = {};
                groupSpec[origCode] = opts;
                group.code = grpCode;
                const grpdata = await this.createProductOptionGroup(group);
                for (var option of grpdata.options) {
                    groupSpec[origCode][option.code] = option.id;
                }
                await this.addOptionGroupToProduct(productId, grpdata.id);
            }
        }
        // Create product variants
        const variantIds = await this.createProductVariants(productId, variants, groupSpec);
        return productId;
    }
    async updateProduct(item) {
        var product = {
            'id': item.identifier,
        };
        var updateTranslations = false;
        var updateTr = {
            'languageCode': 'en',
        };
        for (var k of ['name', 'description', 'slug']) {
            if (k in item) {
                updateTranslations = true;
                updateTr[k] = item[k];
            }
        }
        if (updateTranslations) {
            product['translations'] = [updateTr];
        }
        for (var k of ['enabled', 'facetValueIds', 'assetIds', 'featuredAssetId']) {
            if (k in item) {
                product[k] = item[k];
            }
        }
        const doc = `
mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
        ...on Product {
            id
            name
            slug
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        //console.log(product)
        const result = await this.gqlRequest(doc, { 'input': product }, this.authToken);
        return result.data.updateProduct;
    }
    async deleteProduct(productId) {
        const doc = `
mutation deleteProduct ($id: ID!) {
    deleteProduct(id: $id) {
        result
        message
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        const res = await this.gqlRequest(doc, { 'id': productId }, this.authToken);
        return res.data.deleteProduct;
    }
    // Assets
    async getAssets(options) {
        const doc = `
query assets ($options: AssetListOptions) {
    assets (options: $options) {
        totalItems
        items {
            id
            createdAt
            updatedAt
            name
            type
            fileSize
            mimeType
            width
            height
            source
            preview
            tags {
                value
            }
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        var params = {};
        for (var k of ['tags', 'tagsOperator', 'skip', 'take', 'sort', 'filter', 'filterOperator']) {
            if (k in options) {
                params[k] = options[k];
            }
        }
        const result = await this.gqlRequest(doc, { 'options': params }, this.authToken);
        return result.data.assets;
    }
    async createAssets(assets) {
        const doc = `
mutation createAssets ($input: [CreateAssetInput!]!) {
    createAssets(input: $input) {
        ... on Asset {
            id
            name
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        var params = [];
        assets.forEach((val) => {
            var tags = [];
            if ('tags' in val) {
                tags = val.tags;
            }
            params.push({
                file: createReadStream(val.file),
                tags: tags,
                customFields: {},
            });
        });
        const result = await this.gqlRequest(doc, { 'input': params }, this.authToken);
        return result.data.createAssets;
    }
    async findOrCreateAsset(asset, force = false) {
        var create = true;
        var result = '';
        if (!force) {
            const fp = basename(asset.file);
            const current = await this.getAssets({
                filter: { name: { eq: fp } },
                take: 1,
            });
            if (current.totalItems > 0) {
                create = false;
                result = current.items[0].id;
            }
        }
        if (create) {
            const added = await this.createAssets([asset]);
            result = added[0].id;
        }
        return result;
    }
    async deleteAssets(assetIds, force = false) {
        const doc = `
mutation deleteAssets ($input: DeleteAssetsInput!) {
    deleteAssets(input: $input) {
        result
        message
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        var params = {
            'assetIds': assetIds,
            'force': force,
            'deleteFromAllChannels': true,
        };
        const res = await this.gqlRequest(doc, { 'input': params }, this.authToken);
        return res.data.deleteAssets;
    }
    // Facets
    async getFacets(options) {
        const doc = `
query facets ($options: FacetListOptions) {
    facets(options: $options) {
        totalItems
        items { 
            id
            name
            code
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        var params = {};
        for (var k of ['skip', 'take', 'sort', 'filter', 'filterOperator']) {
            if (k in options) {
                params[k] = options[k];
            }
        }
        const facetsResult = await this.gqlRequest(doc, { 'options': params }, this.authToken);
        return facetsResult.data.facets;
    }
    async getFacetValues(options) {
        const doc = `
query facetValues ($options: FacetValueListOptions) {
    facetValues(options: $options) {
        totalItems
        items {
            id
            name
            code
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        var params = {};
        for (var k of ['skip', 'take', 'sort', 'filter', 'filterOperator']) {
            if (k in options) {
                params[k] = options[k];
            }
        }
        const facetsResult = await this.gqlRequest(doc, { 'options': params }, this.authToken);
        return facetsResult.data.facetValues;
    }
    async createFacetValues(facetId, values) {
        const doc = `
mutation createFacetValues ($input: [CreateFacetValueInput!]!) {
    createFacetValues(input: $input) {
        ... on FacetValue {
            id
            name
            code
            facet {
                id
            }
            translations {
                id
                languageCode
                name
            }
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        var params = [];
        values.forEach((val) => {
            params.push({
                facetId,
                code: val.code,
                translations: [{
                        languageCode: 'en',
                        name: val.name,
                        customFields: {},
                    }],
                customFields: {},
            });
        });
        const facetVals = await this.gqlRequest(doc, { 'input': params }, this.authToken);
        return facetVals.data.createFacetValues;
    }
    async updateFacetValues(updates) {
        const doc = `
mutation updateFacetValues ($input: [UpdateFacetValueInput!]!) {
    updateFacetValues(input: $input) {
        ... on FacetValue {
            id
            name
            code
            facet {
                id
            }
            translations {
                id
                languageCode
                name
            }
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        var params = [];
        updates.forEach((val) => {
            var updateFacetVal = {
                id: val.identifier,
            };
            if ('code' in val) {
                updateFacetVal.code = val.code;
            }
            if ('name' in val) {
                updateFacetVal.translations = [{
                        'name': val.name,
                        'languageCode': 'en',
                    }];
            }
            params.push(updateFacetVal);
        });
        const facetVals = await this.gqlRequest(doc, { 'input': params }, this.authToken);
        return facetVals.data.updateFacetValues;
    }
    async deleteFacetValues(ids, force = false) {
        const doc = `
mutation deleteFacetValues ($ids: [ID!]!, $force: Boolean) {
    deleteFacetValues(ids: $ids, force: $force) {
        result
        message
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        const res = await this.gqlRequest(doc, { 'ids': ids, 'force': force }, this.authToken);
        return res.data.deleteFacetValues;
    }
    async getCategoryFacetId() {
        const facets = await this.getFacets({
            filter: { code: { eq: 'category' } },
            take: 1,
        });
        this.categoryFacetId = facets.items[0].id;
        return facets.items[0].id;
    }
    async hasCategoryFacet(categoryCode) {
        var _a;
        const categoryFacetId = (_a = this.categoryFacetId) !== null && _a !== void 0 ? _a : await this.getCategoryFacetId();
        const facetVals = await this.getFacetValues({
            filter: { code: { eq: categoryCode } },
            take: 1,
        });
        if (facetVals.totalItems > 0) {
            return true;
        }
        return false;
    }
    async createCategoryFacet(facet) {
        if (!await this.hasCategoryFacet(facet.code)) {
            await this.createFacetValues(this.categoryFacetId, [{ name: facet.name, code: facet.code }]);
        }
        const facetVals = await this.getFacetValues({
            filter: { code: { eq: facet.code } },
            take: 1,
        });
        if (facetVals.totalItems < 1) {
            Promise.reject('Category facet value not found for code: ' + facet.code);
        }
        return facetVals.items[0].id;
    }
    async deleteCategoryFacet(categoryCode) {
        var _a;
        const categoryFacetId = (_a = this.categoryFacetId) !== null && _a !== void 0 ? _a : await this.getCategoryFacetId();
        const facetVals = await this.getFacetValues({
            filter: { code: { eq: categoryCode } },
            take: 1,
        });
        if (facetVals.totalItems > 0) {
            await this.deleteFacetValues([facetVals.items[0].id]);
        }
    }
    // Collections
    async hasCollection(slug) {
        const collections = await this.getCollections({
            filter: { slug: { eq: slug } },
            take: 1,
        });
        if (collections.totalItems > 0) {
            return true;
        }
        return false;
    }
    async getCollections(options) {
        const doc = `
query collections ($options: CollectionListOptions) {
    collections(options: $options) {
        totalItems
        items { 
            id
            name
            slug
            filters {
                code
                args {
                    name
                    value
                }
            }
            customFields {
                atellixUrl
            }
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        var params = {};
        for (var k of ['topLevelOnly', 'skip', 'take', 'sort', 'filter', 'filterOperator']) {
            if (k in options) {
                params[k] = options[k];
            }
        }
        const collectionResult = await this.gqlRequest(doc, { 'options': params }, this.authToken);
        return collectionResult.data.collections;
    }
    async createCollection(collection) {
        var _a;
        const doc = `
mutation createCollection ($input: CreateCollectionInput!) {
    createCollection(input: $input) {
        id
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        var params = {
            isPrivate: false,
            featuredAssetId: 0,
            assetIds: [],
            parentId: 1,
            inheritFilters: true,
            filters: [],
            translations: {
                languageCode: 'en',
                name: collection.name,
                slug: collection.slug,
                description: (_a = collection.description) !== null && _a !== void 0 ? _a : '',
                customFields: {},
            },
            customFields: {},
        };
        if ('atellixUrl' in collection) {
            params.customFields = { atellixUrl: collection.atellixUrl };
        }
        if ('facetValueIds' in collection) {
            params.filters = [
                { code: 'facet-value-filter', arguments: [
                        { name: 'facetValueIds', value: JSON.stringify(collection.facetValueIds) },
                        { name: 'containsAny', value: 'false' },
                        { name: 'combineWithAnd', value: 'true' },
                    ] },
            ];
        }
        const collectionResult = await this.gqlRequest(doc, { 'input': params }, this.authToken);
        return collectionResult.data.createCollection.id;
    }
    async updateCollection(collection) {
        const doc = `
mutation updateCollection ($input: UpdateCollectionInput!) {
    updateCollection(input: $input) {
        id
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        var params = {
            id: collection.identifier,
        };
        if ('atellixUrl' in collection) {
            params.customFields = { atellixUrl: collection.atellixUrl };
        }
        if ('facetValueIds' in collection) {
            params.filters = [
                { code: 'facet-value-filter', arguments: [
                        { name: 'facetValueIds', value: JSON.stringify(collection.facetValueIds) },
                        { name: 'containsAny', value: 'false' },
                        { name: 'combineWithAnd', value: 'true' },
                    ] },
            ];
        }
        var updateTranslations = false;
        var updateTr = {
            'languageCode': 'en',
        };
        for (var k of ['name', 'description', 'slug']) {
            if (k in collection) {
                updateTranslations = true;
                updateTr[k] = collection[k];
            }
        }
        if (updateTranslations) {
            params.translations = [updateTr];
        }
        const collectionResult = await this.gqlRequest(doc, { 'input': params }, this.authToken);
        return collectionResult.data.updateCollection.id;
    }
    async deleteCollections(ids) {
        const doc = `
mutation deleteCollections ($ids: [ID!]!) {
    deleteCollections(ids: $ids) {
        result
        message
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        const res = await this.gqlRequest(doc, { 'ids': ids }, this.authToken);
        return res.data.deleteCollections;
    }
    // Categories
    async getCategories(opts = {}) {
        const collections = await this.getCollections(opts);
        var result = [];
        collections.items.forEach((item) => {
            var cat = {
                code: item.slug,
                name: item.name,
            };
            if (item.filters.length > 0 &&
                item.filters[0].args.length > 0 &&
                item.filters[0].code === 'facet-value-filter' &&
                item.filters[0].args[0].name === 'facetValueIds') {
                const facetIds = item.filters[0].args[0].value;
                const facetId = JSON.parse(facetIds)[0];
                cat.identifier = facetId;
            }
            if ('atellixUrl' in item.customFields) {
                cat.atellixUrl = item.customFields.atellixUrl[0];
            }
            result.push(cat);
        });
        return result;
    }
    async createCategory(category) {
        const facetId = await this.createCategoryFacet({
            name: category.name,
            code: category.code,
        });
        if (!await this.hasCollection(category.code)) {
            var spec = {
                name: category.name,
                slug: category.code,
                facetValueIds: [facetId],
            };
            for (var k of ['atellixUrl', 'description']) {
                if (k in category) {
                    spec[k] = category[k];
                }
            }
            await this.createCollection(spec);
        }
        return facetId;
    }
    async updateCategory(category) {
        var result = '';
        const facetVals = await this.getFacetValues({
            filter: { id: { eq: category.identifier } },
            take: 1,
        });
        if (facetVals.totalItems > 0) {
            var code = facetVals.items[0].code;
            const collections = await this.getCollections({
                filter: { slug: { eq: code } },
                take: 1,
            });
            if (collections.totalItems > 0) {
                var collectionUpdate = {
                    identifier: collections.items[0].id,
                };
                const facetValueId = facetVals.items[0].id;
                var facetValueUpdate = {
                    identifier: facetValueId,
                };
                for (var k of ['name', 'slug', 'atellixUrl', 'description']) {
                    var ck = k;
                    if (ck === 'slug') {
                        ck = 'code';
                    }
                    if (ck in category) {
                        collectionUpdate[k] = category[ck];
                    }
                }
                for (var j of ['name', 'code']) {
                    if (j in category) {
                        facetValueUpdate[j] = category[j];
                    }
                }
                await this.updateFacetValues([facetValueUpdate]),
                    await this.updateCollection(collectionUpdate),
                    result = facetValueId;
            }
        }
        return result;
    }
    async deleteCategory(identifier) {
        const facetVals = await this.getFacetValues({
            filter: { id: { eq: identifier } },
            take: 1,
        });
        if (facetVals.totalItems > 0) {
            var code = facetVals.items[0].code;
            const collections = await this.getCollections({
                filter: { slug: { eq: code } },
                take: 1,
            });
            if (collections.totalItems > 0) {
                const collectionId = collections.items[0].id;
                const facetValueId = facetVals.items[0].id;
                await this.deleteFacetValues([facetValueId], true);
                const result = await this.deleteCollections([collectionId]);
                return result[0];
            }
        }
        return {
            result: 'NOT_DELETED',
            message: 'Collection and facet value not found',
        };
    }
    // Product Options
    async getProductOptionGroup(groupId) {
        const doc = `
query productOptionGroup ($id: ID!) {
    productOptionGroup (id: $id) {
        id
        code
        name
        translations {
            name
            languageCode
        }
        options {
            id
            code
            translations {
                name
                languageCode
            }
        }
    }
}
`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        const result = await this.gqlRequest(doc, { 'id': groupId }, this.authToken);
        return result.data.productOptionGroup;
    }
    async getProductOptionGroups(filterTerm) {
        const doc = `
query productOptionGroups ($filterTerm: String) {
    productOptionGroups (filterTerm: $filterTerm) {
        id
        code
        name
        translations {
            name
            languageCode
        }
        options {
            id
            code
            translations {
                name
                languageCode
            }
        }
    }
}
`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        const result = await this.gqlRequest(doc, { 'filterTerm': filterTerm }, this.authToken);
        return result.data.productOptionGroups;
    }
    async createProductOptionGroup(optgrp) {
        const doc = `
mutation createProductOptionGroup ($input: CreateProductOptionGroupInput!) {
    createProductOptionGroup(input: $input) {
        id
        code
        name
        translations {
            name
            languageCode
        }
        options {
            id
            code
            translations {
                name
                languageCode
            }
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        var params = {
            code: optgrp.code,
            translations: [{
                    languageCode: 'en',
                    name: optgrp.name,
                    customFields: {},
                }],
            customFields: {},
        };
        if ('options' in optgrp) {
            var optsList = [];
            const groupOptions = optgrp.options;
            groupOptions.forEach((opt) => {
                optsList.push({
                    code: opt.code,
                    translations: [{
                            languageCode: 'en',
                            name: opt.name,
                            customFields: {},
                        }],
                });
            });
            params.options = optsList;
        }
        const result = await this.gqlRequest(doc, { 'input': params }, this.authToken);
        return result.data.createProductOptionGroup;
    }
    /*    async updateProductOptionGroup(): Promise<void> {
            const doc: string = `
    `
            if (!this.authToken) {
                throw new Error('Authentication token required')
            }
            var params = {}
            const result = await this.gqlRequest(doc, {'options': params}, this.authToken)
            return result.data.X
        }*/
    async createProductOption(option) {
        const doc = `
mutation createProductOption ($input: CreateProductOptionInput!) {
    createProductOption(input: $input) {
        id
        code
        translations {
            name
            languageCode
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        var params = {
            productOptionGroupId: option.groupId,
            code: option.code,
            translations: [{
                    languageCode: 'en',
                    name: option.name,
                    customFields: {},
                }],
            customFields: {},
        };
        const result = await this.gqlRequest(doc, { 'input': params }, this.authToken);
        return result.data.createProductOption;
    }
    /*    async updateProductOption(): Promise<void> {
            const doc: string = `
    `
            if (!this.authToken) {
                throw new Error('Authentication token required')
            }
            var params = {}
            const result = await this.gqlRequest(doc, {'options': params}, this.authToken)
            return result.data.X
        }*/
    async deleteProductOption(optionId) {
        const doc = `
mutation deleteProductOption ($id: ID!) {
    deleteProductOption(id: $id) {
        result
        message
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        var params = {};
        const result = await this.gqlRequest(doc, { 'id': optionId }, this.authToken);
        return result.data.deleteProductOption;
    }
    async addOptionGroupToProduct(productId, optiontGroupId) {
        const doc = `
mutation addOptionGroupToProduct ($productId: ID!, $optionGroupId: ID!) {
    addOptionGroupToProduct(productId: $productId, optionGroupId: $optionGroupId) {
        id
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        const result = await this.gqlRequest(doc, { 'productId': productId, 'optionGroupId': optiontGroupId }, this.authToken);
        return result.data.addOptionGroupToProduct;
    }
    async removeOptionGroupFromProduct(productId, optiontGroupId, force = false) {
        const doc = `
mutation removeOptionGroupFromProduct ($id: ID!) {
    removeOptionGroupFromProduct(id: $id) {
        ... on Product {
            id
        }
    }
}`;
        if (!this.authToken) {
            throw new Error('Authentication token required');
        }
        const result = await this.gqlRequest(doc, { 'productId': productId, 'optionGroupId': optiontGroupId, 'force': force }, this.authToken);
        return result.data.removeOptionGroupFromProduct;
    }
}
exports.VendureClient = VendureClient;
//# sourceMappingURL=index.js.map