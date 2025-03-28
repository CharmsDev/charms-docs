---
title: Introduction
sidebar:
  order: 1
---

This guide introduces the concepts and processes involved in transferring Charms assets on the Bitcoin network. Understanding these fundamentals is essential before implementing specific transfer types.

Charms, as other digital assets can be tranfered from one address to another while preserving their unique properties and provenance. Unlike regular Bitcoin transactions, Charms transfers require a specific protocol to ensure the charm's properties are maintained throughout the transfer process.

## Transfer Types

There are two primary types of Charms transfers:

1. **NFT Transfers**: The entire charm is transferred to a single destination. This is used for non-fungible tokens where the entire asset moves as a single unit.

2. **Token Transfers**: A portion of fungible tokens is transferred to a destination, with remaining tokens returned to a change address. This allows for partial transfers of divisible assets.

## The Two-Transaction Model

Charms transfers use a two-transaction model:

1. **Commit Transaction**: Sets up the transfer by committing to the spell that will be executed, creating an output that will be spent by the spell transaction
2. **Spell Transaction**: Contains the actual charm transfer logic and executes the spell, spending the output created by the commit transaction

## Transfer Process Overview

The complete transfer process involves several key steps:

1. **Prepare the Spell JSON**: Define the charm's properties and transfer details
2. **Call the Prover API**: Generate the required transactions
3. **Sign the Transactions**: Sign both the commit and spell transactions
4. **Broadcast the Transactions**: Send the transactions to the Bitcoin network as a package

## Key Concepts

Before implementing Charms transfers, it's important to understand these key concepts:

- **Spell JSON**: A JSON structure that defines the charm's properties and transfer details
- **Prover API**: An API that generates the required transactions based on the Spell JSON
- **Taproot Signing**: The signing method used for Charms transactions, utilizing Schnorr signatures for improved efficiency, privacy, and security
- **Transaction Broadcasting Order**: The specific order in which transactions must be broadcast, as the spell transaction depends on and spends the output of the commit transaction, typically using Bitcoin Core's `submitpackage` RPC method

## Next Steps

The following sections will guide you through each step of the transfer process in detail:

- [Transfer NFTs](/guides/wallet-integration/transfer/nft): How to transfer an entire NFT charm
- [Transfer Tokens](/guides/wallet-integration/transfer/token): How to transfer a portion of fungible tokens
- [Spell JSON](/guides/wallet-integration/references/spell-json): Detailed explanation of the Spell JSON format
- [Prover API](/guides/wallet-integration/transfer/prover-api): How to use the Prover API to generate transactions
- [Signing Transactions](/guides/wallet-integration/transfer/signing): How to sign Charms transactions
- [Broadcasting Transactions](/guides/wallet-integration/transfer/broadcasting): How to broadcast transactions to the network
