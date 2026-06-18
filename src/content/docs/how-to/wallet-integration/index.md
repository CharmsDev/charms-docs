---
title: Wallet integration
description: "Add Charms support to a Bitcoin wallet."
---

This set of guides gives wallet providers what they need to add Charms support:
displaying charms, transferring them, and signing and broadcasting the resulting
transactions. With it, a wallet can let users view, transfer, and interact with
charms — collectibles, tokens, and other programmable assets on Bitcoin.

## What it involves

1. **[Display charms](/how-to/wallet-integration/display-charms)** — read the
   charms held by a UTXO and render them.
2. **[Transfer NFTs](/how-to/wallet-integration/transfer-nfts)** — build a spell
   that sends an NFT charm.
3. **[Transfer tokens](/how-to/wallet-integration/transfer-tokens)** — build a
   spell that sends fungible-token charms.
4. **[Sign and broadcast](/how-to/wallet-integration/sign-and-broadcast)** —
   finalize the spell transaction on the Bitcoin network.

The transfer flow always follows the same shape: build the
[spell](/reference/spell), [call the Prover API](/how-to/call-the-prover-api) to
get the spell transaction, then sign and broadcast it.

:::caution[Charms-aware coin selection]
A wallet that supports Charms must avoid spending charmed UTXOs by accident.
Ordinary operations like fee bumping or UTXO consolidation will **burn** any
charms in the inputs unless the transaction carries a correct spell preserving
them. Treat charmed UTXOs as special and exclude them from generic coin
selection.
:::

## Reference

- [Spell structure](/reference/spell)
- [Prover API](/reference/prover-api)
