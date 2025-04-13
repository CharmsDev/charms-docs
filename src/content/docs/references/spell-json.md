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

### ins

```json
"ins": [
  {
    "utxo_id": "<source_txid>:<vout>",
    "charms": {
      "$0000": {
        "ticker": "<charm_ticker>",
        "remaining": <total_amount>
      }
    }
  }
]
```

- **utxo_id**: Transaction ID and output index (txid:vout) where the charm is stored
- **charms**: Charm data to be transferred
  - **$0000**: Reference to the app identifier from the apps section
  - **ticker**: Symbol or name of the charm
  - **remaining**: Total amount of the charm in this UTXO

### outs

```json
"outs": [
  {
    "address": "<destination_address>",
    "charms": {
      "$0000": {
        "ticker": "<charm_ticker>",
        "remaining": <transfer_amount>
      }
    },
    "sats": 1000
  }
]
```

- **address**: Recipient's Bitcoin address
- **charms**: Charm data to transfer
  - **$0000**: Reference to the app identifier from the apps section
  - **ticker**: Symbol or name of the charm (must match input)
  - **remaining**: Amount of the charm to transfer to this address
- **sats**: Amount of satoshis to include with the charm (minimum dust value)

## NFT Properties

Within the `ins` and `outs` sections, the following fields are properties of the NFT itself:

- **ticker**: The unique identifier for the charm (e.g., `"ticker": "<charm_ticker>"`)
- **remaining**: The total amount of the charm (e.g., `"remaining": <total_amount>`)

These are metadata properties of the charm and can be defined in the app.

## Validation Rules

When constructing a Spell JSON:

1. For token transfers, the sum of `remaining` amounts in all outputs must equal the `remaining` amount in the input
2. Each output must include a minimum amount of satoshis (typically 1000 sats or the current dust limit)

## Implementation Tips

- Retrieve the UTXO information from your wallet's UTXO set
- Validate all values before constructing the final JSON
- Use proper JSON serialization to avoid formatting issues
