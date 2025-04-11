---
title: Signing Transactions
sidebar:
  order: 6
---

After generating the transactions using the Prover API, both transactions must be signed before they can be broadcast. This guide provides the essential information for signing Charms transactions.

## Transaction Types

There are two transactions that need to be signed:

1. **Commit Transaction**: Uses standard P2TR (Pay-to-Taproot) signing with Schnorr signatures
2. **Spell Transaction**: Also uses Taproot signing with Schnorr signatures, but requires the additional spell script path

## Key Points for Wallet Providers

- **Independent Signing**: The commit and spell transactions can be signed independently
- **Signature Type**: Both transactions use Schnorr signatures (BIP340)
- **Taproot Support**: Ensure your wallet library supports Taproot (BIP341) signing
- **Script Path**: For the spell transaction, you'll need to include the spell script path in the witness data

## Library Support

Most modern Bitcoin libraries support Taproot signing, including:

- Bitcoin Core
- bitcoinjs-lib
- rust-bitcoin
- btcd

Use your existing wallet infrastructure and signing libraries, just ensure they support Taproot and Schnorr signatures.
