"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.importSecretKey = exports.exportSecretKey = exports.programAddress = exports.associatedTokenAddress = void 0;
const web3_js_1 = require("@solana/web3.js");
const spl_token_1 = require("@solana/spl-token");
const base32_js_1 = __importDefault(require("base32.js"));
async function associatedTokenAddress(walletAddress, tokenMintAddress) {
    const addr = await web3_js_1.PublicKey.findProgramAddress([walletAddress.toBuffer(), spl_token_1.TOKEN_PROGRAM_ID.toBuffer(), tokenMintAddress.toBuffer()], spl_token_1.ASSOCIATED_TOKEN_PROGRAM_ID);
    const res = { 'pubkey': await addr[0].toString(), 'nonce': addr[1] };
    return res;
}
exports.associatedTokenAddress = associatedTokenAddress;
async function programAddress(inputs, program) {
    const addr = await web3_js_1.PublicKey.findProgramAddress(inputs, program);
    const res = { 'pubkey': await addr[0].toString(), 'nonce': addr[1] };
    return res;
}
exports.programAddress = programAddress;
function exportSecretKey(keyPair) {
    var enc = new base32_js_1.default.Encoder({ type: "crockford", lc: true });
    return enc.write(keyPair.secretKey).finalize();
}
exports.exportSecretKey = exportSecretKey;
function importSecretKey(keyStr) {
    var dec = new base32_js_1.default.Decoder({ type: "crockford" });
    var spec = dec.write(keyStr).finalize();
    return web3_js_1.Keypair.fromSecretKey(new Uint8Array(spec));
}
exports.importSecretKey = importSecretKey;
//# sourceMappingURL=common.js.map