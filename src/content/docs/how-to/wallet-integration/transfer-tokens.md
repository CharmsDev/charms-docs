---
title: Transfer tokens
description: "Build a spell that sends fungible-token charms."
---

A token transfer spends one or more outputs holding a token and creates
destination outputs whose total token amount equals the input total. Like NFT
transfers, this is a
[simple transfer](/explanation/apps#simple-transfers-need-no-contract) — no app
binary or contract proof required.

## The spell

```json
{
  "version": 15,
  "tx": {
    "ins": ["<source_txid>:<vout>"],
    "outs": [{ "0": 420 }, { "0": 419580 }],
    "coins": [
      { "amount": 1000, "dest": "<destination_hex_1>" },
      { "amount": 1000, "dest": "<destination_hex_2>" }
    ]
  },
  "app_public_inputs": { "t/<app_id>/<app_vk>": null }
}
```

Here the token (app index `"0"`) is split into `420` (sent) and `419580`
(change). The total out must equal the total in. Each `tx.outs` entry pairs with
the `tx.coins` entry at the same position (the native output that will carry the
charm).

| Field | Meaning |
| --- | --- |
| `version` | `15`. |
| `app_public_inputs` | The token app(s); `null` for a simple transfer. |
| `tx.ins` | Source UTXO(s). |
| `tx.outs` | Per output, the app index → token amount. |
| `tx.coins` | Native outputs (`amount`, hex `dest` from [`charms util dest`](/reference/cli#charms-util-dest)). |

:::note
Minting or burning tokens is **not** a simple transfer: it must satisfy the
token app's contract, so pass the app binary when proving.
:::

## Steps

1. **Collect** source UTXOs and their token amounts
   ([Display charms](/how-to/wallet-integration/display-charms)).
2. **Compute** the transfer and change amounts (they must sum to the input
   total).
3. **Build** the spell `tx` and `app_public_inputs`.
4. **Derive** each `coins[].dest` with `charms util dest --addr <address>`.
5. **Prove** by [calling the Prover API](/how-to/call-the-prover-api), then
   **[sign and broadcast](/how-to/wallet-integration/sign-and-broadcast)**.
