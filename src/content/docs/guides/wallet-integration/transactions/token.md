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
  "version": 2,
  "apps": {
    "$00": "t/<app_id>/<app_vk>"
  },
  "ins": [
    {
      "utxo_id": "<source_txid_1>:<vout_1>",
      "charms": {
        "$00": <amount_1>
      }
    },
    {
      "utxo_id": "<source_txid_N>:<vout_N>",
      "charms": {
        "$00": <amount_N>
      }
    }
  ],
  "outs": [
    {
      "address": "<dest_address_1>",
      "charms": {
        "$00": <dest_amount_1>
      }
    },
    {
      "address": "<dest_address_N>",
      "charms": {
        "$00": <dest_amount_N>
      }
    }
  ]
}
```

:::note
The simplest case is when the transaction does **not involve** anything beside simple transfers. If it does (e.g. new tokens are minted or any inputs or outputs contain charms that are neither tokens nor NFTs), the transaction must satisfy the app contracts involved. We will describe how to deal with this in the [Prover API](/guides/wallet-integration/transactions/prover-api) section.
:::

## Key Components

- **`version`**: Must be set to 2 for the current protocol
- **`apps`**: Lists app specifications (each token is an app)
- **`ins`**: Specifies the source UTXO(s): 
  - **`utxo_id`**: The transaction ID and output index (txid:vout) of the source UTXO
  - **`charms`** (optional): Contains the tokens being transferred. Optional: it's there for developer convenience, the Charms prover doesn't need it.
- **`outs`**: Defines destination outputs:
  - **`address`**: The destination address for the tranferred tokens
  - **`charms`**: Describes charms (in this case, the transferred tokens) being created in the output
  - **`sats`**: The amount of satoshis for the output (optional, defaults to 1000)


## Implementation Steps

1. **Retrieve Token Data**: Collect the source UTXOs and their token amounts.
2. **Calculate Amounts**: Determine the transfer and change amounts
3. **Construct the Spell JSON**: Fill in the template with the specific token data (see [Spell JSON Reference](/references/spell-json))
4. **Validate the JSON**: Ensure all required fields are present and correctly formatted
5. **Proceed to Prover API**: Use this JSON in the Prover API call (see [Prover API](/guides/wallet-integration/transactions/prover-api))

## Example

Here's an example of a completed Spell JSON for a token transfer:

```json
{
  "version": 2,
  "apps": {
    "$01": "t/1dc78849dc544b2d2bca6d698bb30c20f4e5894ec8d9042f1dbae5c41e997334/b22a36379c7c0b1e987f680e33b2263d94f86e2a75063d698ccf842ce6592840"
  },
  "ins": [
    {
      "utxo_id": "55777ba206bf747724a4e96586f2d912a77baa8a15a4c63a0b510531ad5fa65e:0",
      "charms": {
        "$01": 420000
      }
    }
  ],
  "outs": [
    {
      "address": "tb1pyrznm3ma6cl83qljqhw8z2usyjcxtkx9tkrqfuhjgrpsuarxcn8s0ut5qs",
      "charms": {
        "$01": 420
      }
    },
    {
      "address": "tb1phmk7c9mzaepumgeaz9lgly9qurkq6jxd44qssfd3w5563j49mfwqfrqvww",
      "charms": {
        "$01": 419580
      }
    }
  ]
}
```

**Note:** The content of a token charm is simply the amount of the token in the charm. The asset type of the token is fully defined by the app the charm refers to by its key. For example, `t/1dc78849dc544b2d2bca6d698bb30c20f4e5894ec8d9042f1dbae5c41e997334/b22a36379c7c0b1e987f680e33b2263d94f86e2a75063d698ccf842ce6592840` in the above example is the token app specification. The amount of the token in the token charm is `420` in the first output and `419580` in the second output.

## UI Considerations

When implementing token transfers in your wallet UI:

- Allow users to specify the amount to transfer
- Clearly display the transfer amount(s) and the remaining amount(s)
- Show the destination address in a user-friendly format
- Provide transaction fee information
- Include confirmation steps before proceeding
- Display transaction status updates during the process
