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

For testnet, use:

```
https://prove-t4.charms.dev/spells/prove
```

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

- **spell**: The Spell JSON object (see [Spell JSON Parameters](/guides/wallet-integration/transactions/spell-json))
- **binaries**: An object containing binary data (empty for basic transfers)
- **prev_txs**: An array of previous transactions that created the UTXOs being spent, necessary to verify ownership in Bitcoin. Each transaction in the array should be provided in raw hex format.
- **funding_utxo**: The UTXO to use for funding the transaction (txid:vout format)
- **funding_utxo_value**: The value of the funding UTXO in satoshis
- **change_address**: The address to send any remaining satoshis from the funding UTXO
- **fee_rate**: The fee rate to use for the transaction in satoshis per byte

## Making the API Call

Here's an example of how to call the Prover API:

```javascript
// API endpoint
const proveApiUrl = 'https://prove.charms.dev/spells/prove';

// Request body
const requestBody = {
  spell: parsedSpellJson,
  binaries: {},
  prev_txs: [],
  funding_utxo: "txid:vout",
  funding_utxo_value: utxoAmount,
  change_address: destinationAddress,
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
const commitTx = result.commit_tx;
const spellTx = result.spell_tx;
```

## Response Format

The API response will be a JSON object containing the following fields:

```json
{
  "commit_tx": "hex_encoded_transaction",
  "spell_tx": "hex_encoded_transaction"
}
```

### Response Fields

- **commit_tx**: The hex-encoded commit transaction
- **spell_tx**: The hex-encoded spell transaction

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
