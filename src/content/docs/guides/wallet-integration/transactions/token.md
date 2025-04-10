---
title: Token Transfers
sidebar:
  order: 3
---

Token transfers involve sending a portion of tokens to a destination and returning the remainder to a change address. This guide explains how to implement token transfers in your wallet.

## Spell JSON for Token Transfers

For token transfers, you can send a portion of tokens to a destination and return the remainder to a change address. Here's the Spell JSON structure for a token transfer:

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
            "remaining": <transfer_amount>
          }
        },
        "sats": 1000
      },
      {
        "address": "<change_address>",
        "charms": {
          "$0000": {
            "ticker": "<charm_ticker>",
            "remaining": <remaining_amount>
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
- **ins**: Specifies the source UTXO containing the tokens
- **outs**: Defines both the destination and change outputs

## Important Validation Rule

The sum of `remaining` amounts in the outputs must equal the `remaining` amount in the input. For example, if the input has 100 tokens, and you're transferring 30 tokens, the change output must have 70 tokens.

## Implementation Steps

1. **Retrieve Token Data**: Get the token details from the source UTXO
2. **Calculate Amounts**: Determine the transfer amount and remaining amount
3. **Construct the Spell JSON**: Fill in the template with the specific token data (see [Spell JSON Reference](/references/spell-json))
4. **Validate the JSON**: Ensure all required fields are present and correctly formatted
5. **Proceed to Prover API**: Use this JSON in the Prover API call (see [Prover API](/guides/wallet-integration/transactions/prover-api))

## Example

Here's an example of a completed Spell JSON for a token transfer:

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
            "remaining": 100
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
            "remaining": 30
          }
        },
        "sats": 1000
      },
      {
        "address": "tb1pxu09u0xz9q0mtrqzv8tgz8523jgc4xk0w8a7pvvs5k0ymw3vq3zqy9nzse",
        "charms": {
          "$0000": {
            "ticker": "TOAD",
            "remaining": 70
          }
        },
        "sats": 1000
      }
    ]
  }
```

## UI Considerations

When implementing token transfers in your wallet UI:

- Allow users to specify the amount to transfer
- Clearly display both the transfer amount and the remaining amount
- Show the destination address in a user-friendly format
- Provide transaction fee information
- Include confirmation steps before proceeding
- Display transaction status updates during the process
