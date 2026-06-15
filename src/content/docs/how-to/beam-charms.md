---
title: Beam charms across chains
description: "Move a charm from Bitcoin to Cardano (and back) using beaming, with eBTC as the example."
---

[Beaming](/explanation/beaming) moves a charm from one chain to another by
destroying it at a source UTXO and re-creating it at a destination UTXO, tied
together by a hash commitment and a finality proof. This guide walks the flow
using [eBTC](https://github.com/CharmsDev/ebtc) — a token that can live on both
Bitcoin and Cardano. Read [Beaming](/explanation/beaming) first for the concepts.

A beam is always a **pair** of spells: a *send* on the source chain and a
*receive* on the destination chain.

## 1. Send (on the source chain)

The send spell marks an output as **beamed out**: it carries no token, only a
hash committing to the destination UTXO. In `beamed_outs`, the value is
`SHA-256(destination_utxo_id ‖ nonce)`:

```yaml
version: 15
tx:
  ins:
    - ${in_utxo_0}            # the eBTC you're sending
  outs:
    - 0: ${send_amount}       # output 0 nominally holds the token...
  beamed_outs:
    0: 7a0fae5c…              # ...but it's beamed out: hash of the destination UTXO (+ nonce)
  coins:
    - amount: 300             # a dust carrier output on the source chain
      dest: ${dest_1}
app_public_inputs:
  t/${app_id}/${app_vk}: ~
```

Prove it on the source chain. On Bitcoin:

```sh
cat ./spells/beam-send.yaml | envsubst | charms spell prove \
  --prev-txs=$prev_tx \
  --change-address=$change_address
```

On Cardano the send is `--chain=cardano` and needs a collateral UTXO:

```sh
cat ./spells/beam-send-c2b.yaml | envsubst | charms spell prove \
  --chain=cardano \
  --prev-txs=$prev_tx \
  --collateral-utxo=$collateral
```

Sign and broadcast the resulting transaction as usual. Note the destination
UTXO id and the nonce — you need them to receive.

## 2. Receive (on the destination chain)

The receive spell spends the **destination (placeholder) UTXO** you committed to,
re-materializing the charm. You authorize the claim with `--beamed-from`, mapping
the input index to `[source_utxo, nonce]`, and you pass the **source
transaction together with its finality proof** in `--prev-txs`.

```sh
cat ./spells/beam-receive.yaml | envsubst | charms spell prove \
  --prev-txs="$placeholder_tx" \
  --prev-txs="$source_tx_with_finality_proof" \
  --beamed-from '{0: [<source_utxo>, <nonce>]}' \
  --change-address=$change_address \
  --chain=cardano --collateral-utxo=$collateral     # when receiving on Cardano
```

The finality-proof form of `--prev-txs` depends on the **source** chain:

- **Source = Bitcoin** → a proof of work:

  ```
  --prev-txs="!bitcoin {tx: <hex>, proof: <merkleblock hex>, headers: [<hdr>, …]}"
  ```

  (about six block headers of accumulated work).

- **Source = Cardano** → a [Scrolls](/explanation/scrolls) finality signature:

  ```
  --prev-txs="!cardano {tx: <hex>, signature: <ed25519 hex>}"
  ```

The prover checks that the destination UTXO (plus nonce) hashes to the value the
source committed in `beamed_outs`, and that the source transaction is proven
final — otherwise it refuses to prove. If it succeeds, sign and broadcast the
destination transaction.

## Notes

- A pure beam (just moving the token) is a simple transfer and needs no app
  binary. If the receive *also* mints/burns — as eBTC does when releasing BTC
  from its vault — pass `--app-bins` so the contract runs.
- The hash commitment binds a **specific** destination UTXO, so only its holder
  can claim the beamed charm. Keep the nonce.
- See the [eBTC scripts](https://github.com/CharmsDev/ebtc) (`beam-send.sh`,
  `beam-receive.sh`, and the `*-c2b` counterparts) for complete, runnable
  examples in both directions.
