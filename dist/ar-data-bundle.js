"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bundleData = exports.unbundleData = void 0;
const ar_data_verify_1 = require("./ar-data-verify");
/**
 * Unbundles a transaction into an Array of DataItems.
 *
 * Takes either a json string or object. Will throw if given an invalid json
 * string but otherwise, it will return an empty array if
 *
 * a) the json object is the wrong format
 * b) the object contains no valid DataItems.
 *
 * It will verify all DataItems and discard ones that don't pass verification.
 *
 * @param deps
 * @param txData
 */
async function unbundleData(deps, txData) {
    if (typeof txData === 'string') {
        txData = JSON.parse(txData);
    }
    if (typeof txData !== 'object' || !txData || !txData.items || !Array.isArray(txData.items)) {
        console.warn(`Invalid bundle, should be a json string or obect with an items Array`);
        return [];
    }
    const itemsArray = txData.items;
    const verifications = await Promise.all(itemsArray.map(d => ar_data_verify_1.verify(deps, d)));
    const failed = verifications.filter(v => !v).length;
    if (failed > 0) {
        console.warn(`${failed} peices of Data failed verification and will be discarded`);
        return itemsArray.filter((x, idx) => verifications[idx]);
    }
    return itemsArray;
}
exports.unbundleData = unbundleData;
/**
 * Verifies all datas and returns a json object with an items array.
 * Throws if any of the data items fail verification.
 *
 * @param deps
 * @param datas
 */
async function bundleData(deps, datas) {
    await Promise.all(datas.map(async (d) => { if (!(await ar_data_verify_1.verify(deps, d))) {
        throw new Error('Invalid Data');
    } }));
    return JSON.stringify({ items: datas });
}
exports.bundleData = bundleData;
//# sourceMappingURL=ar-data-bundle.js.map