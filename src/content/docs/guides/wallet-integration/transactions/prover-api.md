---
title: Prover API
sidebar:
  order: 5
---

The Prover API is used to generate the required transactions for Charms transfers. This guide explains how to interact with the Prover API.

## API Endpoint

The prover route is:

```
POST /spells/prove
```

If you run your own prover server, the default base URL is `http://localhost:17784`.

:::note
Run the server:
```bash
charms server
```

Then use:
```
http://localhost:17784/spells/prove
```

Readiness endpoint:

```
GET http://localhost:17784/ready
```
:::

## Request Format

Send a `POST` request with JSON (or CBOR) body containing the following fields:

```javascript
const requestBody = {
  spell: "<hex-encoded_normalized_spell>",
  app_private_inputs: {},
  tx_ins_beamed_source_utxos: {},
  binaries: {},
  prev_txs: [],
  change_address: destinationAddress,
  fee_rate: 2.0,
  chain: "bitcoin"
};
```

### Parameters

- **`spell`**: Hex-encoded normalized spell payload (`version: 11` schema)
- **`app_private_inputs`**: Optional map of app spec (`tag/identity/vk`) to private input data
- **`tx_ins_beamed_source_utxos`**: Optional map for beamed inputs (`input_index -> [source_utxo, nonce]`)
- **`binaries`**: Optional map of app verification key (hex) to base64 app binary bytes
- **`prev_txs`**: Previous transactions needed for validation/proving
- **`change_address`**: Required change address for the target chain
- **`fee_rate`**: Optional Bitcoin fee rate in sats/vB (defaults to `2.0`)
- **`chain`**: Target chain (`bitcoin` or `cardano`)
- **`collateral_utxo`**: Optional Cardano collateral UTXO (`txid:vout`), required for Cardano proving flows

## Making the API Call

Here's an example of how to call the Prover API:

```javascript
// API endpoint
const proveApiUrl = 'http://localhost:17784/spells/prove';

// Request body
const requestBody = {
  spell: "a36f76657273696f6e0b627478...",
  app_private_inputs: {},
  tx_ins_beamed_source_utxos: {},
  binaries: {},
  prev_txs: [
    { bitcoin: "020000000001..." }
  ],
  change_address: "tb1putrfz7kq9yh3jymjcumq9heu9s4q7nmm8x7k55462n9rua408y9svaw3uv",
  fee_rate: 2.0,
  chain: "bitcoin"
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

The API response is a JSON array of chain-tagged transactions.

```json
[
  { "bitcoin": "hex_encoded_commit_tx" },
  { "bitcoin": "hex_encoded_spell_tx" }
]
```

For Cardano, entries are tagged as `{ "cardano": ... }`.

## Error Handling

The API may return error responses in the following cases:

- Invalid Spell JSON format
- Missing required parameters
- Invalid UTXO references
- Server errors

Implement proper error handling to catch and process these errors in your application.

## Implementation Tips

- Validate the Spell JSON before sending it to the API
- Ensure the funding UTXO has sufficient value to cover the transaction fees
- Use appropriate fee rates based on network conditions
- Implement retry logic for temporary server errors
- Store both transactions securely until they are signed and broadcast
