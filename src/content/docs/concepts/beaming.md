---
title: Beaming
description: "Moving charms across chains without a custodial bridge."
sidebar:
  order: 5
---

**Beaming** moves a charm from one UTXO to another — including from one chain to
another (Bitcoin ↔ Cardano) — without a custodial bridge and without wrapping.
It is a *teleport*: the charm is destroyed at a source UTXO on the origin chain
and re-created at a destination UTXO on the target chain, with a zero-knowledge
proof tying the two together.

The canonical worked example is [eBTC](https://github.com/CharmsDev/ebtc), an
app whose token can live on either Bitcoin or Cardano and hop between them. See
[Beam charms across chains](/how-to/beam-charms) for the hands-on version.

## Not a bridge

A typical bridge locks an asset in a vault on chain A and mints a wrapped
representation on chain B, trusting whoever controls the vault. Beaming does
neither. There is no separate bridge contract and no wrapped twin:

- On the **source** side, the charm is *annihilated* as an on-chain asset. The
  output that "sends" it carries no token; it only commits to *where* the charm
  is going.
- On the **destination** side, the charm is *re-materialized* natively, and the
  app's own contract continues to govern it exactly as before. Continuity of the
  app's rules is preserved across the hop.

Soundness comes from proofs, not from a trusted operator.

## How a beam is tied together

Two pieces make a beam safe: a **commitment** linking source to destination, and
a **finality proof** showing the source transaction really happened and can't be
reversed.

### The commitment

The source spell marks an output as *beamed out* and records a hash that commits
to the destination: `SHA-256(destination UTXO id [‖ nonce])`. Because the hash
binds a *specific* destination UTXO, only the holder of that UTXO can later claim
the beamed charm — no one else can intercept it. The optional nonce lets the
sender commit to a destination up front and blind the commitment.

The destination spell then spends that committed UTXO and declares, out of band,
that this input is actually drawing the charm from the source UTXO on the other
chain. The proof checks that the destination UTXO (plus nonce) hashes to exactly
the value the source committed to. If it matches, the charm's value is carried
over from the source spell into the destination transaction, where the app
contract sees it as a genuine input.

### The finality proof

Re-materializing a charm from a source transaction that could still be reorged
would let an attacker mint value out of thin air. So a beam is only valid if the
source transaction is proven **final**, and the kind of proof depends on the
origin chain:

- **From Bitcoin** — a *trustless* proof of work: a Merkle proof that the source
  transaction is in a block, plus a chain of subsequent block headers carrying
  roughly six blocks' worth of accumulated work. No third party is trusted; only
  Bitcoin's own proof-of-work.
- **From Cardano** — a finality *attestation*: an Ed25519 signature from a
  [Scrolls](/concepts/scrolls) canister certifying that the Cardano
  transaction is settled. (Cardano has no compact proof-of-work analogue, so
  finality is attested by the Scrolls signer.)

The source transaction, together with its finality proof, is passed to the
destination prover as a prerequisite transaction (`prev_txs`). The correctness
check refuses to proceed unless every beam source carries an adequate finality
proof.

## Beaming and Scrolls

Beaming and [Scrolls](/concepts/scrolls) are distinct mechanisms that share a
trust anchor. Beaming moves charms between UTXOs and is verified by the
commitment and finality proof above. Scrolls are the Internet Computer canisters
that custody and sign Bitcoin/Cardano UTXOs and that attest Cardano finality.
A beam from Cardano relies on a Scrolls signature for its finality proof; a beam
from Bitcoin does not need Scrolls at all. An asset like eBTC combines both: a
Scrolls-managed vault anchors BTC ⇄ eBTC one-to-one, while beaming lets the
resulting eBTC travel between Bitcoin and Cardano.
