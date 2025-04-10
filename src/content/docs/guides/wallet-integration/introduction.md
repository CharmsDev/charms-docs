---
title: Introduction
sidebar:
  order: 1
---

This guide provides wallet providers with the technical specifications needed to integrate Charms support into their wallets.

By implementing this protocol, wallet providers can offer their users the ability to view, transfer, and interact with Charms, enabling use cases such as collectibles, tokens, and programmable assets on Bitcoin without requiring additional blockchains or layer-2 solutions.

## End Results

By implementing this protocol, wallet providers can offer their users the ability to:

- View and manage Charms assets
- Transfer Charms (both NFTs and fungible tokens)
- Interact with Charms-enabled applications
- Participate in the growing Charms ecosystem

## Integration Steps

Charms wallet integration consists of several components:

1. **Visualization**: Displaying Charms assets in the wallet interface
2. **Transfer NFTs**: Enabling users to send NFT charms
3. **Transfer Fungible Tokens**: Enabling users to send fungible token charms
4. **Wallet features considerations**: Some current operations like UTXO consolidation need to be Charms-compliant

## Guide Sections

1. Introduction (this page)
2. [Charms Visualization](/guides/wallet-integration/visualization)
3. [Charms Transfer](/guides/wallet-integration/transfer/overview)
   - [Transfer NFTs](/guides/wallet-integration/transfer/nft)
   - [Transfer Tokens](/guides/wallet-integration/transfer/token)
   - [Prover API](/guides/wallet-integration/transfer/prover-api)
   - [Signing Transactions](/guides/wallet-integration/transfer/signing)
   - [Broadcasting Transactions](/guides/wallet-integration/transfer/broadcasting)

## References

- [Spell JSON](/references/spell-json)

