"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListingClient = exports.jsonldToGraph = exports.graphToJsonld = exports.postJson = exports.listingAttributes = exports.ATELLIX_CATALOG_ID = exports.ATELLIX_CATALOG = void 0;
const web3_js_1 = require("@solana/web3.js");
const uuid_1 = require("uuid");
const anchor_1 = require("@coral-xyz/anchor");
const jsonld_streaming_parser_1 = require("jsonld-streaming-parser");
const spl_token_1 = require("@solana/spl-token");
const readable_stream_1 = require("readable-stream");
const buffer_layout_1 = __importDefault(require("buffer-layout"));
const base64_js_1 = __importDefault(require("base64-js"));
const buffer_1 = require("buffer");
const cross_fetch_1 = __importDefault(require("cross-fetch"));
const base_64_1 = __importDefault(require("base-64"));
const bitset_1 = __importDefault(require("bitset"));
const jssha_1 = __importDefault(require("jssha"));
const bs58_1 = __importDefault(require("bs58"));
const n3_1 = __importDefault(require("n3"));
const serializer_js_1 = require("./serializer.js");
const catalog_json_1 = __importDefault(require("./catalog.json"));
exports.ATELLIX_CATALOG = {
    'metadata': 0,
    'public': 1,
    'commerce': 2,
    'event': 3,
    'realestate': 4,
    'investment': 5,
    'employment': 6,
};
exports.ATELLIX_CATALOG_ID = {
    '0': 'metadata',
    '1': 'public',
    '2': 'commerce',
    '3': 'event',
    '4': 'realestate',
    '5': 'investment',
    '6': 'employment',
};
exports.listingAttributes = [
    'InPerson',
    'LocalDelivery',
    'OnlineDownload',
    'RequestForProposal',
];
function getLonLatString(latlon) {
    latlon = latlon * (10 ** 7);
    return latlon.toFixed(0);
}
function getHashBN(val) {
    const shaObj = new jssha_1.default('SHAKE128', 'TEXT', { encoding: 'UTF8' });
    const hashData = shaObj.update(val).getHash('UINT8ARRAY', { outputLen: 128 });
    return new anchor_1.BN(hashData);
}
async function decodeURL(catalogProgram, listingData, urlEntry) {
    const urlData = await catalogProgram.account.catalogUrl.fetch(urlEntry);
    if (urlData.urlExpandMode === 0) { // None
        return urlData.url;
    }
    else if (urlData.urlExpandMode === 1) { // AppendUUID
        const url = urlData.url;
        const uuid = (0, uuid_1.stringify)(listingData.uuid.toBuffer().toJSON().data);
        return url + uuid;
    }
    else if (urlData.urlExpandMode === 2) { // UTF8UriEncoded
        const url = urlData.url;
        const decoded = decodeURIComponent(url);
        return decoded;
    }
}
function readAttributes(attrValue) {
    var hval = attrValue.toString(16);
    var bset = new bitset_1.default('0x' + hval);
    var attrs = {};
    for (var i = 0; i < exports.listingAttributes.length; i++) {
        if (bset.get(i)) {
            attrs[exports.listingAttributes[i]] = true;
        }
    }
    return attrs;
}
function postJson(url, jsonData, token = undefined) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    if (token) {
        headers.append('Authorization', 'Bearer ' + token);
    }
    const options = {
        method: 'POST',
        headers: headers,
        body: JSON.stringify(jsonData),
    };
    return new Promise((resolve, reject) => {
        (0, cross_fetch_1.default)(url, options)
            .then(response => { return response.json(); })
            .then(json => { resolve(json); })
            .catch(error => { reject(error); });
    });
}
exports.postJson = postJson;
function graphToJsonld(store, baseIRI) {
    const writer = new serializer_js_1.SerializerJsonld({
        baseIRI: baseIRI,
        context: {
            '@vocab': 'http://schema.org/',
        },
        compact: true,
        encoding: 'object',
    });
    const input = new readable_stream_1.Readable({
        objectMode: true,
        read: () => {
            store.forEach((q) => { input.push(q); });
            input.push(null);
        }
    });
    return new Promise((resolve, reject) => {
        const output = writer.import(input);
        output.on('data', jsonld => {
            resolve(jsonld);
        });
    });
}
exports.graphToJsonld = graphToJsonld;
function jsonldToGraph(jsonText) {
    return new Promise((resolve, reject) => {
        const store = new n3_1.default.Store();
        const parser = new jsonld_streaming_parser_1.JsonLdParser();
        parser
            .on('data', (q) => store.addQuad(q))
            .on('error', console.error)
            .on('end', () => resolve(store));
        parser.write(jsonText);
        parser.end();
    });
}
exports.jsonldToGraph = jsonldToGraph;
class ListingClient {
    constructor(provider, catalogProgram, baseUrl, authUrl, apiKey) {
        if (this.provider) {
            this.provider = provider;
        }
        else {
            if (!process.env.ANCHOR_WALLET) {
                process.env.ANCHOR_WALLET = 'id.json';
            }
            if (!process.env.ANCHOR_PROVIDER_URL) {
                process.env.ANCHOR_PROVIDER_URL = 'https://api.mainnet-beta.solana.com';
            }
            this.provider = anchor_1.AnchorProvider.env();
        }
        if (catalogProgram) {
            this.catalogProgram = catalogProgram;
        }
        else {
            const pk = catalog_json_1.default.metadata.address;
            this.catalogProgram = new anchor_1.Program(catalog_json_1.default, new web3_js_1.PublicKey(pk));
        }
        this.baseUrl = baseUrl !== null && baseUrl !== void 0 ? baseUrl : 'https://catalog.atellix.com';
        this.authUrl = authUrl !== null && authUrl !== void 0 ? authUrl : 'https://app.atellix.com';
        this.apiKey = apiKey !== null && apiKey !== void 0 ? apiKey : '';
        this.accessToken = '';
    }
    // UUID Offset = 8
    // Catalog ID Offset = 24
    // Category Offset = 32
    // Filter By Offset = 48
    async getListings(query) {
        var _a, _b;
        if (!(query.catalog in exports.ATELLIX_CATALOG)) {
            throw new Error('Invalid catalog: ' + query.catalog);
        }
        var listings = [];
        var source = (_a = query.source) !== null && _a !== void 0 ? _a : 'catalog';
        var count;
        if (source === 'catalog') {
            const url = this.baseUrl + '/api/catalog/query';
            const params = {
                'command': 'get_listings',
                'catalog': exports.ATELLIX_CATALOG[query.catalog],
            };
            if (query.category) {
                params['category'] = query.category;
            }
            if (query.skip) {
                params['skip'] = query.skip;
            }
            if (query.take) {
                params['take'] = query.take;
            }
            const result = await postJson(url, params);
            if (result.result !== 'ok') {
                throw new Error((_b = result.error) !== null && _b !== void 0 ? _b : 'Request error');
            }
            count = result.count;
            listings = result.listings;
        }
        else if (source === 'solana') {
            const listingPrefix = [0x27, 0xea, 0xf9, 0x5e, 0x28, 0x32, 0xf4, 0x49];
            const catbuf = buffer_1.Buffer.alloc(8);
            catbuf.writeBigUInt64LE(BigInt(exports.ATELLIX_CATALOG[Number(query.catalog).toString()]));
            var prefix = catbuf.toJSON().data;
            var filters = [
                { memcmp: { bytes: bs58_1.default.encode(listingPrefix), offset: 0 } },
                { memcmp: { bytes: bs58_1.default.encode(prefix), offset: 24 } },
            ];
            if (query.category) {
                const category = getHashBN(query.category);
                var catdata = category.toBuffer().toJSON().data;
                catdata.reverse(); // Borsh uses little-endian integers
                prefix = prefix.concat(catdata);
                filters[1] = { memcmp: { bytes: bs58_1.default.encode(prefix), offset: 24 } };
            }
            const accountList = await this.provider.connection.getProgramAccounts(this.catalogProgram.programId, { filters: filters });
            for (var i = 0; i < accountList.length; i++) {
                const act = accountList[i];
                const listingData = await this.catalogProgram.account.catalogEntry.fetch(new web3_js_1.PublicKey(act.pubkey));
                var locality = [];
                for (var j = 0; j < listingData.filterBy.length; j++) {
                    var localFilter = listingData.filterBy[j];
                    if (localFilter.toString() !== '0') {
                        locality.push(await this.getURI(localFilter.toBuffer()));
                    }
                }
                var listing = {
                    'catalog': exports.ATELLIX_CATALOG_ID[Number(query.catalog).toString()],
                    'listing_account': act.pubkey.toString(),
                    'listing_index': parseInt(listingData.listingIdx.toString()),
                    'category': await this.getURI(listingData.category.toBuffer()),
                    'locality': locality,
                    'url': await decodeURL(this.catalogProgram, listingData, listingData.listingUrl),
                    'uuid': (0, uuid_1.stringify)(listingData.uuid.toBuffer().toJSON().data),
                    'label': await decodeURL(this.catalogProgram, listingData, listingData.labelUrl),
                    'detail': JSON.parse(await decodeURL(this.catalogProgram, listingData, listingData.detailUrl)),
                    'owner': listingData.owner.toString(),
                    'attributes': readAttributes(listingData.attributes),
                    'update_count': parseInt(listingData.updateCount.toString()),
                    'update_ts': new Date(1000 * parseInt(listingData.updateTs.toString())),
                };
                var lat = null;
                var lon = null;
                if (Math.abs(listingData.latitude) < 2000000000 && Math.abs(listingData.longitude) < 2000000000) {
                    listing['latitude'] = listingData.latitude / (10 ** 7);
                    listing['longitude'] = listingData.longitude / (10 ** 7);
                }
                listings.push(listing);
            }
            count = listings.length;
        }
        return {
            count: count,
            listings: listings,
        };
    }
    async getListingEntries(query) {
        var _a;
        var params = { 'command': 'get_listing_entries' };
        if (query.skip) {
            params['skip'] = query.skip;
        }
        if (query.take) {
            params['take'] = query.take;
        }
        if (query.sort) {
            params['sort'] = query.sort;
        }
        if (query.reverse) {
            params['reverse'] = query.reverse;
        }
        const result = await postJson(query.url, params);
        if (result.result !== 'ok') {
            throw new Error((_a = result.error) !== null && _a !== void 0 ? _a : 'Request error');
        }
        return result;
    }
    async getCategoryList(req) {
        var _a;
        const url = this.baseUrl + '/api/catalog/category';
        var params = {
            'command': 'get_category_list',
            'tree': null,
            'base': null,
            'depth': 1,
        };
        for (var k of ['tree', 'base', 'depth']) {
            if (k in req) {
                params[k] = req[k];
            }
        }
        const result = await postJson(url, params);
        if (result.result !== 'ok') {
            throw new Error((_a = result.error) !== null && _a !== void 0 ? _a : 'Request error');
        }
        return result;
    }
    async search(req) {
        var _a, _b;
        const url = this.baseUrl + '/api/catalog/search';
        var params = {
            'command': 'search',
            'catalog': (_a = req.catalog) !== null && _a !== void 0 ? _a : 'commerce',
        };
        for (var k of ['query', 'take', 'skip', 'catalog', 'category']) {
            if (k in req) {
                params[k] = req[k];
            }
        }
        const result = await postJson(url, params);
        if (result.result !== 'ok') {
            throw new Error((_b = result.error) !== null && _b !== void 0 ? _b : 'Request error');
        }
        return result;
    }
    async getURLEntry(url, expandMode = 0) {
        const bufExpand = buffer_1.Buffer.alloc(1);
        bufExpand.writeUInt8(expandMode);
        const shaObj = new jssha_1.default('SHAKE128', 'TEXT', { encoding: 'UTF8' });
        const hashData = shaObj.update(url).getHash('UINT8ARRAY', { outputLen: 128 });
        const bufHash = buffer_1.Buffer.from(hashData);
        const addr = await web3_js_1.PublicKey.findProgramAddress([bufExpand, bufHash], this.catalogProgram.programId);
        return addr[0];
    }
    async getURLEntryInstruction(entry, feePayer) {
        const urlEntry = await this.getURLEntry(entry.text, entry.expand);
        let account = await this.provider.connection.getAccountInfo(urlEntry);
        if (account) {
            return {
                entry: entry,
                exists: true,
                publicKey: urlEntry,
            };
        }
        return {
            entry: entry,
            exists: false,
            publicKey: urlEntry,
            instruction: this.catalogProgram.instruction.createUrl(entry.expand, // URL Mode
            getHashBN(entry.text), entry.text.length, entry.text, {
                'accounts': {
                    admin: feePayer.publicKey,
                    urlEntry: urlEntry,
                    systemProgram: web3_js_1.SystemProgram.programId,
                },
                'signers': [feePayer],
            })
        };
    }
    writeAttributes(attrs) {
        var bset = new bitset_1.default();
        for (var i = 0; i < exports.listingAttributes.length; i++) {
            if (attrs[exports.listingAttributes[i]]) {
                bset.set(i, 1);
            }
            else {
                bset.set(i, 0);
            }
        }
        var value = parseInt(bset.toString(16), 16);
        return value;
    }
    getListingSpec(listingData) {
        var latitude = '2000000000';
        var longitude = '2000000000';
        if (listingData.latitude !== undefined) {
            latitude = getLonLatString(listingData.latitude);
        }
        if (listingData.longitude !== undefined) {
            longitude = getLonLatString(listingData.longitude);
        }
        var attributes = {};
        if (typeof listingData['attributes'] !== 'undefined') {
            for (var i = 0; i < listingData['attributes'].length; i++) {
                var attr = listingData['attributes'][i];
                attributes[attr] = true;
            }
        }
        var buf1 = buffer_1.Buffer.alloc(4);
        var buf2 = buffer_1.Buffer.alloc(4);
        buffer_layout_1.default.s32().encode(latitude, buf1);
        buffer_layout_1.default.s32().encode(longitude, buf2);
        const category = getHashBN(listingData.category);
        var locality1 = new anchor_1.BN(0);
        var locality2 = new anchor_1.BN(0);
        var locality3 = new anchor_1.BN(0);
        if (listingData.locality.length > 0) {
            locality1 = getHashBN(listingData.locality[0]);
        }
        if (listingData.locality.length > 1) {
            locality2 = getHashBN(listingData.locality[1]);
        }
        if (listingData.locality.length > 2) {
            locality3 = getHashBN(listingData.locality[2]);
        }
        const spec = {
            catalog: listingData.catalog,
            category: category.toString(),
            filter_by_1: locality1.toString(),
            filter_by_2: locality2.toString(),
            filter_by_3: locality3.toString(),
            attributes: this.writeAttributes(attributes),
            latitude: base64_js_1.default.fromByteArray(buf1),
            longitude: base64_js_1.default.fromByteArray(buf2),
            owner: listingData.owner,
            listing_url: { text: listingData.base, expand: 1 },
            label_url: { text: encodeURIComponent(listingData.label), expand: 2 },
            detail_url: { text: encodeURIComponent(listingData.detail), expand: 2 },
        };
        return spec;
    }
    async getListingInstructions(listingSpec, owner, feePayer, catalog) {
        var _a;
        var listingPost = { ...listingSpec };
        listingPost.command = 'sign_listing';
        listingPost.catalog = catalog;
        listingPost.owner = base64_js_1.default.fromByteArray(listingSpec.owner.toBuffer());
        const url = this.baseUrl + '/api/catalog/listing';
        const signedResult = await postJson(url, listingPost, this.accessToken);
        if (signedResult.result !== 'ok') {
            throw new Error((_a = signedResult.error) !== null && _a !== void 0 ? _a : 'Request error');
        }
        //console.log(signedResult)
        const listingId = signedResult.uuid;
        const listingBuf = buffer_1.Buffer.from((0, uuid_1.parse)(listingId));
        const catalogId = BigInt(signedResult.catalog);
        const catalogBuf = buffer_1.Buffer.alloc(8);
        catalogBuf.writeBigUInt64BE(catalogId);
        const catalogAddr = await web3_js_1.PublicKey.findProgramAddress([buffer_1.Buffer.from('catalog', 'utf8'), catalogBuf], this.catalogProgram.programId);
        const catalogPK = catalogAddr[0];
        const listingAddr = await web3_js_1.PublicKey.findProgramAddress([catalogBuf, listingBuf], this.catalogProgram.programId);
        const listingPK = listingAddr[0];
        const signerPK = new web3_js_1.PublicKey(signedResult.pubkey);
        const feeMintPK = new web3_js_1.PublicKey(signedResult.fee_mint);
        const feeAccountAddr = await web3_js_1.PublicKey.findProgramAddress([feePayer.publicKey.toBuffer(), spl_token_1.TOKEN_PROGRAM_ID.toBuffer(), feeMintPK.toBuffer()], spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
        const feeSourcePK = feeAccountAddr[0];
        var tx = new web3_js_1.Transaction();
        tx.add(web3_js_1.Ed25519Program.createInstructionWithPublicKey({
            message: base64_js_1.default.toByteArray(signedResult.message),
            publicKey: signerPK.toBytes(),
            signature: bs58_1.default.decode(signedResult.sig),
        }));
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
        tx.add(this.catalogProgram.instruction.createListing(new anchor_1.BN((0, uuid_1.parse)(listingId)), {
            'accounts': {
                owner: listingSpec.owner,
                catalog: catalogPK,
                listing: listingPK,
                feePayer: feePayer.publicKey,
                feeSource: feeSourcePK,
                feeAccount: new web3_js_1.PublicKey(signedResult.fee_account),
                ixSysvar: web3_js_1.SYSVAR_INSTRUCTIONS_PUBKEY,
                systemProgram: web3_js_1.SystemProgram.programId,
                tokenProgram: spl_token_1.TOKEN_PROGRAM_ID,
            },
            'signers': [owner, feePayer],
        }));
        var entries = [];
        var listing_url = await this.getURLEntryInstruction(listingSpec.listing_url, feePayer);
        if (!listing_url.exists) {
            entries.push(listing_url);
        }
        var label_url = await this.getURLEntryInstruction(listingSpec.label_url, feePayer);
        if (!label_url.exists) {
            entries.push(label_url);
        }
        var detail_url = await this.getURLEntryInstruction(listingSpec.detail_url, feePayer);
        if (!detail_url.exists) {
            entries.push(detail_url);
        }
        const li = {
            uuid: signedResult.uuid,
            catalog: parseInt(signedResult.catalog),
            urlEntries: entries,
            transaction: tx,
        };
        return li;
    }
    async getCatalogRootData() {
        const rootData = await web3_js_1.PublicKey.findProgramAddress([this.catalogProgram.programId.toBuffer()], this.catalogProgram.programId);
        const rootDataPK = rootData[0];
        const rootAccount = await this.catalogProgram.account.rootData.fetch(rootDataPK);
        return {
            rootData: rootDataPK,
            authData: rootAccount.rootAuthority,
        };
    }
    async removeListing(programRoot, listing, owner, feeRecipient) {
        const listingPK = new web3_js_1.PublicKey(listing);
        const listingData = await this.catalogProgram.account.catalogEntry.fetch(listingPK);
        var catBuf = buffer_1.Buffer.alloc(8);
        catBuf.writeBigUInt64BE(BigInt(listingData.catalog.toString()));
        const catalog = await web3_js_1.PublicKey.findProgramAddress([buffer_1.Buffer.from('catalog', 'utf8'), catBuf], this.catalogProgram.programId);
        const catalogPK = catalog[0];
        var tx = new web3_js_1.Transaction();
        tx.add(this.catalogProgram.instruction.removeListing({
            'accounts': {
                rootData: programRoot.rootData,
                authData: programRoot.authData,
                authUser: owner.publicKey,
                catalog: catalogPK,
                listing: listingPK,
                feeRecipient: feeRecipient.publicKey,
                systemProgram: web3_js_1.SystemProgram.programId,
            },
        }));
        let sig;
        if (owner.publicKey.toString() === this.provider.wallet.publicKey.toString()) {
            sig = await this.provider.sendAndConfirm(tx);
        }
        else {
            sig = await this.provider.sendAndConfirm(tx, [owner]);
        }
        return sig;
    }
    async applyListingSync(syncData, catalog, owner, feePayer) {
        //console.log(syncData)
        const baseUrl = this.baseUrl + '/api/catalog/listing/';
        var listingsAdded = [];
        var listingsRemoved = [];
        for (var i = 0; i < syncData.listing_add.length; i++) {
            const listing = syncData.listing_add[i];
            //console.log('Add')
            //console.log(listing)
            var locality = [];
            if (listing.filter_by_1) {
                locality.push(listing.filter_by_1);
                if (listing.filter_by_2) {
                    locality.push(listing.filter_by_2);
                    if (listing.filter_by_3) {
                        locality.push(listing.filter_by_3);
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
            });
            const linst = await this.getListingInstructions(lspec, owner, feePayer, catalog);
            const sigs = await this.sendListingInstructions(linst, owner, feePayer);
            sigs.forEach(sig => listingsAdded.push(sig));
        }
        if (syncData.listing_remove.length > 0) {
            const root = await this.getCatalogRootData();
            for (var j = 0; j < syncData.listing_remove.length; j++) {
                const account = syncData.listing_remove[j];
                const sig = await this.removeListing(root, account, owner, feePayer);
                listingsRemoved.push(sig);
            }
        }
        return { listingsAdded, listingsRemoved };
    }
    async sendListingInstructions(li, owner, feePayer) {
        var res = [];
        var signers = [];
        if (feePayer.publicKey.toString() !== this.provider.wallet.publicKey.toString()) {
            signers.push(feePayer);
        }
        for (var i = 0; i < li.urlEntries.length; i++) {
            const entryInst = li.urlEntries[i];
            var tx = new web3_js_1.Transaction();
            if (entryInst.instruction) {
                tx.add(entryInst.instruction);
                if (signers.length > 0) {
                    res.push(await this.provider.sendAndConfirm(tx, signers));
                }
                else {
                    res.push(await this.provider.sendAndConfirm(tx));
                }
            }
        }
        if (owner.publicKey.toString() !== this.provider.wallet.publicKey.toString()) {
            signers.push(owner);
        }
        li.transaction.recentBlockhash = (await this.provider.connection.getLatestBlockhash()).blockhash;
        if (signers.length > 0) {
            res.push(await this.provider.sendAndConfirm(li.transaction, signers, { 'maxRetries': 10, 'skipPreflight': true }));
        }
        else {
            res.push(await this.provider.sendAndConfirm(li.transaction, [], { 'maxRetries': 10, 'skipPreflight': true }));
        }
        return res;
    }
    async syncListings(owner, feePayer, catalog = 'commerce') {
        const url = this.baseUrl + '/api/catalog/listing';
        const postData = {
            'command': 'sync_listings',
            'catalog': catalog,
        };
        const syncData = await postJson(url, postData, this.accessToken);
        return await this.applyListingSync(syncData, catalog, owner, feePayer);
    }
    async getToken() {
        const url = this.authUrl + '/api/auth_gateway/v1/get_token';
        const headers = new Headers();
        headers.append('Authorization', 'Basic ' + base_64_1.default.encode('api:' + this.apiKey));
        const options = {
            method: 'GET',
            headers: headers,
        };
        const accessToken = await new Promise((resolve, reject) => {
            (0, cross_fetch_1.default)(url, options)
                .then(response => { return response.json(); })
                .then(json => { resolve(json); })
                .catch(error => { reject(error); });
        });
        return accessToken.access_token;
    }
    async getURI(uriData) {
        const url = this.baseUrl + '/api/catalog/uri/' + bs58_1.default.encode(uriData);
        const options = { method: 'GET' };
        const uriResult = await new Promise((resolve, reject) => {
            (0, cross_fetch_1.default)(url)
                .then(response => { resolve(response.text()); })
                .catch(error => { reject(error); });
        });
        return uriResult;
    }
}
exports.ListingClient = ListingClient;
//# sourceMappingURL=index.js.map