---
title: NFT Transfers
sidebar:
  order: 2
---

NFT transfers involve sending the entire charm to a single destination. This guide explains how to implement NFT transfers in your wallet.

## Spell JSON for NFT Transfers

For NFT transfers, the entire charm is sent to a single destination. Here's the Spell JSON structure for an NFT transfer:

```json
{
    "version": 2,
    "apps": {
      "$0000": "n/<app_id>/<app_vk>"
    },
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
    ],
    "outs": [
      {
        "address": "<destination_address>",
        "charms": {
          "$0000": {
            "ticker": "<charm_ticker>",
            "remaining": <total_amount>
          }
        },
        "sats": 1000
      }
    ]
  }
```

## Key Components

- **version**: Must be set to 2 for the current protocol
- **apps**: Contains the app identifier and verification key
- **ins**: Specifies the source UTXO containing the charm
- **outs**: Defines the destination for the charm

**Note:** Within the `ins` and `outs` sections, the following fields are properties of the NFT itself:
- **ticker**: The unique identifier for the charm (e.g., `"ticker": "<charm_ticker>"`)
- **remaining**: The total amount of the charm (e.g., `"remaining": <total_amount>`)

## Implementation Steps

1. **Retrieve Charm Data**: Get the charm's details from the source UTXO
2. **Construct the Spell JSON**: Fill in the template with the specific charm data (see [Spell JSON Reference](/guides/wallet-integration/references/spell-json))
3. **Validate the JSON**: Ensure all required fields are present and correctly formatted
4. **Proceed to Prover API**: Use this JSON in the Prover API call (see [Prover API](/guides/wallet-integration/transfer/prover-api))

## Example

Here's an example of a completed Spell JSON for an NFT transfer:

```json
{
    "version": 2,
    "apps": {
      "$0000": "n/8e877d70518a5b28f5221e70bd7ff7692a603f3a26d7076a5253e21c304a354f/8e877d70518a5b28f5221e70bd7ff7692a603f3a26d7076a5253e21c304a354f"
    },
    "ins": [
      {
        "utxo_id": "a2889190343435c86cd1c2b70e58efed0d101437a753e154dff1879008898cd2:2",
        "charms": {
          "$0000": {
            "ticker": "TOAD",
            "remaining": 1
          }
        }
      }
    ],
    "outs": [
      {
        "address": "tb1p3w06fgh64axkj3uphn4t258ehweccm367vkdhkvz8qzdagjctm8qaw2xyv",
        "charms": {
          "$0000": {
            "ticker": "TOAD",
            "remaining": 1
          }
        },
        "sats": 1000
      }
    ]
  }
```

## UI Considerations

When implementing NFT transfers in your wallet UI:

- Clearly display the NFT being transferred
- Show the destination address in a user-friendly format
- Provide transaction fee information
- Include confirmation steps before proceeding
- Display transaction status updates during the process
