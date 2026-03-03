---
title: Spell JSON Reference
sidebar:
  order: 1
---

_Spell_ is the metadata added to a Bitcoin transaction to make it also a Charms transaction: spells create charms. This reference provides an explanation of each parameter in the Spell JSON format.

## Structure Overview

The Spell JSON has the following top-level fields:

1. **`version`**: Protocol version identifier
2. **`tx`**: Normalized transaction payload (`ins`, `refs`, `outs`, optional `beamed_outs`, optional `coins`)
3. **`app_public_inputs`**: App definitions and public input data
4. **`mock`**: Optional boolean used for mock proving

## Parameter Details

### `version`

Protocol version number.

```json
"version": 11
```

**Required Value**: Must be `11` for Charms CLI `v11.0.1`.

Spells exist on-chain with lower versions, and they are recognized by the client, but are not supported by the prover.

### `tx`

Normalized transaction payload.

```json
"tx": {
  "ins": [
    "<txid_1>:<vout_1>",
    "<txid_2>:<vout_2>"
  ],
  "refs": [
    "<ref_txid>:<ref_vout>"
  ],
  "outs": [
    {
      "0": {
        "ticker": "TOAD",
        "remaining": 30160
      },
      "1": 42
    },
    {
      "2": 69420
    }
  ],
  "beamed_outs": {
    "1": "009fb48961bca8ec68f01ec882f7ec0dc7dc5cc6bcf4ad154f129ea2338f6cd1"
  },
  "coins": [
    {
      "amount": 1000,
      "dest": "2f7e10b8f6e2089b5bb5dcce96e8dd49ca01012f6506af0fe7bf5d2f2f5db531"
    }
  ]
}
```

- **`ins`**: Input UTXOs spent by the transaction (`txid:vout`). Optional in serialized spells.
- **`refs`**: Optional reference UTXOs.
- **`outs`**: Output charms. Each output is a map of **app index** to charm data.
- **`beamed_outs`**: Optional map of output index to destination UTXO hash for beaming.
- **`coins`**: Optional native coin outputs (`amount` and hex-encoded `dest`).

Use `charms util dest` to derive output `dest` from an address when constructing `coins` entries.

### `app_public_inputs`

Maps each app in the spell to that app's public input data.

```json
"app_public_inputs": {
  "n/<app_id>/<app_vk>": {
    "ticker": "TOAD",
    "remaining": 30580
  },
  "t/<app_id>/<app_vk>": null,
  "c/0000000000000000000000000000000000000000000000000000000000000000/<app_vk>": {
    "param": "value"
  }
}
```

- App keys are in `tag/identity/vk` format:
  - `n/...` for NFT apps
  - `t/...` for fungible token apps
  - `c/...` for contract apps
- Public input values can be `null` for simple transfers.

App indexes used in `tx.outs` (`0`, `1`, `2`, ...) refer to this map in sorted key order.

### `mock`

```json
"mock": false
```

Optional. Use `true` only for mock-mode workflows.

## About Private Inputs

Private app inputs are **not part of Spell JSON** in v11.0.1. Pass them separately to proving/checking interfaces:

```sh
charms spell prove --private-inputs=./private-inputs.yaml ...
```

- For API requests, use `app_private_inputs` in the prover payload.

## Implementation Tips

- Keep `version` at `11`.
- Ensure all app indexes in `tx.outs` are valid indexes into `app_public_inputs`.
- Include all prerequisite transactions in `prev_txs` when checking/proving.
- Validate spell shape with `charms spell check` before proving.
