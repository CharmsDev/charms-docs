---
title: Prover API
sidebar:
  order: 5
---

The Prover API generates the required transactions (commit + spell) for Charms operations. You can use the hosted service or run your own prover server.

## API Endpoint

```
POST /spells/prove
```

### Hosted service

The Charms CLI (when built without the `prover` feature) calls the hosted proving service by default:

```
https://v11.charms.dev/spells/prove
```

You can override this URL by setting the `CHARMS_PROVE_API_URL` environment variable.

### Self-hosted server

Run your own prover:

```bash
charms server
```

Then use:
```
http://localhost:17784/spells/prove
```

Readiness check:

```
GET http://localhost:17784/ready
```

The self-hosted server accepts both `application/json` and `application/cbor` request bodies (auto-detected from the `Content-Type` header) and responds in the same format.

## Request Format

Send a `POST` request with a JSON body containing the following fields:

```javascript
const requestBody = {
  spell: {
    version: 11,
    tx: {
      ins: ["<txid>:<vout>"],
      outs: [{ "0": { ticker: "EXAMPLE", remaining: 100000 } }],
      coins: [{ amount: 1000, dest: "<hex_destination>" }]
    },
    app_public_inputs: {
      "n/<app_id>/<app_vk>": null
    }
  },
  app_private_inputs: {},
  tx_ins_beamed_source_utxos: {},
  binaries: {},
  prev_txs: [
    { bitcoin: "020000000001..." }
  ],
  change_address: "tb1p...",
  fee_rate: 2.0,
  chain: "bitcoin"
};
```

### Parameters

- **`spell`**: The spell object (same structure as [Spell JSON](/references/spell-json))
- **`app_private_inputs`**: Optional map of app spec (`tag/identity/vk`) to private input data
- **`tx_ins_beamed_source_utxos`**: Optional map for beamed inputs (`input_index -> [source_utxo, nonce]`)
- **`binaries`**: Optional map of app verification key (hex) to app binary bytes
- **`prev_txs`**: Previous transactions needed for validation/proving (chain-tagged, e.g. `{ bitcoin: "hex..." }`)
- **`change_address`**: Required change address for the target chain
- **`fee_rate`**: Optional Bitcoin fee rate in sats/vB (defaults to `2.0`)
- **`chain`**: Target chain (`bitcoin` or `cardano`)
- **`collateral_utxo`**: Optional Cardano collateral UTXO (`txid:vout`), required for Cardano proving flows

## Making the API Call

Here's an example of how to call the Prover API:

```javascript
// API endpoint (self-hosted or use https://v11.charms.dev/spells/prove)
const proveApiUrl = 'http://localhost:17784/spells/prove';

// Build the spell object (see Spell JSON reference for full structure)
const spell = {
  version: 11,
  tx: {
    ins: ["eb711823b50d368c5e0121649e414d78086cad69817b5163e871f7039ac0a4a3:0"],
    outs: [{ "0": { ticker: "CHARMIX", name: "Panoramix #1" } }],
    coins: [{ amount: 1000, dest: "2f7e10b8f6e2089b5bb5dcce96e8dd49ca01012f6506af0fe7bf5d2f2f5db531" }]
  },
  app_public_inputs: {
    "n/af50d82d1e47e77ef5d03d1f6a1280eb137c91a51d696edcc0d2cc9351659508/a0029d4e7f8ba7361cde6004561c6209d968bd3686c456504cd0005e19ac1a2f": null
  }
};

// Request body
const requestBody = {
  spell,
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

- **HTTP 400**: Invalid spell, missing required parameters, invalid UTXO references
- **HTTP 500**: Transient prover failures (retry with backoff)

Implement proper error handling to catch and process these errors in your application.

## Implementation Tips

- Validate the Spell JSON before sending it to the API
- Ensure the funding UTXO has sufficient value to cover the transaction fees
- Use appropriate fee rates based on network conditions
- Implement retry logic for temporary server errors (HTTP 500)
- Store both transactions securely until they are signed and broadcast
