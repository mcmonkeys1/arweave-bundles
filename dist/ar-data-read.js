"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.unpackTags = exports.decodeTagAt = exports.decodeTag = exports.decodeData = void 0;
/**
 * Decode the data content of a DataItem, either to a string or Uint8Array of bytes
 *
 * @param deps
 * @param d
 * @param param2
 */
async function decodeData(deps, d, options = { string: false }) {
    if (options.string) {
        return deps.utils.b64UrlToString(d.data);
    }
    else {
        return deps.utils.b64UrlToBuffer(d.data);
    }
}
exports.decodeData = decodeData;
/**
 * Decode an individual tag from a DataItem. Always decodes name and value as strings
 *
 * @param deps
 * @param tag
 */
async function decodeTag(deps, tag) {
    return { name: deps.utils.b64UrlToString(tag.name), value: deps.utils.b64UrlToString(tag.value) };
}
exports.decodeTag = decodeTag;
/**
 * Decodes an individual tag from a DataItem at index. Throws if index is out of bounds.
 *
 */
async function decodeTagAt(deps, d, index) {
    if (d.tags.length < index - 1) {
        throw new Error(`Invalid index ${index} when tags array has ${d.tags.length} tags`);
    }
    return decodeTag(deps, d.tags[index]);
}
exports.decodeTagAt = decodeTagAt;
/**
 * Unpack all tags in a DataItem into a key value map of
 *
 * `name: string | string[]`
 *
 * Always decodes as string values, maintains the order
 * the tags were seriliazed in when converting a collection
 * of tags with the same key.
 *
 * @param deps
 * @param d
 */
async function unpackTags(deps, d) {
    const tags = {};
    for (let i = 0; i < d.tags.length; i++) {
        const { name, value } = await decodeTag(deps, d.tags[i]);
        if (!tags.hasOwnProperty(name)) {
            tags[name] = value;
            continue;
        }
        tags[name] = [...tags[name], value];
    }
    return tags;
}
exports.unpackTags = unpackTags;
//# sourceMappingURL=ar-data-read.js.map