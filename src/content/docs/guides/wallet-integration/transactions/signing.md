---
title: Signing Transactions
sidebar:
  order: 6
---

After generating the spell transaction using the Prover API, it must be signed before it can be broadcast.

## Signing the Spell Transaction

The Prover API returns a single transaction that spends the input UTXOs and includes the spell in an `OP_RETURN` output. Sign the transaction with the keys for the funding UTXOs:

```bash
bitcoin-cli signrawtransactionwithwallet <spell_tx_hex>
```

## Key Points for Wallet Providers

- **Signature Type**: Charms use Taproot outputs, so the wallet needs to support Taproot (Schnorr signatures).

## Library Support

Most modern Bitcoin libraries support Taproot signing, including:

- Bitcoin Core
- bitcoinjs-lib
- rust-bitcoin
- btcd

Use your existing wallet infrastructure and signing libraries, just ensure they support Taproot and Schnorr signatures.
