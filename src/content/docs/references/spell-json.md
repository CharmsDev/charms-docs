---
title: Spell JSON Reference
sidebar:
  order: 1
---

_Spell_ is the metadata added to a Bitcoin transaction to make it also a Charms transaction: spells create charms. This reference provides an explanation of each parameter in the Spell JSON format.

## Structure Overview

The Spell JSON has the following top-level fields:

1. **`version`**: Protocol version identifier
2. **`apps`**: Application identifiers and verification keys
3. **`public_inputs`**: Public inputs for apps (optional)
4. **`private_inputs`**: Private inputs for apps (optional) — **not** recorded on-chain.
5. **`ins`**: Input UTXOs containing charms
6. **`outs`**: Output destinations for charms

## Parameter Details

### `version`

Protocol version number.

```json
"version": 2
```

**Required Value**: Must be `2` for the current protocol. 

Spells exist on-chain with lower versions, and they are recognized by the client, but are not supported by the prover.

### `apps`

Lists apps involved in the transaction. Each app is specified by a **tag**, **identity** and **verification key**.

```json
"apps": {
  "$00": "n/<app_id>/<app_vk>",
  "$01": "t/<app_id>/<app_vk>"
}
```

- `$00`, `$01`: App references within the spell (can be any unique identifier)
- tag: **`n`** — the app represents an NFT, **`t`** — the app represents a fungible token
- **`<app_id>`**: hex-encoded 32-byte app identity (the same for related NFTs/tokens)
- **`<app_vk>`**: hex-encoded 32-byte app verification key

There can be multiple apps in the same spell. Apps only different in the tag (e.g. `n` vs `t`) are considered different apps. Such apps can be related (and most likely are), for example, an NFT can manage issuance of a fungible token and carry token metadata (name, ticker symbol, description, logo, website URL, etc.) as recommended in [CHIP-420](https://github.com/CharmsDev/charms/blob/main/CHIPs/CHIP-0420). 

### `public_inputs`

Public inputs for proving the transaction against app contracts. This section is **optional**. It is not needed for simple transfers.

```json
"public_inputs": {
  "$00": <public input data for app $00>,
  "$0N": <public input data for app $0N>
}
```

- `$00`, `$0N`: App references (same as in the `apps` section). Any app from the `apps` section can have an entry here, but it is not required.
- **`<public input data>`**: Public input data required for the app's proof generation. This data **is** recorded on-chain.

### `private_inputs`

Private inputs for proving the transaction against app contracts. This section is **optional**. It is not needed for simple transfers.

```json
"private_inputs": {
  "$00": <private input data for app $00>,
  "$0N": <private input data for app $0N>
}
```

- `$00`, `$0N`: App references (same as in the `apps` section). Any app from the `apps` section can have an entry here, but it is not required.
- **`<private input data>`**: Private input data required for the app's proof generation. This data **is not** recorded on-chain.

### `ins`

Input UTXOs of the transaction. This section is **required** (can be an empty list — for transactions not spending any outputs with charms).

```json
"ins": [
  {
    "utxo_id": "<txid>:<vout>",
    "charms": {
      "$00": <charm data>,
      "$0m": <charm data>
    }
  },
  {
    "utxo_id": "<source_txid>:<vout>",
    "charms": {
      "$00": <charm data>,
      "$0n": <charm data>
    }
  }
]
```

- **`utxo_id`**: Transaction ID and output index (txid:vout) of a UTXO being spent
- **`charms`**: Charms in the specified UTXO
  - $00, $0m, $0n: App references (same as in the `apps` section). Any app from the `apps` section can have charms in source UTXOs.
  - **`<charm data>`**: Depending on the app, this can be a single unsigned integer value (for fungible tokens) or a complex object (for NFTs). For example:
    - For fungible tokens: `<charm data>` is the amount of the token in the UTXO
    - For NFTs: `<charm data>` is an object containing metadata properties of the NFT

### `outs`

Transaction outputs. This section is **required** (can be an empty list — for transactions not creating any outputs with charms).

```json
"outs": [
  {
    "address": "<destination_address>",
    "charms": {
      "$00": <charm data>,
      "$0m": <charm data>
    },
    "sats": 1000
  },
  {
    "address": "<destination_address>",
    "charms": {
      "$00": <charm data>,
      "$0n": <charm data>
    },
    "sats": 1000
  }
]
```

- **`address`**: Recipient's Bitcoin address
- **`charms`**: Charms in the specified UTXO
  - $00, $0m, $0n: App references (same as in the `apps` section). Any app from the `apps` section can have charms in source UTXOs.
  - **`<charm data>`**: Depending on the app, this can be a single unsigned integer value (for fungible tokens) or a complex object (for NFTs). For example:
    - For fungible tokens: `<charm data>` is the amount of the token in the UTXO, e.g. `42` or `69000`
    - For NFTs: `<charm data>` is an object containing metadata properties of the NFT — see [CHIP-420](https://github.com/CharmsDev/charms/tree/main/CHIPs/CHIP-0420)
- **`sats`**: Amount of satoshis to include in the output (optional, defaults to 1000, can be as low as the current dust limit)

## Implementation Tips

- Retrieve the UTXO information from your wallet's UTXO set
- Validate all values before constructing the final JSON
- Use proper JSON serialization to avoid formatting issues
