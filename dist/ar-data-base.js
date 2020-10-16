"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignatureData = exports.DataItemJson = void 0;
/**
 * Serialized format of a DataItem. Json.
 */
class DataItemJson {
    constructor() {
        this.owner = '';
        this.target = '';
        this.nonce = '';
        this.tags = [];
        this.data = '';
        this.signature = '';
        this.id = '';
    }
}
exports.DataItemJson = DataItemJson;
/**
 * Return the message that should be signed to produce a valid signature
 *
 * @param deps
 * @param d
 */
async function getSignatureData(deps, d) {
    return deps.deepHash([
        deps.utils.stringToBuffer('dataitem'),
        deps.utils.stringToBuffer('1'),
        deps.utils.b64UrlToBuffer(d.owner),
        deps.utils.b64UrlToBuffer(d.target),
        deps.utils.b64UrlToBuffer(d.nonce),
        [
            ...d.tags.map(tag => [deps.utils.b64UrlToBuffer(tag.name), deps.utils.b64UrlToBuffer(tag.value)])
        ],
        deps.utils.b64UrlToBuffer(d.data)
    ]);
}
exports.getSignatureData = getSignatureData;
