---
title: Transactions
description: "How spells and their proofs are embedded in Bitcoin and Cardano transactions."
sidebar:
  order: 4
---

A spell never travels alone — it rides inside an ordinary blockchain
transaction, alongside a [proof](/concepts/spells#the-proof) of its
correctness. This page explains, conceptually, how a spell becomes part of a
real transaction on each supported chain. For the byte-level layout, see the
[Spell structure reference](/reference/spell).

## Charms live on UTXOs

Charms inherit the security of the UTXO model. A charm exists only as part of a
transaction *output*; to move or change it, you spend that output in a new
transaction whose spell describes the result. The base chain guarantees each
output is spent at most once, which is exactly what stops charms from being
double-spent. Everything else — what the charms *become* — is decided by the
spell and enforced by its proof.

Two ingredients are always serialized together and attached to the hosting
transaction:

- the **normalized spell** — a compact, canonical form of the spell (the same
  information you authored in YAML, minus what can be recovered from the hosting
  transaction itself, such as the input list);
- the **proof** — the Groth16 SNARK attesting that the spell is correct.

They are encoded as a single CBOR-serialized `(spell, proof)` pair. Where that
pair *goes* is the only thing that differs between chains.

## On Bitcoin

On Bitcoin, a spell is carried by a **single transaction** with the
`(spell, proof)` bytes in an **`OP_RETURN`** output:

```
OP_RETURN
  OP_PUSH "spell"          # marker identifying this as a Charms spell
  OP_PUSH <cbor(spell, proof)>
```

That one transaction does everything at once: it spends the input UTXOs, creates
the coin outputs that will carry the resulting charms, includes the `OP_RETURN`
output with the spell and proof, optionally pays a Charms protocol fee, and sends
the remainder to a change address. There is **no** separate commit/reveal step.

Because the Groth16 proof is small, the whole payload fits comfortably in a
single data push. (Charms transactions use a larger `OP_RETURN` than the
historical 80-byte standardness limit; recent Bitcoin Core releases relay them.)

To read the charms back out, a client scans a transaction for the `OP_RETURN`
spell marker, parses the `(spell, proof)` pair, re-attaches the input list from
the transaction itself, and verifies the proof.

## On Cardano

Cardano is also an (extended) UTXO chain, so the model is the same — but the
mechanics differ in three ways:

1. **Where the spell goes.** Instead of `OP_RETURN`, the `(spell, proof)` bytes
   are wrapped as a Plutus `BoundedBytes` value and attached as the **inline
   datum** of a dedicated small-ADA output. A client reads the spell back from
   that datum and verifies the same Groth16 proof as on Bitcoin.

2. **Charms are native assets.** Token and NFT charms are represented as Cardano
   **native assets**, minted and burned by per-app Plutus minting policies
   parameterized by the app's `vk`. Other (non-token) apps are spent from a
   shared proxy script address.

3. **Collateral is required.** Because the transaction runs Plutus scripts, the
   ledger requires a **collateral UTXO** — a normal ADA input that is forfeited
   only if script validation fails. You supply it when proving a Cardano spell
   (`charms spell prove --collateral-utxo …`). Cardano spell transactions are
   also co-signed by a [Scrolls](/concepts/scrolls) canister.

## Prerequisite (previous) transactions

Verifying a spell requires the transactions that produced its inputs — the
**previous transactions** (`prev_txs`). They let the verifier recover the
charms being spent and confirm that each input's own spell was correct. When you
prove or check a spell, you pass these transactions explicitly. In cross-chain
[beaming](/concepts/beaming), a previous transaction also carries a
*finality proof* showing it is irreversibly confirmed on its origin chain.
