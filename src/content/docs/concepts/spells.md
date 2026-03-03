---
title: Spells
description: "What are spells and how do they work?"
sidebar:
  order: 2
---

Spells are the magic that creates *charms*.

The idea is to add *charms*-related metadata (*spells*) to Bitcoin transactions (similar to Runes' *runestones*).

*Spells* are **client-side validated**, meaning that **the users** choose to interpret or ignore them. If they choose to interpret them, they can use `charms` — similar to Ordinals and Runes interpreted by `ord`.

A *spell* is said to be *correct* if and only if all of these are true:
- it is successfully parsed and interpreted
- makes sense for the transaction (e.g., doesn't produce more Charms outputs than there are Bitcoin outputs)
- has a valid proof

*Correct spells* can mint, burn and transfer tokens. The practical effect of a *spell* is that tokens are considered parts of the enhanced transaction outputs.

*Incorrect spells* are ignored.

Double-spending is prevented by Bitcoin.

![](../../../assets/images/one-does-not.jpg)

## What Spells Look Like

*Spells* create and transform _charms_ via Bitcoin transactions.

A spell is stored in an `OP_RETURN` output of the transaction:

```
OP_RETURN
  OP_PUSH "spell"
  OP_PUSH $spell_and_proof
```
where:
- `OP_PUSH "spell"` is a marker identifying the output as a Charms spell.
- `OP_PUSH $spell_and_proof` — CBOR-encoded `(NormalizedSpell, Proof)` tuple (see [v11.0.1 source](https://github.com/CharmsDev/charms/blob/v11.0.1/charms-client/src/lib.rs)). The proof is a Groth16 proof attesting to the correctness of the spell.


## Logical Structure of a Spell

Here is an example of a spell that sends an NFT and some fungible tokens, and also mints some tokens:

```yaml
version: 11
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

In this example we have:

- `app_public_inputs` — a map of all apps involved in the spell. App is a tuple of `tag/identity/VK` where:
  - `tag` is a single character representing the app type (`n` for NFTs, `t` for fungible tokens).
    `tag` can be anything, but `n` and `t` have special meaning (simple transfers of NFTs and tokens don't need app contract proofs, so the recursive spell proof can be generated faster).
  - `identity` is a 32-byte array identifying the asset within this app.
  - `VK` is the verification key hash of the app [implementing the logic](/concepts/apps) of the asset: how it can be minted or burned, staked or used.
  - each app value is that app's public input data (may be empty for simple transfers).

- `tx.ins` — a list of input UTXOs (`txid:vout`) to be spent by the transaction.

- `tx.outs` — a list of outputs (strings of charms) created by this spell. In each output, keys are app indexes (`0`, `1`, `2`, ...) pointing to apps in `app_public_inputs`, and values are charm data for those apps.

- `tx.coins` — native coin outputs (Bitcoin sats or Cardano lovelace) for the resulting transaction outputs.

