---
title: Signing Transactions
sidebar:
  order: 6
---

After generating the transactions using the Prover API, both transactions must be signed before they can be broadcast.

## Transaction Types

There are two transactions that need to be signed:

1. **Commit Transaction**: Uses standard P2TR (Pay-to-Taproot) transaction, spending the funding UTXO and creating the "spell commit output" (which is the only output). Sign with the appropriate signature for spending the funding UTXO. Signing this transaction is the equivalent of this `bitcoin-cli` command:
  ```bash
  bitcoin-cli signrawtransactionwithwallet <commit_tx_hex>
  ```
   
2. **Spell Transaction**: Spends the "spell commit output" — the Taproot output created by the Commit Transaction. The corresponding witness already contains the signature for spending this output. The rest of the transaction needs to be signed by the wallet. Signing this transaction is the equivalent of this `bitcoin-cli` command:
  ```bash
  bitcoin-cli signrawtransactionwithwallet <spell_tx_hex> \
    '[{"txid": "<commit_tx_id>", "vout": 0, "scriptPubKey": "commit_tx_out_scriptPubKey", "amount": <commit_tx_out_amount>}]' 
  ```
  The commit transaction output data must be provided: it is necessary to construct the signature.

## Key Points for Wallet Providers

- **Signature Type**: For simplicity, Charms use Taproot outputs, so the wallet needs to support Taproot (Schnorr signatures).
- **Pre-signed Spell input**: For the spell transaction, the last input already includes the valid witness (which includes the spell and its proof). The wallet only needs to sign the rest of the transaction.

## Library Support

Most modern Bitcoin libraries support Taproot signing, including:

- Bitcoin Core
- bitcoinjs-lib
- rust-bitcoin
- btcd

Use your existing wallet infrastructure and signing libraries, just ensure they support Taproot and Schnorr signatures.
