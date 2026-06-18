---
title: Prover API
description: "The POST /spells/prove HTTP endpoint: request and response."
sidebar:
  order: 4
---

The Prover API turns a spell into a proven, ready-to-broadcast transaction. It
runs the app contracts, generates the [proof](/concepts/spells#the-proof), and
builds the chain transaction(s). Use the hosted service or
[run your own](/how-to/run-a-prover-server).

## Endpoints

| Method | Path | Description |
| --- | --- | --- |
| `POST` | `/spells/prove` | Prove a spell; returns the spell transaction(s). |
| `GET` | `/ready` | Readiness check; returns `OK`. |

### Base URL

The `charms` CLI calls the hosted service by default:

```
https://v15.charms.dev/spells/prove
```

Override it with the `CHARMS_PROVE_API_URL` environment variable. A self-hosted
server listens on port `17784` by default
(`http://localhost:17784/spells/prove`). See
[Call the Prover API](/how-to/call-the-prover-api) and
[Run a prover server](/how-to/run-a-prover-server).

### Content types

The request and response bodies may be **JSON** or **CBOR**. The server picks
CBOR when the request `Content-Type` contains `application/cbor`, and JSON
otherwise; the response uses the same format. The maximum request body is
32 MiB. (The `charms` CLI sends CBOR; the examples below use JSON for
readability.)

## Request

`POST /spells/prove` with a [`ProveRequest`](https://github.com/CharmsDev/charms/blob/main/charms-client/src/request.rs)
body:

| Field | Type | Description                                                                                                                                                                                                                                                                                                                    |
| --- | --- |--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `spell` | object or string | **Required.** The spell ([Spell structure](/reference/spell), a `NormalizedSpell`). In JSON, the spell object's hex-encoded CBOR.                                                                                                                                                                                         |
| `app_private_inputs` | map | (Optional) App key `tag/identity_hex/vk_hex` → private input as hex-encoded CBOR. Omit when empty.                                                                                                                                                                                                                             |
| `tx_ins_beamed_source_utxos` | map | (Optional) Input index → `["txid:vout"]` or `["txid:vout", nonce]` for [beamed](/concepts/beaming) inputs (`nonce` is an optional `u64`). Omit when empty.                                                                                                                                                                     |
| `binaries` | map | (Optional) App `vk` (64-char hex) → app `.wasm` bytes (base64 in JSON). Omit when empty.                                                                                                                                                                                                                                       |
| `app_signatures` | map | (Optional) App `vk` (64-char hex) → `{ "public_key": "<64-char hex>", "signature": "<128-char hex>" }` for [versioned apps](/concepts/apps#immutable-and-versioned-apps). Omit when empty.                                                                                                                                     |
| `prev_txs` | array | (Optional) Prerequisite transactions. Each entry is chain-tagged: `{"bitcoin":"<hex>"}` or `{"cardano":"<hex>"}`; for [beamed](/concepts/beaming) sources, use finality-proof forms — `{"bitcoin":{"tx":"<hex>","proof":"<hex>","headers":["<hex>",…]}}` or `{"cardano":{"tx":"<hex>","signature":"<hex>"}}`. Omit when empty. |
| `change_address` | string | **Required.** Change address for the target chain.                                                                                                                                                                                                                                                                             |
| `fee_rate` | number | (Optional) Bitcoin fee rate in sats/vB. Defaults to `0.0` if omitted (the CLI defaults to `2.0`). Ignored for Cardano.                                                                                                                                                                                                         |
| `chain` | string | **Required.** `bitcoin` or `cardano`.                                                                                                                                                                                                                                                                                          |
| `collateral_utxo` | string | (Optional) Collateral UTXO as `txid:vout`. **Required for Cardano.**                                                                                                                                                                                                                                                           |

### Example

```javascript
const requestBody = {
  spell: {
    version: 15,
    tx: {
      ins: ["eb711823b50d368c5e0121649e414d78086cad69817b5163e871f7039ac0a4a3:0"],
      outs: [{ "0": { ticker: "CHARMIX", name: "Panoramix #1" } }],
      coins: [{ amount: 1000, dest: "5120…" }]
    },
    app_public_inputs: {
      "n/af50d82d…/a0029d4e…": null
    }
  },
  prev_txs: [{ bitcoin: "020000000001…" }],
  change_address: "tb1putrfz7kq9yh3jymjcumq9heu9s4q7nmm8x7k55462n9rua408y9svaw3uv",
  fee_rate: 2.0,
  chain: "bitcoin"
};
```

## Response

A JSON (or CBOR) array of chain-tagged transactions. For a Bitcoin spell this is
a **single** unsigned transaction with the spell and proof in its `OP_RETURN`
output:

```json
[
  { "bitcoin": "<hex_encoded_spell_tx>" }
]
```

Cardano entries are tagged `{ "cardano": "<hex>" }`. The transaction is **not
signed** — sign it (e.g. with `bitcoin-cli signrawtransactionwithwallet`) and
broadcast it. See
[Sign and broadcast](/how-to/wallet-integration/sign-and-broadcast).

## Errors

| Status | Meaning |
| --- | --- |
| `400` | Invalid spell, missing/invalid parameters, malformed body. |
| `500` | Transient prover failure — retry with backoff. |

## Notes

- Proving runs the app contracts, so include every app's binary in `binaries`
  (or `--app-bins`) for any operation beyond a simple transfer.
- For [Scroll](/concepts/scrolls) outputs on Bitcoin, the prover fills the
  `dest` script automatically by calling the Scrolls canister — only a prover
  *server* (not mock mode) can do this.
- The `spell.tx.ins` and `spell.tx.coins` you send are used to build the
  transaction; in the *serialized* on-chain spell they are stripped and
  recovered from the transaction itself.
