---
title: Spend Scroll outputs
description: "Spend a Scrolls-controlled Bitcoin output with the canister's sign_and_submit method."
---

A Bitcoin output carrying a [Scroll](/explanation/scrolls) charm is locked to an
address controlled by the `scrolls_bitcoin_v15` canister — no single private key
can spend it. To spend it, you build the transaction, sign your *own* inputs, and
ask the canister to sign its inputs and broadcast. This guide uses the canister's
[`sign_and_submit`](/reference/scrolls-canister#sign_and_submit) method.

## How it works

The canister will sign a Scroll input only if the transaction:

1. carries a **valid Charms spell**, and
2. pays the configured Scrolls **protocol fee**.

So you can't move Scroll-controlled funds arbitrarily — only via a transaction
whose spell is correct. That is the whole point of [Scrolls](/explanation/scrolls):
programmable custody enforced by Charms logic.

## Steps

1. **Build the spell transaction.** Prove a spell that spends the Scroll output
   and pays the fee output, producing an (unsigned) Bitcoin transaction — for
   example with `charms spell prove` (you'll need a [prover
   server](/how-to/run-a-prover-server) for Scroll spells). The result is your
   `tx_to_sign`.

2. **Sign your own inputs.** Sign every input that is *not* Scroll-controlled
   (e.g. your funding UTXOs). Leave the Scroll inputs unsigned. The canister
   requires that your inputs are already signed and its inputs are not.

3. **Call `sign_and_submit`.** Pass the network, the Scroll input indexes to
   sign, the prerequisite transactions, and the partially-signed transaction:

   ```sh
   dfx canister --network ic call rpgc6-oqaaa-aaaak-qy3uq-cai sign_and_submit \
     '("main", record {
         sign_inputs = vec { 0 : nat32 };      # indexes of the Scroll inputs
         prev_txs = vec { "0200000000…" };      # txs that created the spent outputs
         tx_to_sign = "0200000000…";            # your partially-signed tx
         v14_sign_inputs = null;
     })'
   ```

   Use `"main"` or `"testnet4"` for the network.

4. **Get the txid.** On success the canister verifies the spell, checks the fee,
   signs its inputs, **broadcasts** the transaction, and returns
   `{ txid, wtxid }`. Re-broadcasting an already-confirmed transaction is
   idempotent.

## Calling without dfx

Call the v15 canister with any Internet Computer agent (`ic-agent`/agent-rs).
The `scrolls-api` HTTP wrapper (`POST /{network}/sign`) targets the older **v14**
canister and its nonce-based addresses — use it only for legacy v14 Scroll UTXOs,
not for v15.

See the [Scrolls canister reference](/reference/scrolls-canister) for the full
method signatures and the `SignRequest` shape.
