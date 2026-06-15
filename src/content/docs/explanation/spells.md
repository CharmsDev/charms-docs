---
title: Spells
description: "What spells are and what makes them correct."
sidebar:
  order: 3
---

Every Charms transaction carries a **spell**: Charms-related metadata added to a
blockchain transaction (similar to Runes' *runestones*). A spell, together with
its proof, is what creates and transforms charms.

## Client-side validation

Spells are **client-side validated**. The base chain (Bitcoin or Cardano) knows
nothing about charms — it only sees an ordinary transaction. It is **the users**
who choose to interpret the spell or ignore it. To interpret spells, you run a
Charms client (the `charms` CLI, the prover API, or the `charms-client`
library), much as Ordinals and Runes are interpreted by `ord`.

This is why charms can exist on Bitcoin without any consensus change: the heavy
lifting — validating that a spell is allowed — is done off-chain by a
zero-knowledge proof that anyone can verify, while Bitcoin does what it does best
and prevents double-spending.

## What makes a spell *correct*

A *spell* is **correct** if and only if all of these hold:

- it parses and is successfully interpreted;
- it makes sense for the transaction (for example, it doesn't produce more charm
  outputs than the transaction has outputs);
- every app contract it invokes is satisfied;
- every prerequisite transaction (the ones producing the inputs it spends) also
  carries a correct spell;
- it has a **valid proof** attesting to all of the above.

*Correct spells* can mint, burn, and transfer charms. The practical effect of a
correct spell is that charms are considered part of the enhanced transaction's
outputs.

*Incorrect spells are ignored.* If a transaction spends charmed UTXOs but its
spell is incorrect (or absent), the charms in those inputs are simply **burned**
— the underlying Bitcoin transaction is still perfectly valid.

Double-spending is prevented by the base chain.

![One does not simply make programmable tokens on Bitcoin](../../../assets/images/one-does-not.jpg)

## What a spell looks like

You author a spell as YAML (or JSON). Here is one that sends an NFT and some
fungible tokens, and also mints some tokens:

```yaml
version: 15
tx:
  ins:
    - 33027a870a0f8c7b3d3114d970b6e67d11b32316ad5b6c58bdc7e0d8e77f7e6a:1
    - 92077a14998b31367efeec5203a00f1080facdb270cbf055f09b66ae0a273c7d:0
  outs:
    - 0:
        ticker: TOAD
        remaining: 30160
      1: 42
    - 2: 69420
  coins:
    - amount: 1000
      dest: 2f7e10b8f6e2089b5bb5dcce96e8dd49ca01012f6506af0fe7bf5d2f2f5db531
    - amount: 1000
      dest: 009fb48961bca8ec68f01ec882f7ec0dc7dc5cc6bcf4ad154f129ea2338f6cd1
app_public_inputs:
  n/f54f6d40bd4ba808b188963ae5d72769ad5212dd1d29517ecc4063dd9f033faa/7df792057addc74f1a6ca23da5b8b82475a7c31c3a4d45266c16a604c62eba4c:
  t/7e7e5623a8b44556021171f533a3404b009e7c66edd5a47362c8e54c54a6e058/b25ddd68cd441a2bb0f7113abaaef74983c4e01fc66c7465e1f18363fc80454d:
  t/f54f6d40bd4ba808b188963ae5d72769ad5212dd1d29517ecc4063dd9f033faa/7df792057addc74f1a6ca23da5b8b82475a7c31c3a4d45266c16a604c62eba4c:
```

In this example:

- **`app_public_inputs`** is the map of all apps involved in the spell. Each key
  is an app `tag/identity/vk` (see [Apps](/explanation/apps)), and each value is
  that app's public input data (empty here, as it is for simple transfers).
- **`tx.ins`** lists the input UTXOs (`txid:vout`) the transaction spends.
- **`tx.outs`** lists the output *strings of charms*. In each output, the keys
  are **app indexes** (`0`, `1`, `2`, …) that point into `app_public_inputs` in
  sorted-key order, and the values are the charm data for those apps.
- **`tx.coins`** lists the native coin outputs (Bitcoin sats or Cardano
  lovelace) that will carry those charms.

For the complete field reference — including the serialized on-chain form — see
the [Spell structure reference](/reference/spell).

## The proof

The interesting half of a spell is the **proof** that travels with it. Charms
generates it with [SP1](https://docs.succinct.xyz/), a zero-knowledge virtual
machine:

1. A guest program (`charms-spell-checker`) runs the full correctness check
   above — including executing every app contract — inside the zkVM, producing a
   recursive STARK proof.
2. A second guest program wraps that proof into a small **Groth16** SNARK over
   the BN254 curve.

The resulting Groth16 proof (~260 bytes plus a short header) is what gets
embedded in the on-chain transaction. Because the proof is *recursive*, it also
absorbs the proofs of all prerequisite transactions, so verifying a single spell
transitively establishes the correctness of the entire history behind it. And
because verification is cheap and deterministic, any client can confirm a spell
is correct in milliseconds — without re-running any app code.

This proof is produced by the [Prover API](/reference/prover-api). For *how* the
proof and spell are attached to a real transaction, see
[Transactions](/explanation/transactions).
