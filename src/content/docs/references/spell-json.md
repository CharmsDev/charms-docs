---
title: Spell JSON Reference
sidebar:
  order: 1
---

The Spell JSON is a critical component of Charms transfers. This reference provides a detailed explanation of each parameter in the Spell JSON format.

## Structure Overview

The Spell JSON has four main sections:

1. **version**: Protocol version identifier
2. **apps**: Application identifiers and verification keys
3. **ins**: Input UTXOs containing charms
4. **outs**: Output destinations for charms

## Parameter Details

### version

```json
"version": 2
```

- **Description**: Protocol version number
- **Required Value**: Must be 2 for the current protocol

### apps

```json
"apps": {
  "$0000": "n/<app_id>/<app_vk>"
}
```

- **$0000**: App identifier within the spell (can be any unique identifier)
- **app_id**: Unique identifier for the application (remains consistent for related NFTs/tokens)
- **app_vk**: Verification key for the application

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
