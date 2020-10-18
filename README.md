# Arweave-Data (ANS-102)

This library contains routines to create, read, and verify Arweave bundled data.

See [ANS-102](https://github.com/ArweaveTeam/arweave-standards/blob/master/ans/ANS-102.md) for more details.

## Initializing the library

This is a self-contained library, so we need to initialize the API with a couple of dependencies:

```javascript
import Arweave from 'arweave'
import deepHash from 'arweave/node/lib/deepHash'
import ArweaveData from 'arweave-data'

const ArData = ArweaveData({
  utils: Arweave.utils,
  crypto: Arweave.crypto,
  deepHash: deepHash,
})
```

~~## Unbundling from a Transaction containing DataItems~~

~~## Reading data and tags from a DataItem~~

No special instructions! 😃 You can now query and read the data from your bundled item transactions, just like any other fully fledged Arweave transaction


## Creating a DataItem

```javascript
const myTags = [
  { name: 'App-Name', value: 'myApp' },
  { name: 'App-Version', value: '1.0.0' }
]

let item = await ArData.createData(
  { 
    to: 'wallet_address', 
    data: 'some message', 
    tags: myTags 
  }, 
  wallet
);

// Add some more tags after creation.
ArData.addTag(item, 'MyTag', 'value1');
ArData.addTag(item, 'MyTag', 'value2');

// Sign the data, ready to be added to a bundle
const signed1 = await ArData.sign(item, wallet);

// ...construct a signed2 dataItem here for example...

```

## Bundling up DataItems and writing a transaction

```javascript

const dataItems = [signed1, signed2] //add more signed DataItems if you like

// Will ensure all items are valid and have been signed, throwing if any are not
const myBundle = await ArData.bundleData(dataItems);

// N.B. I have updated the return type of bundledData, just feed it straight into createTransaction like so:

const myTx = await arweave.createTransaction({ data: myBundle }, wallet);

myTx.addTag('Bundle-Format', 'json');
myTx.addTag('Bundle-Version', '1.0.0');
myTx.addTag('Content-Type', 'application/json');

await arweave.transactions.sign(tx, wallet);
await arweave.transactions.post(tx);

```

