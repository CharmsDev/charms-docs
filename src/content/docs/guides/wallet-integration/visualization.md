---
title: Charms Visualization
sidebar:
  order: 1.5
---

To display Charms assets in your wallet, you'll need to fetch data from the Charms API. This section explains how to retrieve and display Charms data.

## Fetching Charms Data

To get all Charms associated with a specific UTXO, call the following API endpoint:

```
https://api-t4.charms.dev/spells/<txid>
```

Replace `<txid>` with the Bitcoin transaction ID you want to query.

### Example

```http request
GET https://api-t4.charms.dev/spells/1acee7fb7c922b205e7c63abffe39a53527d4d7bbb0e5327a9b72350115a7ebb
```

## API Response Structure

The API returns a JSON object containing information about all Charms in the outputs of the specified transaction. The response includes:

- Charms App Specifications
- Input Specifications, each containing:
  - UTXO ID of the input
- Output Specifications with Charms — mappings of Apps to Charms' contents, which may be:
  - Amounts (for fungible tokens)
  - Arbitrary data (for NFTs)

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
- Include options for viewing detailed metadata (review charms metadata standard)
- Provide clear transfer functionality for each Charm

## Testing

For testing purposes, you can use the testnet API endpoint:

```
https://api-t4.charms.dev/spells/<txid>
```

This allows you to develop and test your integration without using mainnet assets.
