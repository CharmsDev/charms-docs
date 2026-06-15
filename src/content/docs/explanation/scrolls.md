---
title: Scrolls
description: "Internet Computer canisters that act as programmable, keyless signers for Charms."
sidebar:
  order: 6
---

**Scrolls** are [Internet Computer](https://internetcomputer.org/) (ICP)
canisters that act as programmable, keyless custodians and signers for Bitcoin
and Cardano. They let a charm (or plain BTC) be controlled by *on-chain logic*
rather than by a single private key.

For the exact methods of the Bitcoin canister, see the
[Scrolls canister reference](/reference/scrolls-canister); to spend a
Scroll-controlled output, see [Spend Scroll outputs](/how-to/spend-scroll-outputs).

## Keyless custody via threshold signing

A Scrolls canister never holds a private key. Instead it uses the Internet
Computer's native **threshold cryptography**: the signing key is held
collectively by an ICP subnet, and the canister asks the subnet to sign on its
behalf (threshold ECDSA for Bitcoin, Schnorr/Ed25519 for Cardano). Each
Scroll-controlled UTXO gets its own address, derived deterministically from the
transaction that created it.

The decisive property is the canister's **signing policy**. It will sign a spend
only if the spending transaction:

1. carries a **valid Charms spell**, and
2. pays the configured protocol **fee**.

That is what makes the custody *programmable*: funds are released not by
presenting a key, but by satisfying on-chain Charms logic — a verified
zero-knowledge spell proof. The canisters are designed to be *blackholed* (no
controllers), so no human can override the policy.

## Scroll charms

The charm tag `s` denotes a **Scroll**. A Bitcoin output carrying a Scroll charm
can only be created at a Scrolls-canister-controlled address. The link is
enforced inside the proof: when a spell creates a Scroll output, the prover asks
the canister for the controlling `scriptPubKey` (via its
[`addresses`](/reference/scrolls-canister#addresses) method, signed by the
canister), pins that address into the output, and the spell proof verifies the
canister's signature. Later, spending that output requires the canister to
co-sign — which it does only for a valid spell. (On Cardano, a Scroll app behaves
like any other non-token app.)

The result is an output that is provably locked to programmable custody: its
fate is decided by Charms logic, with the Scrolls canister as the agent that
enforces it.

## What Scrolls enable

- **Vaults and programmable custody** — e.g. the eBTC vault, where BTC is locked
  at a Scrolls address and released only by a spell that mints/burns eBTC
  one-to-one. See [Beaming](/explanation/beaming).
- **Automated signing and broadcasting** — a client can build a transaction,
  sign its own inputs, and hand the rest to the canister's
  [`sign_and_submit`](/reference/scrolls-canister#sign_and_submit) method, which
  signs the Scroll inputs, enforces the spell-and-fee policy, broadcasts the
  transaction, and returns its txid.
- **Cross-chain finality attestation** — the Cardano Scrolls canister signs
  certifications used as finality proofs when [beaming](/explanation/beaming)
  out of Cardano.

## The Bitcoin canister at a glance

The v15 Bitcoin signer is the `scrolls_bitcoin_v15` canister (mainnet
`rpgc6-oqaaa-aaaak-qy3uq-cai`). In day-to-day use only two methods matter:

- [**`addresses`**](/reference/scrolls-canister#addresses) — returns (and signs)
  the canister-controlled `scriptPubKey`s for given outputs. The prover calls
  this automatically while building a spell with Scroll outputs.
- [**`sign_and_submit`**](/reference/scrolls-canister#sign_and_submit) — signs
  the Scroll inputs of a transaction, checks the spell and fee, broadcasts it,
  and returns the txid. This is the only method a wallet normally needs to call
  directly.
