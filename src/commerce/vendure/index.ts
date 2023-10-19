import { AwesomeGraphQLClient } from 'awesome-graphql-client'
import { IOffer, IProduct, IProductGroup } from '../../record/interfaces'
import fetch from 'cross-fetch'

const https = require('https')
const FormData = require('form-data')
const { createReadStream } = require('fs')

export interface VendureLoginResult {
    success: boolean,
    authToken?: string,
}

export interface VendureStringTranslation {
    languageCode: string,
    name: string,
    customFields: any,
}

export interface VendureOptionCode {
    group: string,
    option: string,
}

export interface VendureOptionInput {
    groupId?: string,
    code: string,
    name: string,
}

export interface VendureOptionUpdate {
    code?: string,
    name?: string,
}

export interface VendureOptionGroupInput {
    name: string,
    code: string,
    options?: VendureOptionInput[],
}

export interface VendureOptionGroupUpdate {
    name?: string,
    code?: string,
}

export interface VendureFacetValue {
    code: string,
    name: string,
}

export interface VendureFacetValueUpdate {
    identifier: string,
    name?: string,
    code?: string,
}

export interface VendureCollectionInput {
    name: string,
    slug: string,
    atellixUrl?: string,
    description?: string,
    facetValueIds?: string[],
}

export interface VendureCollectionUpdate {
    identifier: string,
    name?: string,
    slug?: string,
    atellixUrl?: string,
    description?: string,
    facetValueIds?: string[],
}

export interface VendureCategoryOptions {
    take?: number
    skip?: number
    sort?: number
}

export interface VendureCategoryInput {
    code: string,
    name: string,
    atellixUrl?: string,
    description?: string,
}

export interface VendureCategoryUpdate {
    identifier: string, // Category FacetValue ID
    code?: string,
    name?: string,
    atellixUrl?: string,
    description?: string,
}

export interface VendureCategory {
    identifier?: string,
    code?: string,
    name?: string,
    atellixUrl?: string,
}

export interface VendureCategoryRecord {
    identifier: string,
}

export interface VendureDeleteResult {
    result: string,
    message: string,
}

export interface VendureAssetTag {
    value: string,
}

export interface VendureAssetUpload {
    file: string,
    tags?: VendureAssetTag[],
}

export interface VendureProduct extends IProduct {
    category?: VendureCategory,
    assets?: VendureAssetUpload[],
    enabled?: boolean,
    assetIds?: string,
    optionIds?: string[],
    optionCodes?: VendureOptionCode[],
    facetValueIds?: string,
    taxCategoryId?: string,
    featuredAssetId?: string,
}

export interface VendureProductGroup extends IProductGroup {
    category?: VendureCategory,
    assets?: VendureAssetUpload[],
    optionGroups?: VendureOptionGroupInput[],
    enabled?: boolean,
    assetIds?: string,
    facetValueIds?: string,
    featuredAssetId?: string,
}

function basename(path) {
    return path.split('/').reverse()[0]
}

const CHARS ='ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function randomString(len: number) {
    let result = ''
    const charactersLength = CHARS.length
    for ( let i = 0; i < len; i++ ) {
        result += CHARS.charAt(Math.floor(Math.random() * charactersLength))
    }
    return result
}

export class VendureClient {
    private adminApiUrl: string
    private authToken: string | undefined
    private categoryFacetId: string | undefined
    private gqlClient: AwesomeGraphQLClient

    constructor (
        adminApiUrl: string,
    ) {
        this.adminApiUrl = adminApiUrl
    }

    setAuthToken(authToken: string) {
        this.authToken = authToken
    }

    async gqlRequest(doc: string, vars: any, authToken: string = ''): Promise<any> {
        var headers: any = {}
        if (authToken) {
            headers['authorization'] = 'Bearer ' + (authToken as string)
        }
        //console.log('GQL Headers')
        //console.log(headers)
        const gqlClient = new AwesomeGraphQLClient({
            endpoint: this.adminApiUrl,
            fetch,
            FormData,
            fetchOptions: {
                headers: new Headers(headers),
                agent: new https.Agent({ keepAlive: true }),
            },
        })
        return new Promise((resolve, reject) => {
            gqlClient.requestSafe(doc, vars).then((result) => {
                //console.log('GQL Result')
                //console.log(result)
                if (result.ok) {
                    resolve({
                        'headers': result.response.headers,
                        'data': result.data,
                    })
                } else {
                    console.error(result.error)
                    reject(result.error)
                }
            }).catch((error) => {
                console.error(error)
                reject(error)
            })
        })
    }

    async login(token: string): Promise<VendureLoginResult> {
        const doc: string = `
mutation Authenticate($token: String!) {
    authenticate(input: {
        keycloak: {
            token: $token
        }
    }) {
        ...on CurrentUser { id }
    }
}`
        const vars: any = {
            'token': token
        }
        const result = await this.gqlRequest(doc, vars)
        if ('authenticate' in result.data && 'id' in result.data.authenticate) {
            const authToken: string = result.headers.get('vendure-auth-token')
            this.authToken = authToken
            return {
                'success': true,
                'authToken': authToken,
            }
        }
        return {'success': false }
    }

// Products

    async getProducts(params: any): Promise<any> {
        const doc: string = `
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
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        const result = await this.gqlRequest(doc, {'input': params}, this.authToken)
        return result.data.search
    }

    async createProductVariants(productId: any, variants: VendureProduct[], groupSpec: any = {}): Promise<string[]> {
        var variantList: any[] = []
        for (var i = 0; i < variants.length; i++) {
            const variant: VendureProduct = variants[i]
            var variantInfo: any = {
                'productId': productId,
                'translations': [{
                    'languageCode': 'en',
                    'name': variant.name,
                    'customFields': {},
                }],
                'facetValueIds': [],
                'sku': variant.sku,
                'price': (variant.offers as IOffer)[0].price,
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
            }
            for (var k of ['facetValueIds', 'taxCategoryId', 'optionIds', 'assetIds']) {
                if (k in variant) {
                    variantInfo[k] = variant[k]
                }
            }
            if (!('optionIds' in variant)) {
                if ('optionCodes' in variant) {
                    var optionIds: string[] = []
                    for (var optcode of (variant.optionCodes as VendureOptionCode[])) {
                        if (optcode.group in groupSpec && optcode.option in groupSpec[optcode.group]) {
                            optionIds.push(groupSpec[optcode.group][optcode.option])
                        }
                    }
                    variantInfo.optionIds = optionIds
                }
            }
            variantList.push(variantInfo)
        }
        const doc: string = `
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
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        const result = await this.gqlRequest(doc, {'input': variantList}, this.authToken)
        var ids: string[] = []
        for (var i = 0; i < result.data.createProductVariants.length; i++) {
            ids.push(result.data.createProductVariants[i].id)
        }
        if (variantList.length !== ids.length) {
            throw new Error('Unable to create all variants')
        }
        return ids
    }

    async updateProductVariants(variants: VendureProduct[]): Promise<string[]> {
        var variantList: any[] = []
        for (var i = 0; i < variants.length; i++) {
            const variant: VendureProduct = variants[i]
            var variantInfo: any = {
                'id': variant.identifier,
            }
            if ('name' in variant) {
                variantInfo['translations'] = [{
                    'languageCode': 'en',
                    'name': variant.name,
                }]
            }
            if ('offers' in variant && (variant.offers as IOffer[]).length > 0 && 'price' in (variant.offers as IOffer[])[0]) {
                variantInfo['price'] = (variant.offers as IOffer[])[0].price
            }
            for (var k of ['sku', 'enabled', 'facetValueIds', 'taxCategoryId', 'optionIds', 'assetIds']) {
                if (k in variant) {
                    variantInfo[k] = variant[k]
                }
            }
            variantList.push(variantInfo)
        }
        const doc: string = `
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
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        const result = await this.gqlRequest(doc, {'input': variantList}, this.authToken)
        var ids: string[] = []
        for (var i = 0; i < result.data.updateProductVariants.length; i++) {
            ids.push(result.data.updateProductVariants[i].id)
        }
        if (variantList.length !== ids.length) {
            throw new Error('Unable to update all variants')
        }
        return ids
    }

    async deleteProductVariants(ids: string[]): Promise<VendureDeleteResult[]> {
        const doc: string = `
mutation deleteProductVariants ($ids: [ID!]!) {
    deleteProductVariants(ids: $ids) {
        result
        message
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        const res = await this.gqlRequest(doc, {'ids': ids}, this.authToken)
        return res.data.deleteProductVariants
    }

    async createProduct(item: VendureProduct | VendureProductGroup): Promise<string> {
        var variants: VendureProduct[] = []
        var productGroup: boolean = false
        if ('hasVariant' in item) {
            productGroup = true
            variants = (item as VendureProductGroup).hasVariant as VendureProduct[]
        } else {
            variants = [item as VendureProduct]
        }
        var params: any = {
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
        }
        for (var k of ['enabled', 'facetValueIds', 'assetIds', 'featuredAssetId']) {
            if (k in item) {
                params[k] = item[k]
            }
        }
        // Include category facet value if specified directly (when including other facets)
        if (!('facetValueIds' in item)) {
            if ('category' in item) {
                var facetId: string
                if ('identifier' in (item.category as VendureCategoryRecord)) {
                    facetId = item?.category?.identifier as string
                } else {
                    // TODO: cache lookup
                    facetId = await this.createCategory(item?.category as VendureCategoryInput)
                }
                params.facetValueIds = [facetId]
            }
        }
        // Skip if assets are defined specifically
        if (!('assetIds' in item)) {
            if ('assets' in item) {
                if ((item.assets as VendureAssetUpload[]).length > 0) { 
                    var assetUploads = (item.assets as VendureAssetUpload[]).map((asset) => {
                        return this.findOrCreateAsset(asset)
                    })
                    params.assetIds = await Promise.all(assetUploads)
                }
                if (params.assetIds.length > 0) {
                    params.featuredAssetId = params.assetIds[0]
                }
            }
        }
        const doc: string = `
mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
        ...on Product {
            id
            name
            slug
        }
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        // Create products
        const cres = await this.gqlRequest(doc, {'input': params}, this.authToken)
        const productId: string = cres.data.createProduct.id
        var groupSpec: any = {}
        // Create product variant options
        if (productGroup) {
            const optionGroups = (item as VendureProductGroup).optionGroups as VendureOptionGroupInput[]
            for (var group of optionGroups) {
                // Translate code
                var origCode = group.code
                var grpCode = randomString(8) + '-' + origCode
                var opts: any = {}
                groupSpec[origCode] = opts
                group.code = grpCode
                const grpdata = await this.createProductOptionGroup(group)
                for (var option of grpdata.options) {
                    groupSpec[origCode][option.code] = option.id
                }
                await this.addOptionGroupToProduct(productId, grpdata.id)
            }
        }
        // Create product variants
        const variantIds = await this.createProductVariants(productId, variants, groupSpec)
        return productId
    }

    async updateProduct(item: VendureProduct) {
        var product: any = {
            'id': item.identifier,
        }
        var updateTranslations = false
        var updateTr: any = {
            'languageCode': 'en',
        }
        for (var k of ['name', 'description', 'slug']) {
            if (k in item) {
                updateTranslations = true
                updateTr[k] = item[k]
            }
        }
        if (updateTranslations) {
            product['translations'] = [updateTr]
        }
        for (var k of ['enabled', 'facetValueIds', 'assetIds', 'featuredAssetId']) {
            if (k in item) {
                product[k] = item[k]
            }
        }
        const doc: string = `
mutation UpdateProduct($input: UpdateProductInput!) {
    updateProduct(input: $input) {
        ...on Product {
            id
            name
            slug
        }
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        //console.log(product)
        const result = await this.gqlRequest(doc, {'input': product}, this.authToken)
        return result.data.updateProduct
    }

    async deleteProduct(productId: string): Promise<VendureDeleteResult> {
        const doc: string = `
mutation deleteProduct ($id: ID!) {
    deleteProduct(id: $id) {
        result
        message
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        const res = await this.gqlRequest(doc, {'id': productId}, this.authToken)
        return res.data.deleteProduct
    }

// Assets
    async getAssets(options: any): Promise<any> {
        const doc: string = `
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
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        var params: any = {}
        for (var k of ['tags', 'tagsOperator', 'skip', 'take', 'sort', 'filter', 'filterOperator']) {
            if (k in options) {
                params[k] = options[k]
            }
        }
        const result = await this.gqlRequest(doc, {'options': params}, this.authToken)
        return result.data.assets
    }

    async createAssets(assets: VendureAssetUpload[]): Promise<any> {
        const doc: string = `
mutation createAssets ($input: [CreateAssetInput!]!) {
    createAssets(input: $input) {
        ... on Asset {
            id
            name
        }
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        var params: any[] = []
        assets.forEach((val) => {
            var tags: VendureAssetTag[] = []
            if ('tags' in val) {
                tags = val.tags as VendureAssetTag[]
            }
            params.push({
                file: createReadStream(val.file),
                tags: tags,
                customFields: {},
            })
        })
        const result = await this.gqlRequest(doc, {'input': params}, this.authToken)
        return result.data.createAssets
    }

    async findOrCreateAsset(asset: VendureAssetUpload, force: boolean = false): Promise<string> {
        var create = true
        var result: string = ''
        if (!force) {
            const fp = basename(asset.file)
            const current = await this.getAssets({
                filter: { name: { eq: fp } },
                take: 1,
            })
            if (current.totalItems > 0) {
                create = false
                result = current.items[0].id
            }
        }
        if (create) {
            const added = await this.createAssets([asset])
            result = added[0].id
        }
        return result
    }

    async deleteAssets(assetIds: string[], force: boolean = false): Promise<VendureDeleteResult> {
        const doc: string = `
mutation deleteAssets ($input: DeleteAssetsInput!) {
    deleteAssets(input: $input) {
        result
        message
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        var params: any = {
            'assetIds': assetIds,
            'force': force,
            'deleteFromAllChannels': true,
        }
        const res = await this.gqlRequest(doc, {'input': params}, this.authToken)
        return res.data.deleteAssets
    }

// Facets

    async getFacets(options: any): Promise<any> {
        const doc: string = `
query facets ($options: FacetListOptions) {
    facets(options: $options) {
        totalItems
        items { 
            id
            name
            code
        }
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        var params = {}
        for (var k of ['skip', 'take', 'sort', 'filter', 'filterOperator']) {
            if (k in options) {
                params[k] = options[k]
            }
        }
        const facetsResult = await this.gqlRequest(doc, {'options': params}, this.authToken)
        return facetsResult.data.facets
    }

    async getFacetValues(options: any): Promise<any> {
        const doc: string = `
query facetValues ($options: FacetValueListOptions) {
    facetValues(options: $options) {
        totalItems
        items {
            id
            name
            code
        }
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        var params = {}
        for (var k of ['skip', 'take', 'sort', 'filter', 'filterOperator']) {
            if (k in options) {
                params[k] = options[k]
            }
        }
        const facetsResult = await this.gqlRequest(doc, {'options': params}, this.authToken)
        return facetsResult.data.facetValues
    }

    async createFacetValues(facetId: string, values: VendureFacetValue[]): Promise<string> {
        const doc: string = `
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
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        var params: any[] = []
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
            })
        })
        const facetVals = await this.gqlRequest(doc, {'input': params}, this.authToken)
        return facetVals.data.createFacetValues
    }

    async updateFacetValues(updates: VendureFacetValueUpdate[]): Promise<string> {
        const doc: string = `
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
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        var params: any[] = []
        updates.forEach((val) => {
            var updateFacetVal: any = {
                id: val.identifier, 
            }
            if ('code' in val) {
                updateFacetVal.code = val.code
            }
            if ('name' in val) {
                updateFacetVal.translations = [{
                    'name': val.name,
                    'languageCode': 'en',
                }]
            }
            params.push(updateFacetVal)
        })
        const facetVals = await this.gqlRequest(doc, {'input': params}, this.authToken)
        return facetVals.data.updateFacetValues
    }

    async deleteFacetValues(ids: string[], force: boolean = false): Promise<VendureDeleteResult[]> {
        const doc: string = `
mutation deleteFacetValues ($ids: [ID!]!, $force: Boolean) {
    deleteFacetValues(ids: $ids, force: $force) {
        result
        message
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        const res = await this.gqlRequest(doc, {'ids': ids, 'force': force}, this.authToken)
        return res.data.deleteFacetValues
    }

    async getCategoryFacetId(): Promise<string> {
        const facets = await this.getFacets({
            filter: { code: { eq: 'category' } },
            take: 1,
        })
        this.categoryFacetId = facets.items[0].id
        return facets.items[0].id
    }

    async hasCategoryFacet(categoryCode: string): Promise<boolean> {
        const categoryFacetId = this.categoryFacetId ?? await this.getCategoryFacetId()
        const facetVals = await this.getFacetValues({
            filter: { code: { eq: categoryCode } },
            take: 1,
        })
        if (facetVals.totalItems > 0) {
            return true
        }
        return false
    }

    async createCategoryFacet(facet: VendureFacetValue): Promise<string> {
        if (!await this.hasCategoryFacet(facet.code)) {
            await this.createFacetValues(this.categoryFacetId as string, [{ name: facet.name, code: facet.code }])
        }
        const facetVals = await this.getFacetValues({
            filter: { code: { eq: facet.code } },
            take: 1,
        })
        if (facetVals.totalItems < 1) {
            Promise.reject('Category facet value not found for code: ' + facet.code)
        }
        return facetVals.items[0].id
    }

    async deleteCategoryFacet(categoryCode: string): Promise<void> {
        const categoryFacetId = this.categoryFacetId ?? await this.getCategoryFacetId()
        const facetVals = await this.getFacetValues({
            filter: { code: { eq: categoryCode } },
            take: 1,
        })
        if (facetVals.totalItems > 0) {
            await this.deleteFacetValues([facetVals.items[0].id])
        }
    }

// Collections

    async hasCollection(slug: string): Promise<boolean> {
        const collections = await this.getCollections({
            filter: { slug: { eq: slug } },
            take: 1,
        })
        if (collections.totalItems > 0) {
            return true
        }
        return false
    }

    async getCollections(options: any): Promise<any> {
        const doc: string = `
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
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        var params = {}
        for (var k of ['topLevelOnly', 'skip', 'take', 'sort', 'filter', 'filterOperator']) {
            if (k in options) {
                params[k] = options[k]
            }
        }
        const collectionResult = await this.gqlRequest(doc, {'options': params}, this.authToken)
        return collectionResult.data.collections
    }

    async createCollection(collection: VendureCollectionInput): Promise<string> {
        const doc: string = `
mutation createCollection ($input: CreateCollectionInput!) {
    createCollection(input: $input) {
        id
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        var params: any = {
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
                description: collection.description ?? '',
                customFields: {},
            },
            customFields: {},
        }
        if ('atellixUrl' in collection) {
            params.customFields = { atellixUrl: collection.atellixUrl }
        }
        if ('facetValueIds' in collection) {
            params.filters = [
                { code: 'facet-value-filter', arguments: [
                    { name: 'facetValueIds', value: JSON.stringify(collection.facetValueIds) },
                    { name: 'containsAny', value: 'false' },
                    { name: 'combineWithAnd', value: 'true' },
                ] },
            ]
        }
        const collectionResult = await this.gqlRequest(doc, {'input': params}, this.authToken)
        return collectionResult.data.createCollection.id
    }

    async updateCollection(collection: VendureCollectionUpdate): Promise<string> {
        const doc: string = `
mutation updateCollection ($input: UpdateCollectionInput!) {
    updateCollection(input: $input) {
        id
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        var params: any = {
            id: collection.identifier,
        }
        if ('atellixUrl' in collection) {
            params.customFields = { atellixUrl: collection.atellixUrl }
        }
        if ('facetValueIds' in collection) {
            params.filters = [
                { code: 'facet-value-filter', arguments: [
                    { name: 'facetValueIds', value: JSON.stringify(collection.facetValueIds) },
                    { name: 'containsAny', value: 'false' },
                    { name: 'combineWithAnd', value: 'true' },
                ] },
            ]
        }
        var updateTranslations = false
        var updateTr: any = {
            'languageCode': 'en',
        }
        for (var k of ['name', 'description', 'slug']) {
            if (k in collection) {
                updateTranslations = true
                updateTr[k] = collection[k]
            }
        }
        if (updateTranslations) {
            params.translations = [updateTr]
        }
        const collectionResult = await this.gqlRequest(doc, {'input': params}, this.authToken)
        return collectionResult.data.updateCollection.id
    }

    async deleteCollections(ids: string[]): Promise<VendureDeleteResult[]> {
        const doc: string = `
mutation deleteCollections ($ids: [ID!]!) {
    deleteCollections(ids: $ids) {
        result
        message
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        const res = await this.gqlRequest(doc, {'ids': ids}, this.authToken)
        return res.data.deleteCollections
    }

// Categories

    async getCategories(opts: VendureCategoryOptions = {}): Promise<VendureCategory[]> {
        const collections = await this.getCollections(opts)
        var result: VendureCategory[] = []
        collections.items.forEach((item) => {
            var cat: VendureCategory = {
                code: item.slug,
                name: item.name,
            }
            if (
                item.filters.length > 0 &&
                item.filters[0].args.length > 0 &&
                item.filters[0].code === 'facet-value-filter' &&
                item.filters[0].args[0].name === 'facetValueIds'
            ) {
                const facetIds: string = item.filters[0].args[0].value
                const facetId: string = JSON.parse(facetIds)[0] as string
                cat.identifier = facetId
            }
            if ('atellixUrl' in item.customFields) {
                cat.atellixUrl = item.customFields.atellixUrl[0]
            }
            result.push(cat)
        })
        return result
    }

    async createCategory(category: VendureCategoryInput): Promise<string> {
        const facetId: string = await this.createCategoryFacet({
            name: category.name,
            code: category.code,
        })
        if (!await this.hasCollection(category.code)) {
            var spec: VendureCollectionInput = {
                name: category.name,
                slug: category.code,
                facetValueIds: [facetId],
            }
            for (var k of ['atellixUrl', 'description']) {
                if (k in category) {
                    spec[k] = category[k]
                }
            }
            await this.createCollection(spec)
        }
        return facetId
    }

    async updateCategory(category: VendureCategoryUpdate): Promise<string> {
        var result = ''
        const facetVals = await this.getFacetValues({
            filter: { id: { eq: category.identifier } },
            take: 1,
        })
        if (facetVals.totalItems > 0) {
            var code = facetVals.items[0].code
            const collections = await this.getCollections({
                filter: { slug: { eq: code } },
                take: 1,
            })
            if (collections.totalItems > 0) {
                var collectionUpdate: any = {
                    identifier: collections.items[0].id,
                }
                const facetValueId = facetVals.items[0].id
                var facetValueUpdate: any = {
                    identifier: facetValueId,
                }
                for (var k of ['name', 'slug', 'atellixUrl', 'description']) {
                    var ck: string = k
                    if (ck === 'slug') {
                        ck = 'code'
                    }
                    if (ck in category) {
                        collectionUpdate[k] = category[ck]
                    }
                }
                for (var j of ['name', 'code']) {
                    if (j in category) {
                        facetValueUpdate[j] = category[j]
                    }
                }
                await this.updateFacetValues([facetValueUpdate as VendureFacetValueUpdate]),
                await this.updateCollection(collectionUpdate as VendureCollectionUpdate),
                result = facetValueId
            }
        }
        return result
    }

    async deleteCategory(identifier: string): Promise<VendureDeleteResult> {
        const facetVals = await this.getFacetValues({
            filter: { id: { eq: identifier } },
            take: 1,
        })
        if (facetVals.totalItems > 0) {
            var code = facetVals.items[0].code
            const collections = await this.getCollections({
                filter: { slug: { eq: code } },
                take: 1,
            })
            if (collections.totalItems > 0) {
                const collectionId: string = collections.items[0].id
                const facetValueId = facetVals.items[0].id
                await this.deleteFacetValues([facetValueId], true)
                const result = await this.deleteCollections([collectionId])
                return result[0]
            }
        }
        return {
            result: 'NOT_DELETED',
            message: 'Collection and facet value not found',
        }
    }

// Product Options
    async getProductOptionGroup(groupId: string): Promise<any> {
        const doc: string = `
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
`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        const result = await this.gqlRequest(doc, {'id': groupId}, this.authToken)
        return result.data.productOptionGroup
    }

    async getProductOptionGroups(filterTerm: string): Promise<any> {
        const doc: string = `
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
`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        const result = await this.gqlRequest(doc, {'filterTerm': filterTerm}, this.authToken)
        return result.data.productOptionGroups
    }

    async createProductOptionGroup(optgrp: VendureOptionGroupInput): Promise<any> {
        const doc: string = `
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
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        var params: any = {
            code: optgrp.code,
            translations: [{
                languageCode: 'en',
                name: optgrp.name,
                customFields: {},
            }],
            customFields: {},
        }
        if ('options' in optgrp) {
            var optsList: any[] = []
            const groupOptions = optgrp.options as VendureOptionInput[]
            groupOptions.forEach((opt) => {
                optsList.push({
                    code: opt.code,
                    translations: [{
                        languageCode: 'en',
                        name: opt.name,
                        customFields: {},
                    }],
                })
            })
            params.options = optsList
        }
        const result = await this.gqlRequest(doc, {'input': params}, this.authToken)
        return result.data.createProductOptionGroup
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

    async createProductOption(option: VendureOptionInput): Promise<void> {
        const doc: string = `
mutation createProductOption ($input: CreateProductOptionInput!) {
    createProductOption(input: $input) {
        id
        code
        translations {
            name
            languageCode
        }
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        var params = {
            productOptionGroupId: option.groupId as string,
            code: option.code,
            translations: [{
                languageCode: 'en',
                name: option.name,
                customFields: {},
            }],
            customFields: {},
        }
        const result = await this.gqlRequest(doc, {'input': params}, this.authToken)
        return result.data.createProductOption
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

    async deleteProductOption(optionId: string): Promise<VendureDeleteResult> {
        const doc: string = `
mutation deleteProductOption ($id: ID!) {
    deleteProductOption(id: $id) {
        result
        message
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        var params = {}
        const result = await this.gqlRequest(doc, {'id': optionId}, this.authToken)
        return result.data.deleteProductOption
    }

    async addOptionGroupToProduct(productId: string, optiontGroupId: string): Promise<void> {
        const doc: string = `
mutation addOptionGroupToProduct ($productId: ID!, $optionGroupId: ID!) {
    addOptionGroupToProduct(productId: $productId, optionGroupId: $optionGroupId) {
        id
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        const result = await this.gqlRequest(doc, {'productId': productId, 'optionGroupId': optiontGroupId}, this.authToken)
        return result.data.addOptionGroupToProduct
    }

    async removeOptionGroupFromProduct(productId: string, optiontGroupId: string, force: boolean = false): Promise<any> {
        const doc: string = `
mutation removeOptionGroupFromProduct ($id: ID!) {
    removeOptionGroupFromProduct(id: $id) {
        ... on Product {
            id
        }
    }
}`
        if (!this.authToken) {
            throw new Error('Authentication token required')
        }
        const result = await this.gqlRequest(doc, {'productId': productId, 'optionGroupId': optiontGroupId, 'force': force}, this.authToken)
        return result.data.removeOptionGroupFromProduct
    }
}

