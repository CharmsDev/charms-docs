---
title: Sign and broadcast
description: "Finalize a spell transaction: sign it and send it to the Bitcoin network."
---

The [Prover API](/reference/prover-api) returns an **unsigned** Bitcoin
transaction — a single transaction that spends the inputs and carries the spell
and its proof in an `OP_RETURN` output. Sign it and broadcast it to complete the
transfer.

## Sign

Sign the transaction with the keys for its funding inputs:

```sh
bitcoin-cli signrawtransactionwithwallet <spell_tx_hex>
```

The wallet must be able to sign whatever input types it owns. The Charms tooling
and node setup [recommend `bech32m` (Taproot)](/how-to/set-up-a-bitcoin-node)
addresses, so ensure your signing stack supports Taproot / Schnorr signatures.
Most modern libraries do — Bitcoin Core, `bitcoinjs-lib`, `rust-bitcoin`,
`btcd`, and others.

## Broadcast

Send the signed transaction:

```sh
bitcoin-cli sendrawtransaction <signed_spell_tx_hex>
```

## Considerations

- **Fee rate.** The fee is set when you prove (`fee_rate` in the Prover API
  request, or `--fee-rate` on the CLI — default `2.0` sats/vB). Choose a rate
  appropriate to network conditions so the transaction is accepted into the
  mempool and confirmed.
- **Validate before sending.** Confirm the transaction is well-formed and the
  inputs are still unspent before broadcasting.
- **One transaction.** There is no commit/reveal step — signing and broadcasting
  the single returned transaction is all that's needed.
