import { PublicKey, Transaction, Ed25519Program, SYSVAR_INSTRUCTIONS_PUBKEY, SystemProgram } from '@solana/web3.js';
import { parse as uuidparse, stringify as uuidstr } from 'uuid';
import { BN } from '@coral-xyz/anchor';
import { JsonLdParser } from 'jsonld-streaming-parser';
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Readable } from 'readable-stream';
import bufLayout from 'buffer-layout';
import base64js from 'base64-js';
import { Buffer } from 'buffer';
import fetch from 'cross-fetch';
import base64 from 'base-64';
import BitSet from 'bitset';
import jsSHA from 'jssha';
import bs58 from 'bs58';
import N3 from 'n3';
import { SerializerJsonld } from './serializer.js';
export const listingAttributes = [
    'InPerson',
    'LocalDelivery',
    'OnlineDownload',
];
function getLonLatString(latlon) {
    latlon = latlon * (10 ** 7);
    return latlon.toFixed(0);
}
function getHashBN(val) {
    const shaObj = new jsSHA('SHAKE128', 'TEXT', { encoding: 'UTF8' });
    const hashData = shaObj.update(val).getHash('UINT8ARRAY', { outputLen: 128 });
    return new BN(hashData);
}
async function decodeURL(catalogProgram, listingData, urlEntry) {
    const urlData = await catalogProgram.account.catalogUrl.fetch(urlEntry);
    if (urlData.urlExpandMode === 0) { // None
        return urlData.url;
    }
    else if (urlData.urlExpandMode === 1) { // AppendUUID
        const url = urlData.url;
        const uuid = uuidstr(listingData.uuid.toBuffer().toJSON().data);
        return url + uuid;
    }
    else if (urlData.urlExpandMode === 2) { // UTF8UriEncoded
        const url = urlData.url;
        const decoded = decodeURIComponent(url);
        return decoded;
    }
}
export function postJson(url, jsonData, token = undefined) {
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
        fetch(url, options)
            .then(response => { return response.json(); })
            .then(json => { resolve(json); })
            .catch(error => { reject(error); });
    });
}
export function graphToJsonld(store, baseIRI) {
    const writer = new SerializerJsonld({
        baseIRI: baseIRI,
        context: {
            '@vocab': 'http://schema.org/',
        },
        compact: true,
        encoding: 'object',
    });
    const input = new Readable({
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
export function jsonldToGraph(jsonText) {
    return new Promise((resolve, reject) => {
        const store = new N3.Store();
        const parser = new JsonLdParser();
        parser
            .on('data', (q) => store.addQuad(q))
            .on('error', console.error)
            .on('end', () => resolve(store));
        parser.write(jsonText);
        parser.end();
    });
}
export class ListingClient {
    constructor(provider, catalogProgram, baseUrl, authUrl, apiKey) {
        this.provider = provider;
        this.catalogProgram = catalogProgram;
        this.baseUrl = baseUrl !== null && baseUrl !== void 0 ? baseUrl : 'https://catalog.atellix.com';
        this.authUrl = authUrl !== null && authUrl !== void 0 ? authUrl : 'https://app.atellix.com';
        this.apiKey = apiKey !== null && apiKey !== void 0 ? apiKey : '';
        this.accessToken = '';
    }
    // UUID Offset = 8
    // Catalog ID Offset = 24
    // Category Offset = 32
    // Filter By Offset = 48
    getListings(catalog, categoryUri) {
        const category = getHashBN(categoryUri);
        const offset = 24;
        const catbuf = Buffer.alloc(8);
        catbuf.writeBigUInt64LE(BigInt(catalog));
        var prefix = [];
        prefix = prefix.concat(catbuf.toJSON().data);
        // Category filter
        const catdata = category.toBuffer().toJSON().data;
        catdata.reverse(); // Borsh uses little-endian integers
        prefix = prefix.concat(catdata);
        console.log("Offset: " + offset + " Prefix: " + bs58.encode(prefix));
        return 'OK';
    }
    async getURLEntry(url, expandMode = 0) {
        const bufExpand = Buffer.alloc(1);
        bufExpand.writeUInt8(expandMode);
        const shaObj = new jsSHA('SHAKE128', 'TEXT', { encoding: 'UTF8' });
        const hashData = shaObj.update(url).getHash('UINT8ARRAY', { outputLen: 128 });
        const bufHash = Buffer.from(hashData);
        const addr = await PublicKey.findProgramAddress([bufExpand, bufHash], this.catalogProgram.programId);
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
                    systemProgram: SystemProgram.programId,
                },
                'signers': [feePayer],
            })
        };
    }
    writeAttributes(attrs) {
        var bset = new BitSet();
        for (var i = 0; i < listingAttributes.length; i++) {
            if (attrs[listingAttributes[i]]) {
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
        var buf1 = Buffer.alloc(4);
        var buf2 = Buffer.alloc(4);
        bufLayout.s32().encode(latitude, buf1);
        bufLayout.s32().encode(longitude, buf2);
        const category = getHashBN(listingData.category);
        var locality1 = new BN(0);
        var locality2 = new BN(0);
        var locality3 = new BN(0);
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
            latitude: base64js.fromByteArray(buf1),
            longitude: base64js.fromByteArray(buf2),
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
        listingPost.owner = base64js.fromByteArray(listingSpec.owner.toBuffer());
        const url = this.baseUrl + '/api/catalog/listing';
        const signedResult = await postJson(url, listingPost, this.accessToken);
        if (signedResult.result !== 'ok') {
            throw new Error((_a = signedResult.error) !== null && _a !== void 0 ? _a : 'Request error');
        }
        //console.log(signedResult)
        const listingId = signedResult.uuid;
        const listingBuf = Buffer.from(uuidparse(listingId));
        const catalogId = BigInt(signedResult.catalog);
        const catalogBuf = Buffer.alloc(8);
        catalogBuf.writeBigUInt64BE(catalogId);
        const catalogAddr = await PublicKey.findProgramAddress([Buffer.from('catalog', 'utf8'), catalogBuf], this.catalogProgram.programId);
        const catalogPK = catalogAddr[0];
        const listingAddr = await PublicKey.findProgramAddress([catalogBuf, listingBuf], this.catalogProgram.programId);
        const listingPK = listingAddr[0];
        const signerPK = new PublicKey(signedResult.pubkey);
        const feeMintPK = new PublicKey(signedResult.fee_mint);
        const feeAccountAddr = await PublicKey.findProgramAddress([feePayer.publicKey.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), feeMintPK.toBuffer()], ASSOCIATED_TOKEN_PROGRAM_ID);
        const feeSourcePK = feeAccountAddr[0];
        var tx = new Transaction();
        tx.add(Ed25519Program.createInstructionWithPublicKey({
            message: base64js.toByteArray(signedResult.message),
            publicKey: signerPK.toBytes(),
            signature: bs58.decode(signedResult.sig),
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
        tx.add(this.catalogProgram.instruction.createListing(new BN(uuidparse(listingId)), {
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
        const rootData = await PublicKey.findProgramAddress([this.catalogProgram.programId.toBuffer()], this.catalogProgram.programId);
        const rootDataPK = rootData[0];
        const rootAccount = await this.catalogProgram.account.rootData.fetch(rootDataPK);
        return {
            rootData: rootDataPK,
            authData: rootAccount.rootAuthority,
        };
    }
    async removeListing(programRoot, listing, owner, feeRecipient) {
        const listingPK = new PublicKey(listing);
        const listingData = await this.catalogProgram.account.catalogEntry.fetch(listingPK);
        var catBuf = Buffer.alloc(8);
        catBuf.writeBigUInt64BE(BigInt(listingData.catalog.toString()));
        const catalog = await PublicKey.findProgramAddress([Buffer.from('catalog', 'utf8'), catBuf], this.catalogProgram.programId);
        const catalogPK = catalog[0];
        var tx = new Transaction();
        tx.add(this.catalogProgram.instruction.removeListing({
            'accounts': {
                rootData: programRoot.rootData,
                authData: programRoot.authData,
                authUser: owner.publicKey,
                catalog: catalogPK,
                listing: listingPK,
                feeRecipient: feeRecipient.publicKey,
                systemProgram: SystemProgram.programId,
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
        if (owner.publicKey.toString() !== this.provider.wallet.publicKey.toString()) {
            signers.push(owner);
        }
        if (feePayer.publicKey.toString() !== this.provider.wallet.publicKey.toString()) {
            signers.push(feePayer);
        }
        for (var i = 0; i < li.urlEntries.length; i++) {
            const entryInst = li.urlEntries[i];
            var tx = new Transaction();
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
        if (signers.length > 0) {
            res.push(await this.provider.sendAndConfirm(li.transaction, signers));
        }
        else {
            res.push(await this.provider.sendAndConfirm(li.transaction));
        }
        return res;
    }
    async storeRecord(user, record, data) {
        const url = this.baseUrl + '/api/catalog/listing';
        const postData = {
            'command': 'set_record',
            'user': user,
            'record': record,
            'data': data,
        };
        return await postJson(url, postData);
    }
    async storeListing(user, record, catalog, listing) {
        const url = this.baseUrl + '/api/catalog/listing';
        const postData = {
            'command': 'set_listing',
            'user': user,
            'catalog': catalog,
            'listing': listing,
            'record': record,
        };
        return await postJson(url, postData);
    }
    async storeRecordAndListing(user, record, data, catalog, listing) {
        const url = this.baseUrl + '/api/catalog/listing';
        const postData = {
            'command': 'set_listing',
            'user': user,
            'catalog': catalog,
            'listing': listing,
            'record': record,
            'data': data,
        };
        return await postJson(url, postData);
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
        headers.append('Authorization', 'Basic ' + base64.encode('api:' + this.apiKey));
        const options = {
            method: 'GET',
            headers: headers,
        };
        const accessToken = await new Promise((resolve, reject) => {
            fetch(url, options)
                .then(response => { return response.json(); })
                .then(json => { resolve(json); })
                .catch(error => { reject(error); });
        });
        return accessToken.access_token;
    }
}
//# sourceMappingURL=index.js.map