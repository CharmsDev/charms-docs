---
title: Why Charms?
description: "Why should you use Charms to build your next Bitcoin app?"
sidebar:
  order: 1
---

Charms is a **token standard** for Bitcoin, designed to be **developer-friendly** and **programmable**.

But there are already a few token standards out there, even **on Bitcoin**, why create another one?

In short, because none of them are **programmable**, or particularly developer friendly. And we are fixing this.

We believe in the magic of programmability. We also believe in decentralization and security of Bitcoin. A (perhaps) under-appreciated aspect of Bitcoin's security is its UTXO model. It's widely believed that the UTXO model is "hard" to make programmable. But not impossible 😼

Let us introduce: **developer-friendly**, **programmable tokens**, implemented directly **on Bitcoin**.

Because this is a kind of magic, we call Bitcoin outputs (UTXOs) with such tokens *charms*.

## What are Charms

Programmability is needed to do **one thing**: create *apps*. Apps are:
- tokens
- NFT collections
- DEXes
- Auctions
- ... you (create and) name it!

App state needs to be stored somehow, and that's what *charms* are for.

A single *charm* can contain multiple of tokens, NFTs, arbitrary app state. Structurally, it is a mapping of `app -> data`.

Tokens and NFTs are treated as special cases of *apps*:
- a token data (within a *charm*) is its amount (a natural number),
- NFTs can have arbitrary data, which is useful for use cases like controlling token supply (if a token is controlled by an NFT).

Combining tokens, NFTs and arbitrary *apps* in a *charm* allows for **composability**:
- an NFT can control the supply of a token,
- a limit order to trade one token for another,
- ... limitless other things.

A *charm* gets created or spent (or burnt) as one unit, just like a Bitcoin UTXO. A *charm* can **only** exist on top of a Bitcoin UTXO (such outputs are said to be *enchanted* or *charmed*). Because of this, whoever owns the Bitcoin UTXO, can do whatever they want with the *charm* (just as well as with BTC in the UTXO).

Essentially, *charms* are app-level UTXOs that enhance (*enchant*) Bitcoin UTXOs.

## How are Charms Created

*Charms* come into existence by the magic of *[spells](/concepts/spells)* added to Bitcoin transactions.


## Difference from Runes

[Runes](https://docs.ordinals.com/runes.html) and Ordinals are an inspiration for Charms (among other things).

Runes are tokens on top of Bitcoin, managed by *runestones* — metadata messages (in Bitcoin transactions' `OP_RETURN` outputs), directing minting and transferring of *runes* (the Runes tokens). Runestones can be viewed as a kind of [[1. Spells|spells]].

Runes seem to lean towards [digital artifacts](https://docs.ordinals.com/digital-artifacts.html), collectibles (with concepts like rarity of a name).

Charms aim to address programmability and composability: you can have multiple apps interacting with each other. Charms could (perhaps in a not too distant future) even work with Runes. 
