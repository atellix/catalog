import { GetProgramAccountsFilter, PublicKey, Keypair, Transaction, TransactionInstruction, Ed25519Program, SYSVAR_INSTRUCTIONS_PUBKEY, SystemProgram } from '@solana/web3.js'
import { v4 as uuidv4, parse as uuidparse, stringify as uuidstr } from 'uuid'
import { BN, Idl, AnchorProvider, Program } from '@coral-xyz/anchor'
import { JsonLdParser } from 'jsonld-streaming-parser'
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Readable } from 'readable-stream'
import bufLayout from 'buffer-layout'
import base64js from 'base64-js'
import { Buffer } from 'buffer'
import fetch from 'cross-fetch'
import base64 from 'base-64'
import BitSet from 'bitset'
import jsSHA from 'jssha'
import bs58 from 'bs58'
import N3 from 'n3'

import { SerializerJsonld } from './serializer.js'
import catalogProgramIDL from './catalog.json'


export const ATELLIX_CATALOG = {
    'metadata': 0,
    'public': 1,
    'commerce': 2,
    'event': 3,
    'realestate': 4,
    'investment': 5,
    'employment': 6,
}

export const ATELLIX_CATALOG_ID = {
    '0': 'metadata',
    '1': 'public',
    '2': 'commerce',
    '3': 'event',
    '4': 'realestate',
    '5': 'investment',
    '6': 'employment',
}

export interface Listing {
    catalog: string,
    listing_account: string,
    listing_index: number,
    category: string,
    locality: string[],
    url: string,
    uuid: string,
    label: string,
    detail: string,
    latitude?: number,
    longitude?: number,
    owner: string,
    attributes: any,
    update_count: number,
    update_ts: Date,
}

export interface ListingData {
    catalog: string,
    base: string,
    category: string,
    label: string,
    detail: string,
    attributes: string[],
    latitude?: number,
    longitude?: number,
    locality: string[],
    owner: PublicKey,
}

export interface ListingSpec {
    owner: PublicKey,
    catalog: string,
    category: string,
    filter_by_1: string,
    filter_by_2: string,
    filter_by_3: string,
    attributes: number,
    latitude: string,
    longitude: string,
    listing_url: URLEntry,
    label_url: URLEntry,
    detail_url: URLEntry,
}

export interface URLEntry {
    text: string,
    expand: number,
}

export interface URLEntryInstruction {
    entry: URLEntry,
    exists: boolean,
    publicKey: PublicKey,
    instruction?: TransactionInstruction,
}

export interface ListingQuery {
    catalog: string,
    category?: string,
    source?: 'solana' | 'catalog',
    take?: number,
    skip?: number,
}

export interface ListingQueryResult {
    count: number,
    listings: Listing[],
}

export interface ListingResult {
    result: string,
    error?: string,
    count: number,
    listings: any[],
}

export interface ListingEntriesQuery {
    url: string,
    take?: number,
    skip?: number,
    sort?: 'price' | 'name',
    reverse?: boolean,
}

export interface ListingEntriesResult {
    result: string,
    error?: string,
    count: number,
    entries: any[],
}

export interface ListingInstructions {
    uuid: string,
    catalog: number,
    urlEntries: URLEntryInstruction[],
    transaction: Transaction,
}

export interface ListingAddData {
    attributes: string[],
    category: string,
    detail: object,
    filter_by_1: string | null,
    filter_by_2: string | null,
    filter_by_3: string | null,
    label: string,
    latitude: string | null,
    longitude: string | null,
}

export interface ListingSyncData {
    result: string
    listing_add: Array<ListingAddData>,
    listing_remove: string[],
}

export interface ListingSyncResult {
    listingsAdded: string[],
    listingsRemoved: string[],
}

export interface CatalogRootData {
    rootData: PublicKey,
    authData: PublicKey,
}

export interface AccessTokenData {
    access_token: string,
}

export interface ListingCategoryURL {
    url: string,
}

export interface CategoryTreePath {
    key: string,
    name: string,
}

export interface CategoryTreeNode {
    url: string,
    name?: string,
    slug?: string,
    path?: CategoryTreePath[],
    parent?: string,
    subcategories?: CategoryTreeNode[],
    listing_categories?: ListingCategoryURL[],
}

export interface GetCategortListRequest {
    tree?: string,
    base?: string,
    depth?: number,
}

export interface GetCategortListResult {
    categories: CategoryTreeNode[],
    result: string,
    error?: string,
}

export interface SearchRequest {
    query: string,
    take?: number,
    skip?: number,
    catalog?: string,
    category?: string,
}

export interface SearchResult {
    result: string,
    error?: string,
    count: number,
    entries: any[],
}

export const listingAttributes: string[] = [
    'InPerson',
    'LocalDelivery',
    'OnlineDownload',
    'RequestForProposal',
]

function getLonLatString (latlon: number): string {
    latlon = latlon * (10**7)
    return latlon.toFixed(0)
}

function getHashBN (val): BN {
    const shaObj = new jsSHA('SHAKE128', 'TEXT', { encoding: 'UTF8' })
    const hashData = shaObj.update(val).getHash('UINT8ARRAY', { outputLen: 128 })
    return new BN(hashData)
}

async function decodeURL (catalogProgram, listingData, urlEntry) {
    const urlData = await catalogProgram.account.catalogUrl.fetch(urlEntry)
    if (urlData.urlExpandMode === 0) {             // None
        return urlData.url
    } else if (urlData.urlExpandMode === 1) {      // AppendUUID
        const url = urlData.url
        const uuid = uuidstr(listingData.uuid.toBuffer().toJSON().data)
        return url + uuid
    } else if (urlData.urlExpandMode === 2) {      // UTF8UriEncoded
        const url = urlData.url
        const decoded = decodeURIComponent(url)
        return decoded
    }
}

function readAttributes(attrValue) {
    var hval = attrValue.toString(16)
    var bset = new BitSet('0x' + hval)
    var attrs = {}
    for (var i = 0; i < listingAttributes.length; i++) {
        if (bset.get(i)) {
            attrs[listingAttributes[i]] = true
        }
    }
    return attrs
}

export function postJson (url: string, jsonData: any, token: string | undefined = undefined): Promise<any> {
    const headers = new Headers()
    headers.append('Content-Type', 'application/json')
    if (token) {
        headers.append('Authorization', 'Bearer ' + token)
    }
    const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(jsonData),
    }
    return new Promise((resolve, reject) => {
        fetch(url, options)
            .then(response => { return response.json() })
            .then(json => { resolve(json) })
            .catch(error => { reject(error) })
    })
}

export function graphToJsonld(store: any, baseIRI: string): Promise<string> {
    const writer = new SerializerJsonld({
        baseIRI: baseIRI,
        context: {
            '@vocab': 'http://schema.org/',
        },
        compact: true,
        encoding: 'object',
    })
    const input = new Readable({
        objectMode: true,
        read: () => {
            store.forEach((q) => { input.push(q) })
            input.push(null)
        }
    })
    return new Promise((resolve, reject) => {
        const output = writer.import(input)
        output.on('data', jsonld => {
            resolve(jsonld)
        })
    })
}

export function jsonldToGraph (jsonText: string): Promise<any> {
    return new Promise((resolve, reject) => {
        const store = new N3.Store()
        const parser = new JsonLdParser()
        parser
            .on('data', (q) => store.addQuad(q))
            .on('error', console.error)
            .on('end', () => resolve(store))
        parser.write(jsonText)
        parser.end()
    })
}

export class ListingClient {
    public accessToken: string

    private provider: AnchorProvider
    private catalogProgram: Program
    private baseUrl: string
    private authUrl: string
    private apiKey: string

    constructor (
        provider: AnchorProvider,
        catalogProgram: Program | undefined,
        baseUrl: string | undefined,
        authUrl: string | undefined,
        apiKey: string | undefined,
    ) {
        if (this.provider) {
            this.provider = provider
        } else {
            if (!process.env.ANCHOR_WALLET) {
                process.env.ANCHOR_WALLET = 'id.json'
            }
            if (!process.env.ANCHOR_PROVIDER_URL) {
                process.env.ANCHOR_PROVIDER_URL = 'https://api.mainnet-beta.solana.com'
            }
            this.provider = AnchorProvider.env()
        }
        if (catalogProgram) {
            this.catalogProgram = catalogProgram
        } else {
            const pk = ((catalogProgramIDL as any).metadata as any).address
            this.catalogProgram = new Program(catalogProgramIDL as Idl, new PublicKey(pk))
        }
        this.baseUrl = baseUrl ?? 'https://catalog.atellix.com'
        this.authUrl = authUrl ?? 'https://app.atellix.com'
        this.apiKey = apiKey ?? ''
        this.accessToken = ''
    }

    // UUID Offset = 8
    // Catalog ID Offset = 24
    // Category Offset = 32
    // Filter By Offset = 48
    async getListings (query: ListingQuery): Promise<ListingQueryResult> {
        if (!(query.catalog in ATELLIX_CATALOG)) {
            throw new Error('Invalid catalog: ' + query.catalog)
        }
        var listings: Listing[] = []
        var source = query.source ?? 'catalog'
        var count
        if (source === 'catalog') {
            const url = this.baseUrl + '/api/catalog/query'
            const params: any = {
                'command': 'get_listings',
                'catalog': ATELLIX_CATALOG[query.catalog],
            }
            if (query.category) {
                params['category'] = query.category
            }
            if (query.skip) {
                params['skip'] = query.skip
            }
            if (query.take) {
                params['take'] = query.take
            }
            const result = await postJson(url, params) as ListingResult
            if (result.result !== 'ok') {
                throw new Error(result.error ?? 'Request error')
            }
            count = result.count
            listings = result.listings
        } else if (source === 'solana') {
            const listingPrefix: Array<number> = [0x27, 0xea, 0xf9, 0x5e, 0x28, 0x32, 0xf4, 0x49]
            const catbuf = Buffer.alloc(8)
            catbuf.writeBigUInt64LE(BigInt(ATELLIX_CATALOG[query.catalog]))
            var prefix: number[] = catbuf.toJSON().data
            var filters: GetProgramAccountsFilter[] = [
                { memcmp: { bytes: bs58.encode(listingPrefix), offset: 0 } },
                { memcmp: { bytes: bs58.encode(prefix), offset: 24 } },
            ]
            if (query.category) {
                const category = getHashBN(query.category)
                var catdata: Array<number> = category.toBuffer().toJSON().data
                catdata.reverse() // Borsh uses little-endian integers
                prefix = prefix.concat(catdata)
                filters[1] = { memcmp: { bytes: bs58.encode(prefix), offset: 24 } }
            }
            const accountList = await this.provider.connection.getProgramAccounts(this.catalogProgram.programId, { filters: filters })
            for (var i = 0; i < accountList.length; i++) {
                const act = accountList[i]
                const listingData = await this.catalogProgram.account.catalogEntry.fetch(new PublicKey(act.pubkey))
                var locality: string[] = []
                for (var j = 0; j < (listingData.filterBy as any[]).length; j++) {
                    var localFilter: any = (listingData as any).filterBy[j]
                    if (localFilter.toString() !== '0') {
                        locality.push(await this.getURI(localFilter.toBuffer()))
                    }
                }
                var listing: Listing = {
                    'catalog': ATELLIX_CATALOG_ID[Number(query.catalog).toString()],
                    'listing_account': act.pubkey.toString(),
                    'listing_index': parseInt((listingData.listingIdx as BN).toString()),
                    'category': await this.getURI((listingData.category as any).toBuffer()),
                    'locality': locality,
                    'url': await decodeURL(this.catalogProgram, listingData, listingData.listingUrl),
                    'uuid': uuidstr((listingData.uuid as any).toBuffer().toJSON().data),
                    'label': await decodeURL(this.catalogProgram, listingData, listingData.labelUrl),
                    'detail': JSON.parse(await decodeURL(this.catalogProgram, listingData, listingData.detailUrl)),
                    'owner': (listingData.owner as PublicKey).toString(),
                    'attributes': readAttributes(listingData.attributes),
                    'update_count': parseInt((listingData.updateCount as BN).toString()),
                    'update_ts': new Date(1000 * parseInt((listingData.updateTs as BN).toString())),
                }
                var lat: number | null = null
                var lon: number | null = null
                if (Math.abs(listingData.latitude as number) < 2000000000 && Math.abs(listingData.longitude as number) < 2000000000) {
                    listing['latitude'] = listingData.latitude as number / (10 ** 7)
                    listing['longitude'] = listingData.longitude as number / (10 ** 7)
                }
                listings.push(listing)
            }
            count = listings.length
        }
        return {
            count: count,
            listings: listings,
        }
    }

    async getListingEntries (query: ListingEntriesQuery): Promise<ListingEntriesResult> {
        var params: any = { 'command': 'get_listing_entries' }
        if (query.skip) {
            params['skip'] = query.skip
        }
        if (query.take) {
            params['take'] = query.take
        }
        if (query.sort) {
            params['sort'] = query.sort
        }
        if (query.reverse) {
            params['reverse'] = query.reverse
        }
        const result = await postJson(query.url, params) as ListingEntriesResult
        if (result.result !== 'ok') {
            throw new Error(result.error ?? 'Request error')
        }
        return result
    }

    async getCategoryList(req: GetCategortListRequest): Promise<GetCategortListResult> {
        const url = this.baseUrl + '/api/catalog/category'
        var params: any = {
            'command': 'get_category_list',
            'tree': null,
            'base': null,
            'depth': 1,
        }
        for (var k of ['tree', 'base', 'depth']) {
            if (k in req) {
                params[k] = req[k]
            }
        }
        const result = await postJson(url, params) as GetCategortListResult
        if (result.result !== 'ok') {
            throw new Error(result.error ?? 'Request error')
        }
        return result
    }

    async search(req: SearchRequest): Promise<SearchResult> {
        const url = this.baseUrl + '/api/catalog/search'
        var params: any = {
            'command': 'search',
            'catalog': req.catalog ?? 'commerce',
        }
        for (var k of ['query', 'take', 'skip', 'catalog', 'category']) {
            if (k in req) {
                params[k] = req[k]
            }
        }
        const result = await postJson(url, params) as SearchResult
        if (result.result !== 'ok') {
            throw new Error(result.error ?? 'Request error')
        }
        return result
    }

    async getURLEntry(url: string, expandMode: number = 0): Promise<PublicKey> {
        const bufExpand = Buffer.alloc(1)
        bufExpand.writeUInt8(expandMode)
        const shaObj = new jsSHA('SHAKE128', 'TEXT', { encoding: 'UTF8' })
        const hashData = shaObj.update(url).getHash('UINT8ARRAY', { outputLen: 128})
        const bufHash = Buffer.from(hashData)
        const addr = await PublicKey.findProgramAddress([bufExpand, bufHash], this.catalogProgram.programId)
        return addr[0]
    }

    async getURLEntryInstruction(entry: URLEntry, feePayer: Keypair): Promise<URLEntryInstruction> {
        const urlEntry = await this.getURLEntry(entry.text, entry.expand)
        let account = await this.provider.connection.getAccountInfo(urlEntry)
        if (account) {
            return {
                entry: entry,
                exists: true,
                publicKey: urlEntry,
            }
        }
        return {
            entry: entry,
            exists: false,
            publicKey: urlEntry,
            instruction: this.catalogProgram.instruction.createUrl(
                entry.expand, // URL Mode
                getHashBN(entry.text),
                entry.text.length,
                entry.text,
                {
                    'accounts': {
                        admin: feePayer.publicKey,
                        urlEntry: urlEntry,
                        systemProgram: SystemProgram.programId,
                    },
                    'signers': [feePayer],
                },
            )
        }
    }

    writeAttributes (attrs: any): number {
        var bset = new BitSet()
        for (var i = 0; i < listingAttributes.length; i++) {
            if (attrs[listingAttributes[i]]) {
                bset.set(i, 1)
            } else {
                bset.set(i, 0)
            }
        }
        var value = parseInt(bset.toString(16), 16)
        return value
    }

    getListingSpec (listingData: ListingData): ListingSpec {
        var latitude = '2000000000'
        var longitude = '2000000000'
        if (listingData.latitude !== undefined) {
            latitude = getLonLatString(listingData.latitude)
        }
        if (listingData.longitude !== undefined) {
            longitude = getLonLatString(listingData.longitude)
        }
        var attributes = {}
        if (typeof listingData['attributes'] !== 'undefined') {
            for (var i = 0; i < listingData['attributes'].length; i++) {
                var attr = listingData['attributes'][i]
                attributes[attr] = true
            }
        }
        var buf1 = Buffer.alloc(4)
        var buf2 = Buffer.alloc(4)
        bufLayout.s32().encode(latitude, buf1)
        bufLayout.s32().encode(longitude, buf2)
        const category = getHashBN(listingData.category)
        var locality1 = new BN(0)
        var locality2 = new BN(0)
        var locality3 = new BN(0)
        if (listingData.locality.length > 0) {
            locality1 = getHashBN(listingData.locality[0])
        }
        if (listingData.locality.length > 1) {
            locality2 = getHashBN(listingData.locality[1])
        }
        if (listingData.locality.length > 2) {
            locality3 = getHashBN(listingData.locality[2])
        }
        const spec: ListingSpec = {
            catalog: listingData.catalog,
            category: category.toString(),
            filter_by_1: locality1.toString(),
            filter_by_2: locality2.toString(),
            filter_by_3: locality3.toString(),
            attributes: this.writeAttributes(attributes),
            latitude: base64js.fromByteArray(buf1),
            longitude: base64js.fromByteArray(buf2),
            owner: listingData.owner,
            listing_url: { text: listingData.base, expand: 1 },
            label_url: { text: encodeURIComponent(listingData.label), expand: 2 },
            detail_url: { text: encodeURIComponent(listingData.detail), expand: 2 },
        }
        return spec
    }

    async getListingInstructions (listingSpec: ListingSpec, owner: Keypair, feePayer: Keypair, catalog: string): Promise<ListingInstructions> {
        var listingPost: any = { ...listingSpec }
        listingPost.command = 'sign_listing'
        listingPost.catalog = catalog
        listingPost.owner = base64js.fromByteArray(listingSpec.owner.toBuffer())
        const url = this.baseUrl + '/api/catalog/listing'
        const signedResult = await postJson(url, listingPost, this.accessToken)
        if (signedResult.result !== 'ok') {
            throw new Error(signedResult.error ?? 'Request error')
        }
        //console.log(signedResult)
        const listingId = signedResult.uuid
        const listingBuf = Buffer.from(uuidparse(listingId))
        const catalogId = BigInt(signedResult.catalog)
        const catalogBuf = Buffer.alloc(8)
        catalogBuf.writeBigUInt64BE(catalogId)
        const catalogAddr = await PublicKey.findProgramAddress([Buffer.from('catalog', 'utf8'), catalogBuf], this.catalogProgram.programId)
        const catalogPK = catalogAddr[0]
        const listingAddr = await PublicKey.findProgramAddress([catalogBuf, listingBuf], this.catalogProgram.programId)
        const listingPK = listingAddr[0]
        const signerPK = new PublicKey(signedResult.pubkey)
        const feeMintPK = new PublicKey(signedResult.fee_mint)
        const feeAccountAddr = await PublicKey.findProgramAddress(
            [feePayer.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), feeMintPK.toBuffer()], ASSOCIATED_TOKEN_PROGRAM_ID
        )
        const feeSourcePK = feeAccountAddr[0]
        var tx = new Transaction()
        tx.add(Ed25519Program.createInstructionWithPublicKey({
            message: base64js.toByteArray(signedResult.message),
            publicKey: signerPK.toBytes(),
            signature: bs58.decode(signedResult.sig),
        }))
        /*console.log({
            owner: listingSpec.owner.toString(),
            catalog: catalogPK.toString(),
            listing: listingPK.toString(),
            feePayer: feePayer.toString(),
            feeSource: feeSourcePK.toString(),
            feeAccount: (new PublicKey(signedResult.fee_account)).toString(),
            ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY.toString(),
            systemProgram: SystemProgram.programId.toString(),
            tokenProgram: TOKEN_PROGRAM_ID.toString(),
        })*/
        tx.add(this.catalogProgram.instruction.createListing(
            new BN(uuidparse(listingId)),
            {
                'accounts': {
                    owner: listingSpec.owner,
                    catalog: catalogPK,
                    listing: listingPK,
                    feePayer: feePayer.publicKey,
                    feeSource: feeSourcePK,
                    feeAccount: new PublicKey(signedResult.fee_account),
                    ixSysvar: SYSVAR_INSTRUCTIONS_PUBKEY,
                    systemProgram: SystemProgram.programId,
                    tokenProgram: TOKEN_PROGRAM_ID,
                },
                'signers': [owner, feePayer],
            },
        ))
        var entries: URLEntryInstruction[] = []
        var listing_url: URLEntryInstruction = await this.getURLEntryInstruction(listingSpec.listing_url, feePayer)
        if (!listing_url.exists) {
            entries.push(listing_url)
        }
        var label_url: URLEntryInstruction = await this.getURLEntryInstruction(listingSpec.label_url, feePayer)
        if (!label_url.exists) {
            entries.push(label_url)
        }
        var detail_url: URLEntryInstruction = await this.getURLEntryInstruction(listingSpec.detail_url, feePayer)
        if (!detail_url.exists) {
            entries.push(detail_url)
        }
        const li: ListingInstructions = {
            uuid: signedResult.uuid,
            catalog: parseInt(signedResult.catalog),
            urlEntries: entries,
            transaction: tx,
        }
        return li
    }

    async getCatalogRootData (): Promise<CatalogRootData> {
        const rootData = await PublicKey.findProgramAddress(
            [this.catalogProgram.programId.toBuffer()], this.catalogProgram.programId
        )
        const rootDataPK = rootData[0]
        const rootAccount = await this.catalogProgram.account.rootData.fetch(rootDataPK)
        return {
            rootData: rootDataPK,
            authData: rootAccount.rootAuthority as PublicKey,
        }
    }

    async removeListing (programRoot: CatalogRootData, listing: string, owner: Keypair, feeRecipient: Keypair): Promise<string> {
        const listingPK = new PublicKey(listing)
        const listingData = await this.catalogProgram.account.catalogEntry.fetch(listingPK)
        var catBuf = Buffer.alloc(8)
        catBuf.writeBigUInt64BE(BigInt((listingData.catalog as BN).toString()))
        const catalog = await PublicKey.findProgramAddress(
            [Buffer.from('catalog', 'utf8'), catBuf], this.catalogProgram.programId
        )
        const catalogPK = catalog[0]
        var tx = new Transaction()
        tx.add(this.catalogProgram.instruction.removeListing(
            {
                'accounts': {
                    rootData: programRoot.rootData,
                    authData: programRoot.authData,
                    authUser: owner.publicKey,
                    catalog: catalogPK,
                    listing: listingPK,
                    feeRecipient: feeRecipient.publicKey,
                    systemProgram: SystemProgram.programId,
                },
            },
        ))
        let sig
        if (owner.publicKey.toString() === this.provider.wallet.publicKey.toString()) {
            sig = await this.provider.sendAndConfirm(tx)
        } else {
            sig = await this.provider.sendAndConfirm(tx, [owner])
        }
        return sig
    }

    async applyListingSync (syncData: ListingSyncData, catalog: string, owner: Keypair, feePayer: Keypair): Promise<ListingSyncResult> {
        //console.log(syncData)
        const baseUrl: string = this.baseUrl + '/api/catalog/listing/'
        var listingsAdded: string[] = []
        var listingsRemoved: string[] = []
        for (var i = 0; i < syncData.listing_add.length; i++) {
            const listing: ListingAddData = syncData.listing_add[i]
            //console.log('Add')
            //console.log(listing)
            var locality: string[] = []
            if (listing.filter_by_1) {
                locality.push(listing.filter_by_1)
                if (listing.filter_by_2) {
                    locality.push(listing.filter_by_2)
                    if (listing.filter_by_3) {
                        locality.push(listing.filter_by_3)
                    }
                }
            }
            const lspec = this.getListingSpec({
                catalog: catalog,
                base: baseUrl,
                category: listing.category,
                label: listing.label,
                detail: JSON.stringify(listing.detail),
                attributes: listing.attributes,
                locality: locality,
                owner: owner.publicKey,
            })
            const linst = await this.getListingInstructions(lspec, owner, feePayer, catalog)
            const sigs: string[] = await this.sendListingInstructions(linst, owner, feePayer)
            sigs.forEach(sig => listingsAdded.push(sig))
        }
        if (syncData.listing_remove.length > 0) {
            const root = await this.getCatalogRootData()
            for (var j = 0; j < syncData.listing_remove.length; j++) {
                const account: string = syncData.listing_remove[j]
                const sig: string = await this.removeListing(root, account, owner, feePayer)
                listingsRemoved.push(sig)
            }
        }
        return { listingsAdded, listingsRemoved }
    }

    async sendListingInstructions (li: ListingInstructions, owner: Keypair, feePayer: Keypair): Promise<string[]> {
        var res: string[] = []
        var signers: any[] = []
        if (feePayer.publicKey.toString() !== this.provider.wallet.publicKey.toString()) {
            signers.push(feePayer)
        }
        for (var i = 0; i < li.urlEntries.length; i++) {
            const entryInst: URLEntryInstruction = li.urlEntries[i]
            var tx = new Transaction()
            if (entryInst.instruction) {
                tx.add(entryInst.instruction)
                if (signers.length > 0) {
                    res.push(await this.provider.sendAndConfirm(tx, signers))
                } else {
                    res.push(await this.provider.sendAndConfirm(tx))
                }
            }
        }
        if (owner.publicKey.toString() !== this.provider.wallet.publicKey.toString()) {
            signers.push(owner)
        }
        li.transaction.recentBlockhash = (
            await this.provider.connection.getLatestBlockhash()
        ).blockhash
        if (signers.length > 0) {
            res.push(await this.provider.sendAndConfirm(li.transaction, signers, {'maxRetries': 10, 'skipPreflight': true}))
        } else {
            res.push(await this.provider.sendAndConfirm(li.transaction, [], {'maxRetries': 10, 'skipPreflight': true}))
        }
        return res
    }

    async syncListings (owner: Keypair, feePayer: Keypair, catalog: string = 'commerce'): Promise<ListingSyncResult> {
        const url = this.baseUrl + '/api/catalog/listing'
        const postData: any = {
            'command': 'sync_listings',
            'catalog': catalog,
        }
        const syncData: ListingSyncData = await postJson(url, postData, this.accessToken) as ListingSyncData
        return await this.applyListingSync(syncData, catalog, owner, feePayer)
    }

    async getToken (): Promise<string> {
        const url = this.authUrl + '/api/auth_gateway/v1/get_token'
        const headers = new Headers()
        headers.append('Authorization', 'Basic ' + base64.encode('api:' + this.apiKey))
        const options = {
            method: 'GET',
            headers: headers,
        }
        const accessToken: AccessTokenData = await new Promise((resolve, reject) => {
            fetch(url, options)
                .then(response => { return response.json() })
                .then(json => { resolve(json) })
                .catch(error => { reject(error) })
        }) as AccessTokenData
        return accessToken.access_token
    }

    async getURI (uriData: Array<number>): Promise<string> {
        const url = this.baseUrl + '/api/catalog/uri/' + bs58.encode(uriData)
        const options = { method: 'GET' }
        const uriResult: string = await new Promise((resolve, reject) => {
            fetch(url)
                .then(response => { resolve(response.text()) })
                .catch(error => { reject(error) })
        }) as string
        return uriResult
    }
}
