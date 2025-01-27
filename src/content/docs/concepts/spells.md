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
- the enhanced (enchanted) transaction is valid (can be included in a block as such)
- it is successfully parsed and interpreted
- makes sense for the transaction (e.g., doesn't produce more charms than there are outputs)
- carries a valid proof

*Correct spells* can mint, burn and transfer tokens. The practical effect of a *spell* is that tokens are considered parts of the enhanced transaction outputs.

*Incorrect spells* have are ignored.

Double-spending is prevented by Bitcoin.

![](../../../assets/images/one-does-not.jpg)

## What spells look like

*Spells* create and transform _charms_ via Bitcoin transactions.

A spell is included in a transaction witness spending a [Taproot](https://lightning.engineering/posts/2023-04-19-taproot-musig2-recap/) output. It is included in an *envelope* — a sequence of opcodes `OP_FALSE` `OP_IF` ... (push data) ... `OP_ENDIF`, which is effectively a no-op: since the condition is `false`, no data is pushed onto the stack.

```
OP_FALSE
OP_IF
  OP_PUSH "spell"
  OP_PUSH $spell_data
  OP_PUSH $proof_data
OP_ENDIF
```
where: 
- `OP_PUSH "spell"` shows that the envelope contains a *spell*.
- `OP_PUSH $spell_data` — CBOR-encoded [`NormalizedSpell`](https://docs.rs/charms/0.3.0/charms/spell/struct.NormalizedSpell.html).
- `OP_PUSH $proof_data` — Groth16 proof attesting to verification of correctness of the spell.


## Logical Structure of a Spell

Here is an example of a spell that sends an NFT and some fungible tokens, and also mints some tokens:

```yaml
version: 1

apps:
  $0000: n/f54f6d40bd4ba808b188963ae5d72769ad5212dd1d29517ecc4063dd9f033faa/7df792057addc74f1a6ca23da5b8b82475a7c31c3a4d45266c16a604c62eba4c
  $0001: t/7e7e5623a8b44556021171f533a3404b009e7c66edd5a47362c8e54c54a6e058/b25ddd68cd441a2bb0f7113abaaef74983c4e01fc66c7465e1f18363fc80454d
  $0002: t/f54f6d40bd4ba808b188963ae5d72769ad5212dd1d29517ecc4063dd9f033faa/7df792057addc74f1a6ca23da5b8b82475a7c31c3a4d45266c16a604c62eba4c

ins:
  - utxo_id: 33027a870a0f8c7b3d3114d970b6e67d11b32316ad5b6c58bdc7e0d8e77f7e6a:1
    charms:
      $0001: 42
      $0002: 69000

  - utxo_id:  92077a14998b31367efeec5203a00f1080facdb270cbf055f09b66ae0a273c7d:0
    charms:
      $0000: 
        ticker: TOAD
        remaining: 30580

outs:
  - address: tb1p2lgmc56q8vu4run2p8u3a4mzp8h7e7qgu0243rlgchzqqe8zt0as2vld7e
    charms:
      $0000:
        ticker: TOAD
        remaining: 30160
      $0001: 42

  - address: tb1pxpjgtv30gl0nvce5ujzqgc0802gy9vtta4ens9mzpucymlg5fgfsprzrlc
    charms:
      $0002: 69420
```

In this example we have:

- `apps` — a list of apps involved in the spell. The app is a tuple of `tag/identity/VK` (see [`App`](https://docs.rs/charms-data/0.3.0/charms_data/struct.App.html)) where:
  - `tag` is a single character representing the app type (`n` for NFTs, `t` for fungible tokens).
    `tag` can be anything, but `n` and `t` have special meaning (simple transfers of NFTs and tokens don't need app contract proofs, so the recursive spell proof can be generated faster).
  - `identity` is a 32-byte array identifying the asset within this app.
  - `VK` is the verification key hash of the app [implementing the logic](/concepts/apps) of the asset: how it can be minted or burned, staked or used.

- `ins` — a list of input UTXOs to be spent by the transaction. 

- `outs` — a list of outputs (strings of charms) created by this spell.

