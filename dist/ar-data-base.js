/**
 * Serialized format of a DataItem. Json.
 */
export class DataItemJson {
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
/**
 * Return the message that should be signed to produce a valid signature
 *
 * @param deps
 * @param d
 */
export async function getSignatureData(deps, d) {
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
