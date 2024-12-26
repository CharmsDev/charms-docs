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

:::caution
If a transaction doesn't have a correct *spell* and spends UTXOs with *charms*, these *charms* are destroyed!
:::

Double-spending is prevented by using Bitcoin UTXOs: one cannot simply double-spend a Bitcoin UTXO.

## How spells look like

*Spells* create and transform _charms_ via Bitcoin transactions.

A spell is included in a transaction witness spending a [Taproot](https://lightning.engineering/posts/2023-04-19-taproot-musig2-recap/) output. It is included in an *envelope* — a sequence of opcodes `OP_FALSE` `OP_IF` ... `OP_ENDIF` (effectively a no-op: it doesn't affect the semantics of the witness) — inserted at the beginning of the witness. The actual data is put within `OP_IF` ... `OP_ENDIF` brackets.

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
- `OP_PUSH $spell_data` binary data encoding the spell.
- `OP_PUSH $proof_data` binary data encoding the proof of the spell.


## Structure of a spell

Here is an example (of a logical structure) of a spell that sends an NFT and a token to some recipients (taken care of by the underlying Bitcoin transaction):

```yaml
version: 0

apps:
  $00: n/312de6129de1a2a3de9dd22bca0bbb351853e7a5b4acb4b48676816055f08bb1:0/8e877d70518a5b28f5221e70bd7ff7692a603f3a26d7076a5253e21c304a354f
  $01: t/312de6129de1a2a3de9dd22bca0bbb351853e7a5b4acb4b48676816055f08bb1:0/8e877d70518a5b28f5221e70bd7ff7692a603f3a26d7076a5253e21c304a354f

ins:
  - utxo_id: db094547cea83ff571e73bb750cc6e8225485c0b65929d723324dd03e4542477:0
    charm:
      $00: 
        ticker: $TOAD
        remaining_supply: 30580
      $01: 69420

outs:
  - charm:
      $00:
        ticker: $TOAD
        remaining_supply: 30580

  - charm: {}

  - charm:
      $01: 69000

  - charm:
      $01: 420
```

In this example we have:
- `apps` — a mapping of app key to app spec. The app key is an identifier of the app within the spell (here we have two: `$00` — an NFT, and `$01` — a token). These keys do not mean anything, but simply identify their apps within the spell. The app spec is very important and is a tuple of `tag/id/VK` where:
  - `tag` is a single character representing the app type (`n` for NFTs, `t` for fungible tokens).
    `tag` can be anything, but `n` and `t` have special semantics (simple transfers of NFTs and tokens don't need app contract proofs, so the recursive spell proof can be generated faster).
  - `id` (in the form of UTXO ID — `txid:vout`) is the unique identity of the app. It takes the form of a UTXO ID because any UTXO is guaranteed to be spent at most once. So it's a great identifier for minting digital assets: the minting transaction spends a UTXO, and then it can never be spent again. Thus, the mint of this asset cannot be repeated.
  - `VK` is the verification key hash of the app [implementing the logic](/concepts/apps) of the asset: how it can be minted or burned, staked or used.
- `ins` — a list of UTXOs that are spent by the transaction. Each UTXO has an optional `charm` field, which is a mapping of app key to some data. For tokens, the data is an unsigned integer, for NFTs and other apps — arbitrary data (defined by the app developer). The `charm` field is optional because for each input we can only spend whatever charm it has (as created by the spell of the transaction that produced the output we're spending).
- `outs` — a list of charms that created by this spell. Each charm is a mapping of app key to some data. Data types are the same as for the `ins` field.

