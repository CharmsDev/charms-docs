---
title: Charms Visualization
sidebar:
  order: 1.5
---

To display Charms assets in your wallet, you'll need to fetch data from the Charms API. This section explains how to retrieve and display Charms data.

## Fetching Charms Data

To get all Charms associated with a specific UTXO, call the following API endpoint:

```http request
GET https://api-t4.charms.dev/spells/<txid>
```

Replace `<txid>` with the Bitcoin transaction ID you want to query.

Alternatively, use a PUT request with the same URL, but use the request body to provide the full hex-encoded transaction (`<txid>` in the URL **must** correspond to the transaction in the request body):

```http request
PUT https://api-t4.charms.dev/spells/<txid>
Content-Type: application/json

{
  "tx_hex": "<hex-encoded transaction>"
}
```

Both methods will return the same result, but the PUT method allows you to provide a transaction that may not yet have been broadcasted.


### Example

```http request
GET https://api-t4.charms.dev/spells/1acee7fb7c922b205e7c63abffe39a53527d4d7bbb0e5327a9b72350115a7ebb
```

Or

```http request
PUT https://api-t4.charms.dev/spells/1acee7fb7c922b205e7c63abffe39a53527d4d7bbb0e5327a9b72350115a7ebb
Content-Type: application/json

{
  "tx_hex": "02000000000102fbe73ccd1b36ff2b27f187333ad5d552eb104721855c7b53bb668ffb5375f3f80000000000ffffffffa67820e9662ef91c25e298452266f834282f9438e75fcc771fe66ccfd72d4bdd0000000000ffffffff02e803000000000000225120797226ba06796cd1043402f9b0a960bb3d5911b3eb159c2c7f23f02bb201d41ce4670200000000002251200e5de7f8ac4370c8241fea5496407aae321c94df32980eac51673598d7de0abb014098b6635a33147d3b6b6113eff3c401b0357a301267212b1e3af0809b01785e093b7f93ab3c0ff8f9d66e95ba8b4d7c97e6006d8ab504664c2b23268e51dd1dd60341024d428bdba20da5ef78b3dc8af290704dd68cbc9906dd85f1c5e925f151d6bad2c2bb6a6320a65216cabf3fe26ead1c6ced2964ac2e097e9fee5ecb43a16b2281fdf5020063057370656c6c4d080282a36776657273696f6e02627478a2647265667380646f75747381a100a2667469636b657268434841524d532d366972656d61696e696e671a000186a0716170705f7075626c69635f696e70757473a183616e98201857188a185b18af18d318ac0418ef183618da0818cb18e618210018cd05186f18c3188118fd1837188318de186e184618fc187418fc187c182718b298200618ff1853182218ce182d183d182318ab18a0184418181828186918da091842189e18f2182b183b181d18a30e1824187c182a183d187b187518d01839f69901041118b618a0189d0918f618cf189818d8183918cb185318a904188f18230b181b16185b18d0187818fb184518bc18c918bf18c5188f1618cf182d183718b2183d18a50f184018a21821188f0e185b18f318721840184718ae183d1840188b18b818271018d7182b18fe18ac1825186b187d18341847181d187318f41858160409184016187818331870187b18bd18f4183a0018f518a4188a186d182318d618ea181a182a188f188f182118e818aa18ae18a918a118b7187f18bf182f18bf1874184f1899189b186d184c18bc181e18ce185b18301893187018ad1852189218a818e718201854183418d718e418b218eb0718ab183118891833182f183818fb1869183b18f318bd18fb18b6182a189a08187818e1187f18e318511856185e185b18581885181e101898185a182d1838189b1878184cbd521890182d18fa186f18f218f0182e18d2181b18fb18de188c186b18a318d8188318d018231855181e18ff18b218200318ca18bb18461866189b18a61839182418d6182918f00c18b018a818511877186018b018a6188518a318bd186518660f0f1839182e1859184e18351898183a182918a818e51888184a1830188d182f0318f918d718b518511875187d181e1831189018d1182518ea18dd188c184e18ba17189f18d5189618f518a2185718b91857189418bd1863187918551878682074e32d2ccd9a8909402411911707e9dbd87f072e5225db989320892096ebd684ac21c074e32d2ccd9a8909402411911707e9dbd87f072e5225db989320892096ebd68400000000"
}
```


## API Response Structure

The REST API above is roughly equivalent to the `charms tx show-spell` CLI command, and to [`charms_client::tx::extract_and_verify_spell`](https://docs.rs/charms-client/latest/charms_client/tx/fn.extract_and_verify_spell.html) function in the `charms-client` Rust library.

The API returns a JSON object containing information about the Charms _spell_ describing all Charms in the outputs of the specified transaction. The response includes:

- Charms App Specifications, each containing:
  - tag ('n' for NFTs, 't' for fungible tokens)
  - identity (a 32-byte identifier)
  - verification key (a 32-byte verification key of the app's compiled code)
- Input Specifications, each containing:
  - UTXO ID of the input
- Output Specifications with Charms — mappings of App spec (referred to by a string like `$0001`) to Charm content, which may be:
  - Amounts (for fungible tokens)
  - Arbitrary data (for NFTs and other types of charms)

NFTs are recommended (but not required) to adhere to [CHIP-0420](https://github.com/CharmsDev/charms/tree/main/CHIPs/CHIP-0420) for structuring their content.

### Example Response

```json
{
  "version": 2,
  "apps": {
    "$0000": "n/578a5bafd3ac04ef36da08cbe62100cd056fc381fd3783de6e46fc74fc7c27b2/06ff5322ce2d3d23aba044182869da09429ef22b3b1da30e247c2a3d7b75d039"
  },
  "ins": [
    {
      "utxo_id": "f8f37553fb8f66bb537b5c85214710eb52d5d53a3387f1272bff361bcd3ce7fb:0"
    }
  ],
  "outs": [
    {
      "charms": {
        "$0000": {
          "ticker": "CHARMS-6",
          "remaining": 100000
        }
      }
    }
  ]
}
```

## Displaying Charms in Your Wallet

When implementing Charms visualization in your wallet:

1. **Scan UTXOs**: For each UTXO in the user's wallet, check if it contains Charms by querying the API
2. **Parse Responses**: Process the API responses to extract Charm data
3. **Render UI Elements**: Display Charms with appropriate visuals and information
4. **Handle Different Types**: Implement different display logic for NFTs vs. fungible tokens

### UI Considerations

- For NFTs, prominently display the image and name
- For tokens, show the quantity alongside the token name/symbol + image
- Include options for viewing detailed metadata (review Charms Token Metadata specification [CHIP-0420](https://github.com/CharmsDev/charms/tree/main/CHIPs/CHIP-0420))

## Testing

For testing purposes, you can use the API endpoint for Charms on [Bitcoin Testnet4](https://mempool.space/testnet4): 

```
https://api-t4.charms.dev/spells/<txid>
```

This allows to develop and test wallet integration without using mainnet assets and paying fees with real BTC.
