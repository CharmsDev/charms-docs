---
title: Spell structure
description: "The spell as you author it, as it is serialized on-chain, and how it rides inside Bitcoin and Cardano transactions."
sidebar:
  order: 2
---

A **spell** is the metadata added to a blockchain transaction to make it also a
Charms transaction: spells create and transform charms. This page is the
authoritative reference for the spell's three faces:

1. the **logical** spell you author (YAML/JSON);
2. the **serialized** spell that lives on-chain (CBOR + proof);
3. the **on-chain transaction structure** that carries it, on Bitcoin and on
   Cardano.

For the concepts behind it, see [Spells](/concepts/spells) and
[Transactions](/concepts/transactions).

## Logical structure

You author a spell as YAML (or JSON). It deserializes directly into the
`NormalizedSpell` structure, using ergonomic human-readable forms (apps as
`tag/identity/vk` strings, UTXOs as `txid:vout`, byte arrays as hex).

```yaml
version: 15
tx:
  ins:
    - 33027a870a0f8c7b3d3114d970b6e67d11b32316ad5b6c58bdc7e0d8e77f7e6a:1
  refs:
    - 92077a14998b31367efeec5203a00f1080facdb270cbf055f09b66ae0a273c7d:0
  outs:
    - 0:
        ticker: TOAD
        remaining: 30160
      1: 42
    - 2: 69420
  beamed_outs:
    1: 009fb48961bca8ec68f01ec882f7ec0dc7dc5cc6bcf4ad154f129ea2338f6cd1
  coins:
    - amount: 1000
      dest: 51207c4bb238ab772a2000906f3958ca5f15d3a80d563f17eb4123c5b7c135b128dc
  scrolls: [0]
app_public_inputs:
  n/f54f6d40…/7df79205…:
  t/7e7e5623…/b25ddd68…:
```

### Top-level fields

| Field | Type | Description |
| --- | --- | --- |
| `version` | integer | Protocol version. Use `15` for the current prover. |
| `tx` | object | The normalized transaction payload (below). |
| `app_public_inputs` | map | All apps in the spell → each app's public input (`x`). |
| `versioned_apps` | map | (Optional) `vk -> { version, wasm_hash }` for [versioned apps](/concepts/apps#immutable-and-versioned-apps). Omit when empty. |
| `mock` | bool | (Optional) `true` only for mock-proving workflows. Omit otherwise. |

:::note
Spells with lower versions exist on-chain and are recognized by clients for
backward compatibility, but only the current `version` is accepted by the
prover.
:::

### `tx`

| Field | Type | Description |
| --- | --- | --- |
| `ins` | list | Input UTXOs spent (`txid:vout`). Omitted in the serialized form (recovered from the hosting transaction). |
| `refs` | list | (Optional) reference UTXOs — read, not spent. |
| `outs` | list | Output *strings of charms*. Each entry maps an **app index** (`0`, `1`, …) to that app's charm data. |
| `beamed_outs` | map | (Optional) output index → `SHA-256` hash of the destination UTXO id, for [beaming](/concepts/beaming) out. |
| `coins` | list | Native coin outputs (below). One per transaction output. |
| `scrolls` | list | (Optional) output indexes that carry [Scroll](/concepts/scrolls) charms and must be sent to Scrolls-controlled addresses. |

**App indexes.** In `outs` (and `scrolls`, `beamed_outs`), outputs reference apps
by their **index** into `app_public_inputs`, taken in sorted key order: `0` is
the first app, `1` the second, and so on.

**`coins` entries:**

| Field | Type | Description |
| --- | --- | --- |
| `amount` | integer | Native amount (sats on Bitcoin, lovelace on Cardano). |
| `dest` | hex | Destination: a Bitcoin `scriptPubKey` or Cardano address bytes. Derive it with [`charms util dest`](/reference/cli#charms-util-dest). |
| `content` | object | (Optional, Cardano) extra output content — `multiasset`, `datum`, `script_ref`. |

### `app_public_inputs`

Maps each app in the spell to its public input data (`x`):

```yaml
app_public_inputs:
  n/<identity>/<vk>:        # NFT app — null value (no public input)
  t/<identity>/<vk>:        # fungible-token app
  c/0000…0000/<vk>:         # a general "contract" app with public input:
    param: value
  s/<identity>/<vk>:        # Scroll app
```

App keys are `tag/identity/vk`:

- `n/…` — NFT app
- `t/…` — fungible-token app
- `s/…` — [Scroll](/concepts/scrolls) app
- any other tag (e.g. `c/…`) — a general app whose logic is fully defined by its
  contract

Values may be empty (`null`) for simple transfers.

### Private inputs are *not* part of the spell

An app's **private input** (`w`, the witness) is never published, so it is not in
the spell. Pass it separately:

```sh
charms spell prove --private-inputs ./private-inputs.yaml …
```

```yaml
# private-inputs.yaml — app -> private input data
n/<identity>/<vk>: "<some witness value>"
```

In a [Prover API](/reference/prover-api) request, private inputs go in the
`app_private_inputs` field.

## Serialized (on-chain) form

On-chain, a spell is stored together with its proof as a single CBOR-encoded
pair:

```
cbor( (NormalizedSpell, Proof) )
```

- **`NormalizedSpell`** is the structure above, with two fields stripped because
  they can be recovered from the hosting transaction: `tx.ins` and `tx.coins`
  are both cleared (set to absent). On extraction, the input list is taken from
  the hosting transaction's inputs.
- **`Proof`** is a byte string: the **Groth16** SNARK (BN254) attesting that the
  spell is [correct](/concepts/spells#what-makes-a-spell-correct). It is
  produced by an [SP1](https://docs.succinct.xyz/) zkVM pipeline — a
  `charms-spell-checker` proof wrapped into Groth16 — and is recursive, so it
  also covers every prerequisite transaction's spell.

The values committed by the proof are the CBOR of `(spell_vk, NormalizedSpell)`,
where `spell_vk` is the 32-byte spell verification key
(`00425796f4c4fa050043eee14d801b4f935244e44aad6a28de0cd5cb3de0ae52` for v15; see
[`charms spell vk`](/reference/cli#charms-spell-vk)).

## On-chain transaction structure

### On Bitcoin

A Bitcoin spell is a **single transaction** that carries the serialized
`(spell, proof)` pair in an `OP_RETURN` output:

```
OP_RETURN
  OP_PUSH "spell"                 # the marker b"spell"
  OP_PUSH <cbor(spell, proof)>
```

That transaction:

- spends the spell's input UTXOs;
- creates one output per `tx.coins` entry (value `amount`, script `dest`),
  carrying the resulting charms;
- includes the `OP_RETURN` spell output (value `0`);
- optionally adds a Charms protocol fee output;
- sends the remainder to the `--change-address`.

There is **no commit/reveal**: everything is in one transaction. The
[Prover API](/reference/prover-api) returns it as an unsigned hex transaction in
a one-element array `[{"bitcoin":"<hex>"}]`; you sign and broadcast it yourself.

### On Cardano

A Cardano spell is also a single transaction, but the spell is attached
differently:

- **Spell location.** The `(spell, proof)` pair is wrapped as a Plutus
  `BoundedBytes` value and attached as the **inline datum** of a dedicated
  small-ADA output (sent to the Charms fee address).
- **Charms as native assets.** Token and NFT charms are Cardano **native
  assets**, minted/burned by per-app PlutusV3 minting policies parameterized by
  the app `vk`. Non-token apps are spent from a shared proxy script address.
- **Collateral.** Because the transaction runs Plutus scripts, a **collateral
  UTXO** is required — pass it as `charms spell prove --collateral-utxo
  <txid:vout>`.
- **Co-signing.** Cardano spell transactions are signed by the Cardano
  [Scrolls](/concepts/scrolls) canister as part of proving.

The Prover API returns Cardano transactions tagged `{"cardano":"<hex>"}` (a
Ledger CDDL envelope).

## Beamed inputs

When a spell *receives* a [beamed](/concepts/beaming) charm, the source UTXO
on the other chain is supplied out of band (it is not a field of the spell
itself):

- CLI: `charms spell prove --beamed-from '{<input_index>: [<source_utxo>, <nonce>]}'`
- Prover API: the `tx_ins_beamed_source_utxos` field.

The corresponding source transaction — carrying its finality proof — is passed
in `--prev-txs` (CLI) / `prev_txs` (API). See
[Beam charms across chains](/how-to/beam-charms).
