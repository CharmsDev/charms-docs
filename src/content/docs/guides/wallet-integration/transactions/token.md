---
title: Fungible Token Transfers
sidebar:
  order: 3
---

Token transfers involve spending one of more outputs with tokens, and creating one or more destination outputs with the same total amount of tokens.

## Spell JSON for Token Transfers

Here's the Spell JSON structure for a token transfer:

```json
{
  "version": 11,
  "tx": {
    "ins": [
      "<source_txid_1>:<vout_1>",
      "<source_txid_N>:<vout_N>"
    ],
    "outs": [
      {
        "0": <dest_amount_1>
      },
      {
        "0": <dest_amount_N>
      }
    ],
    "coins": [
      {
        "amount": 1000,
        "dest": "<destination_hex_1>"
      },
      {
        "amount": 1000,
        "dest": "<destination_hex_N>"
      }
    ]
  },
  "app_public_inputs": {
    "t/<app_id>/<app_vk>": null
  }
}
```

:::note
The simplest case is when the transaction does **not involve** anything beside simple transfers. If it does (e.g. new tokens are minted or any inputs or outputs contain charms that are neither tokens nor NFTs), the transaction must satisfy the app contracts involved. We will describe how to deal with this in the [Prover API](/guides/wallet-integration/transactions/prover-api) section.
:::

## Key Components

- **`version`**: Must be `11` for Charms `v11.0.1`
- **`app_public_inputs`**: Lists apps involved in the spell (for simple token transfers use `null` value)
- **`tx.ins`**: Source UTXO list (`txid:vout`)
- **`tx.outs`**: Destination charm outputs, keyed by app index (`"0"`, `"1"`, ...)
- **`tx.coins`**: Native coin outputs; `dest` is a hex destination (`charms util dest`)


## Implementation Steps

1. **Retrieve Token Data**: Collect source UTXOs and token amounts
2. **Calculate Amounts**: Determine transfer and change token amounts
3. **Construct the Spell JSON**: Fill in `tx` and `app_public_inputs` (see [Spell JSON Reference](/references/spell-json))
4. **Add Coin Outputs**: Build `tx.coins` entries (`amount`, `dest`) for Bitcoin outputs
5. **Proceed to Prover API**: Use this JSON in the Prover API call (see [Prover API](/guides/wallet-integration/transactions/prover-api))

## Example

Here's an example of a completed Spell JSON for a token transfer:

```json
{
  "version": 11,
  "tx": {
    "ins": [
      "55777ba206bf747724a4e96586f2d912a77baa8a15a4c63a0b510531ad5fa65e:0"
    ],
    "outs": [
      {
        "0": 420
      },
      {
        "0": 419580
      }
    ],
    "coins": [
      {
        "amount": 1000,
        "dest": "2f7e10b8f6e2089b5bb5dcce96e8dd49ca01012f6506af0fe7bf5d2f2f5db531"
      },
      {
        "amount": 1000,
        "dest": "009fb48961bca8ec68f01ec882f7ec0dc7dc5cc6bcf4ad154f129ea2338f6cd1"
      }
    ]
  },
  "app_public_inputs": {
    "t/1dc78849dc544b2d2bca6d698bb30c20f4e5894ec8d9042f1dbae5c41e997334/b22a36379c7c0b1e987f680e33b2263d94f86e2a75063d698ccf842ce6592840": null
  }
}
```

**Note:** The content of a token charm is the token amount. In `tx.outs`, the app index `"0"` refers to the first app in `app_public_inputs`.

## UI Considerations

When implementing token transfers in your wallet UI:

- Allow users to specify the amount to transfer
- Clearly display the transfer amount(s) and the remaining amount(s)
- Show the destination address in a user-friendly format
- Provide transaction fee information
- Include confirmation steps before proceeding
- Display transaction status updates during the process
