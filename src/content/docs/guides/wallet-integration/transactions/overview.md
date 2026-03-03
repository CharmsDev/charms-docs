---
title: Transactions Overview
sidebar:
  order: 1
---

Charms, like other digital assets can be transferred from one address to another, while preserving their unique properties. Charms transactions are inscribed with special pieces of data (called _spells_) within regular Bitcoin transactions. 

A correct spell has a succinct zero-knowledge proof that can be verified by anyone using a Charms client (as CLI, API or library). The containing transaction and its previous transactions (producing the inputs being spent) are the public inputs the proof is verified against. 

:::note
If a transaction doesn't have a correct spell (for whatever reason) **and** spends outputs with charms, the transaction may still be a valid Bitcoin transaction, but the charms in its inputs are effectively burned if the transaction is accepted in the blockchain.
:::

## Asset Preservation Rules

There are two types of _simple transfers_ in Charms, corresponding to the two special types of charms — NFTs and (fungible) tokens. A _simple transfer_ of assets defined by an app does not require to produce the proof of the app contract being satisfied by the transaction: simple asset preservation rules are sufficient:

1. **NFT** transfers: The entire charm is transferred to a new output unchanged. For NFT apps involved in the transaction, the transaction is a simple transfer with regard to the app (the asset defined by the app), if and only if the NFTs in the outputs are exactly the same as the NFTs in the inputs. 

2. **Fungible Token** transfers: For (fungible) token apps involved in the transaction, the transaction is a simple transfer with regard to the app (the asset defined by the app), if and only if the total amount of the token in all outputs equals the total amount of the token in the inputs.

## Spell Transactions

A spell is embedded in a single Bitcoin transaction as an `OP_RETURN` output containing the spell data and its zero-knowledge proof. The Prover API generates this transaction from a spell definition.

## The Transfer Process

The complete transfer process involves several key steps:

1. **Prepare the Spell JSON**: Specify the charms and transfer details
2. **Call the Prover API**: Generate the spell transaction
3. **Sign the Transaction**: Sign the spell transaction
4. **Broadcast the Transaction**: Send the transaction to the Bitcoin network

## Next Steps

The following sections will guide you through each step of the transfer process in detail:

- [Transfer NFTs](/guides/wallet-integration/transactions/nft): How to transfer an NFT charm
- [Transfer Tokens](/guides/wallet-integration/transactions/token): How to transfer fungible tokens
- [Prover API](/guides/wallet-integration/transactions/prover-api): How to use the Prover API to generate transactions
- [Signing Transactions](/guides/wallet-integration/transactions/signing): How to sign Charms transactions
- [Broadcasting Transactions](/guides/wallet-integration/transactions/broadcasting): How to broadcast transactions to the network

## References

- [Spell JSON](/references/spell-json): Detailed explanation of the Spell JSON format
