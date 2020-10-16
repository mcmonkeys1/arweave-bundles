"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sign = exports.addTag = exports.createData = void 0;
const ar_data_base_1 = require("./ar-data-base");
const ar_data_verify_1 = require("./ar-data-verify");
/**
 * Create a DataItem, encoding tags and data, setting owner, but not
 * sigining it.
 *
 * @param deps
 * @param opts
 * @param jwk
 */
async function createData(deps, opts, jwk) {
    const d = {
        owner: jwk.n,
        target: opts.target || '',
        nonce: opts.nonce || '',
        tags: opts.tags ?
            opts.tags.map(t => ({ name: deps.utils.stringToB64Url(t.name), value: deps.utils.stringToB64Url(t.value) })) :
            [],
        data: typeof opts.data === 'string' ?
            deps.utils.stringToB64Url(opts.data) :
            deps.utils.bufferTob64Url(opts.data),
        signature: '',
        id: '',
    };
    if (!ar_data_verify_1.verifyEncodedTagsArray(deps, d.tags)) {
        throw new Error(`Tags are invalid, a maximum of ${ar_data_verify_1.MAX_TAG_COUNT} tags, a key length of ${ar_data_verify_1.MAX_TAG_KEY_LENGTH_BYTES}, a value length of ${ar_data_verify_1.MAX_TAG_VALUE_LENGTH_BYTES} has been exceeded, or the tags are otherwise malformed.`);
    }
    return d;
}
exports.createData = createData;
function addTag(deps, d, name, value) {
    d.tags.push({
        name: deps.utils.stringToB64Url(name),
        value: deps.utils.stringToB64Url(value)
    });
}
exports.addTag = addTag;
/**
 * Signs a data item and sets the `signature` and `id` fields to valid values.
 *
 * @param deps
 * @param d
 * @param jwk
 */
async function sign(deps, d, jwk) {
    // Sign 
    const signatureData = await ar_data_base_1.getSignatureData(deps, d);
    const signatureBytes = await deps.crypto.sign(jwk, signatureData);
    // Derive Id 
    const idBytes = await deps.crypto.hash(signatureBytes);
    // Assign. TODO: Don't mutate. For familiarity with existing sign tx api we mutate. 
    d.signature = deps.utils.bufferTob64Url(signatureBytes);
    d.id = deps.utils.bufferTob64Url(idBytes);
    return d;
}
exports.sign = sign;
