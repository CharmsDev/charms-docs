---
title: Transfer NFTs
description: "Build a spell that sends an NFT charm to a new UTXO."
---

Transferring an NFT sends the entire charm, unchanged, to a new output. This is a
[simple transfer](/concepts/apps#simple-transfers-need-no-contract), so it
needs no app binary or contract proof — just asset preservation.

## The spell

```json
{
  "version": 15,
  "tx": {
    "ins": ["<source_txid>:<vout>"],
    "outs": [{ "0": { "ticker": "CHARMIX", "name": "Panoramix #1" } }],
    "coins": [{ "amount": 1000, "dest": "<destination_hex>" }]
  },
  "app_public_inputs": { "n/<app_id>/<app_vk>": null }
}
```

| Field | Meaning |
| --- | --- |
| `version` | `15`. |
| `app_public_inputs` | The NFT app(s) involved; `null` for a simple transfer. |
| `tx.ins` | Source UTXO(s) (`txid:vout`). |
| `tx.outs` | Destination charms, keyed by app index (`"0"`, `"1"`, …). |
| `tx.coins` | Native outputs (`amount`, hex `dest` from [`charms util dest`](/reference/cli#charms-util-dest)). |

The NFT content fields (`ticker`, `name`, `description`, `image`, `image_hash`,
`url`, …) follow
[CHIP-0420](https://github.com/CharmsDev/charms/tree/main/CHIPs/CHIP-0420). To
send multiple NFTs, add their apps to `app_public_inputs`, their inputs to
`tx.ins`, and the NFTs to `tx.outs`.

:::note
If the transaction does more than a simple transfer (mints a new NFT, or involves
charms that are neither tokens nor NFTs), the relevant app contracts must run —
pass the app binaries when proving.
:::

## Steps

1. **Read** the NFT's content from the source UTXO
   ([Display charms](/how-to/wallet-integration/display-charms)).
2. **Build** the spell `tx` and `app_public_inputs`
   ([Spell structure](/reference/spell)).
3. **Derive** `coins[].dest` from the destination address with
   `charms util dest --addr <address>`.
4. **Prove** by [calling the Prover API](/how-to/call-the-prover-api).
5. **[Sign and broadcast](/how-to/wallet-integration/sign-and-broadcast)** the
   returned transaction.
