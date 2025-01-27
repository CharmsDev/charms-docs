---
title: Why Charms?
description: "Why should you use Charms to build your next Bitcoin app?"
sidebar:
  order: 1
---

Charms is a **programmable assets** protocol and software for Bitcoin (and soon, cross-chain), designed to be
**developer-friendly**.

But there are already a few token standards out there, even **on Bitcoin**, why create another one?

In short, because none of them are **programmable**, or particularly developer friendly. And we are fixing this.

We believe in the magic of programmability. We also believe in decentralization and security of Bitcoin. An
under-appreciated aspect of Bitcoin's security is its UTXO model. It's widely believed that the UTXO model is "hard" to
make programmable. But, with Charms, not impossible 😼

Let us introduce: **developer-friendly**, **programmable assets**, implemented directly **on Bitcoin**.

Because this is kind of magical, we call such tokens *charms*.

## What are Charms

Put simply, _charms_ are programmable tokens on top of Bitcoin UTXOs.

Programmability is needed to do **one thing**: create *apps*. Apps are:

- tokens
- NFT collections
- DEXes
- Auctions
- ... you (create and) name it!

App state needs to be stored somehow, and that's what *charms* are for.

A single *charm* is a token, NFT, instance of arbitrary app state. Structurally, it is an entry of mapping `app -> data`
living on top of a Bitcoin UTXO. And you can have as many as you want, creating a _string of charms_.

Fungible tokens and NFTs are treated as special cases:

- a fungible token data (within a *charm*) is its amount (a positive integer, e.g. `69420`),
- NFTs carry **arbitrary** data, which is useful for all kinds of use cases (e.g. remaining token supply — if a
  fungible token is managed by an NFT).

Combining tokens, NFTs and arbitrary apps in *strings of charms* allows for **composability**:

- a limit order to trade one token for another,
- artist royalty policies for NFTs
- bridging
- ... limitless other things.

A *string of charms* gets created or spent as one unit, just like a Bitcoin UTXO. *Charms* can **only** exist on top of
UTXOs (such outputs are said to be *charmed*). Because of this, whoever owns a Bitcoin UTXO, can do whatever they want
with the *charms* in it (even destroy them).

## How are Charms Created

*Charms* come into existence by the magic of *[spells](/concepts/spells)* added to Bitcoin transactions.

## Difference from Runes

[Runes](https://docs.ordinals.com/runes.html) and Ordinals are an inspiration for Charms (among other things).

Runes are tokens on top of Bitcoin, managed by *runestones* — metadata messages (in `OP_RETURN`
outputs), directing minting and transferring of *runes* (the Runes tokens). Runestones can be viewed as a kind
of [spells](/concepts/spells).

Runes seem to lean towards [digital artifacts](https://docs.ordinals.com/digital-artifacts.html), collectibles (with
concepts like rarity of a name).

Charms aim to address **programmability** and **composability**: you can have multiple apps interacting with each other.
Charms
could (perhaps in a not too distant future) even work with Runes. 
