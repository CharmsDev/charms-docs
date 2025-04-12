---
title: Prover API
sidebar:
  order: 5
---

The Prover API is used to generate the required transactions for Charms transfers. This guide explains how to interact with the Prover API.

## API Endpoint

The Prover API endpoint is:

```
https://prove.charms.dev/spells/prove
```

For Bitcoin Testnet4, use:

```
https://prove-t4.charms.dev/spells/prove
```

:::note
You can run your own prover with `charms` crate compiled with the `prover` feature enabled. Run the server:
```bash
charms server
```

The local proving server endpoint is:
```
http://localhost:17784/spells/prove
```
:::

## Request Format

The API request should be a POST request with a JSON body containing the following parameters:

```javascript
const requestBody = {
  spell: parsedSpellJson,
  binaries: {},
  prev_txs: [],
  funding_utxo: "txid:vout",
  funding_utxo_value: utxoAmount,
  change_address: destinationAddress,
  fee_rate: 2.0
};
```

### Parameters

- **`spell`**: The Spell JSON object (see [Spell JSON Parameters](/guides/wallet-integration/transactions/spell-json))
- **`binaries`**: A map with app binaries (empty for basic transfers): **{** **app VK** (hex-encoded 32 bytes) to **app binary** (base64-encoded RISC-V ELF ) **}**. This is used by the prover to verify the spell against the app contract. The prover will run the program implementing the app contract with the spell data as input, and produce the ZK proof of its successful run, which it will use as input to produce the ZK proof of the spell as a whole.
- **`prev_txs`**: An array of previous transactions that created the UTXOs being spent, necessary to verify ownership in Bitcoin. Each transaction in the array should be provided in raw hex format.
- **`funding_utxo`**: The UTXO to use for funding the transaction (txid:vout format). **Must** be a plain Bitcoin output. The BTC from this UTXO is used to pay for the Bitcoin transaction fee and proving fee. The remaining amount is returned to `chage_address`. 
- **`funding_utxo_value`**: The value of the funding UTXO in satoshis
- **`change_address`**: The address to send any remaining satoshis from the funding UTXO
- **`fee_rate`**: The fee rate to use for the transaction in satoshis per byte

## Making the API Call

Here's an example of how to call the Prover API:

```javascript
// API endpoint
const proveApiUrl = 'https://prove-t4.charms.dev/spells/prove';

// Request body
const requestBody = {
    spell: {
        version: 2,
        apps: {
            "$01": "t/1dc78849dc544b2d2bca6d698bb30c20f4e5894ec8d9042f1dbae5c41e997334/b22a36379c7c0b1e987f680e33b2263d94f86e2a75063d698ccf842ce6592840"
        },
        ins: [
            {
                utxo_id: "55777ba206bf747724a4e96586f2d912a77baa8a15a4c63a0b510531ad5fa65e:0",
                charms: {
                    "$01": 420000
                }
            }
        ],
        outs: [
            {
                address: "tb1pyrznm3ma6cl83qljqhw8z2usyjcxtkx9tkrqfuhjgrpsuarxcn8s0ut5qs",
                charms: {
                    "$01": 420
                }
            },
            {
                address: "tb1phmk7c9mzaepumgeaz9lgly9qurkq6jxd44qssfd3w5563j49mfwqfrqvww",
                charms: {
                    "$01": 419580
                }
            }
        ]
    },
    binaries: {},
    prev_txs: [
        "020000000001028b09b30d0530d042905b7b2f0ca8f935b7433bc9c0e4f02b2e9d28eb37ba155b0000000000ffffffff40b90f5e4a1499112e43b48bee6fb2f094fe64d9ad245dc1e0b33c33f6226ad40000000000ffffffff04e803000000000000225120f31cd45a2d7f2a1e2f8f7dff239dd4690cdb4366b946535acec2bd7fe74e0417e803000000000000225120964a06012de954fe5f6834048e6711a5330d3bf89377dc81f688f0fab5ae36847b23000000000000225120ff9f32061f3d77df48351293ee8d5c9bb39730004edef0abfdf1c2484ff1b503cdfa0700000000002251205469c594963a0c6f14b0df1d2f1f52804cc6072741f9853c7e52d1009a5c971a014029c1d8380093ef6c315c247968f72a2eb98bef68b9ddbe3cc95c11ad14ece8031bbbbfe2de380a7c97be03d75b75ce64afae29e7f95ebac58abbc9060d043431034179f7a21aad0eb5a99ac49adccb19e80ef91917912186ebd2470e8e5ec4252d9b00bc68c035f2b92f3a7c02c8c99651584e0244a8359f6dea61da746126245ab881fdc0030063057370656c6c4d080282a36776657273696f6e02627478a2647265667380646f75747382a1011a000668a0a100a5667469636b65726443484558646e616d656a4348455820546f6b656e65696d616765781b68747470733a2f2f69696c692e696f2f33634f7371616a2e706e676375726c7368747470733a2f2f636861726d732e6465762f6972656d61696e696e671a041cdb40716170705f7075626c69635f696e70757473a283616e9820181d18c71888184918dc1854184b182d182b18ca186d1869188b18b30c182018f418e51889184e18c818d904182f181d18ba18e518c4181e189918731834982018b2182a18361837189c187c0b181e1898187f18680e183318b21826183d189418f8186e182a187506183d1869188c18cf1884182c18e6185918281840f68361749820181d18c71888184918dc1854184b182d182b18ca186d1869188b18b30c182018f418e51889184e18c818d904182f181d18ba18e518c4181e189918731834982018b2182a18361837189c187c0b181e1898187f18680e183318b21826183d189418f8186e182a187506183d1869188c18cf1884182c18e6185918281840f69901041118b618a0189d1819186d18df18eb0318a018b1188418cd184518fa18a804181e18b7184b181b1872183818b018f9188a18c218641418eb18f318d818f3183e188a1840181a18e01833188e1851184b1838141885183718471823185c16189b184d87017a187e183418be18e818e1184c184e183b18e418a40b182f18d11018f618be182d183518f618ed186818881844185c18821889188110184218cc187118f618901896182918e51826188a184100183b1840189418d1186b189c187618e20d18e31872183318d818ef18b518911850188718461897186703189516184b183e184604188b1854181f18e718ba186d184f18d518f118ef182918ca12187f18dc18c718fb183618df182b18cf1826184218cd08185e18b518d018b818c6183413187d18cb051889187118ef18cd1118a218f618510b18251881182918f3184c183d186b18561860185018cd1837188f188518c718f301188318f7183618f4186f182518a618a6182a184b0c186c1843187918471518b3185d18ab18291618d0181d1876188718541856183418da188c18821841181c0f181c18c5181800186a185018760e18bb188918c918491849182918ba14186a18eb181b18ce18a218ee182118c7189d0f111819185918201855185c188018e0186918f71865091898187b1518ca18f3186d18d4682096acf9b0d05f25d9519b932320fb6fa5fbc4dcf6a5556562733595a62284793cac21c096acf9b0d05f25d9519b932320fb6fa5fbc4dcf6a5556562733595a62284793c00000000"
    ],
    funding_utxo: "c8ed70616f053a10b028f22b66cc5d7e36229a899613308e381ce7010ce5cf57:2",
    funding_utxo_value: 496186,
    change_address: "tb1putrfz7kq9yh3jymjcumq9heu9s4q7nmm8x7k55462n9rua408y9svaw3uv",
    fee_rate: 2.0
};

// Make the API call
const response = await fetch(proveApiUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(requestBody)
});

// Response contains commit_tx and spell_tx
const result = await response.json();
const commitTx = result[0];
const spellTx = result[1];
```

## Response Format

The API response will be a JSON array with the following structure:

```json
[
  "hex_encoded_commit_tx",
  "hex_encoded_spell_tx"
]
```

The response is an array of exactly 2 hex-encoded transactions ready to be signed with the wallet's private key and submitted to be broadcasted as a package.

## Error Handling

The API may return error responses in the following cases:

- Invalid Spell JSON format
- Missing required parameters
- Insufficient funding UTXO value
- Invalid UTXO references
- Server errors

Implement proper error handling to catch and process these errors in your application.

## Implementation Tips

- Validate the Spell JSON before sending it to the API
- Ensure the funding UTXO has sufficient value to cover the transaction fees
- Use appropriate fee rates based on network conditions
- Implement retry logic for temporary server errors
- Store both transactions securely until they are signed and broadcast
