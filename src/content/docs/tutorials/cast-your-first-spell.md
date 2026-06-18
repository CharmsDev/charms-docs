---
title: Cast your first spell
description: "Mint an NFT on Bitcoin testnet4: prove a spell, sign it, and broadcast it."
---

In [Build a Charms app](/tutorials/build-a-charms-app) you checked a spell
locally. Now you'll cast one for real: mint an NFT on Bitcoin `testnet4` by
proving the spell, signing the transaction, and broadcasting it.

## Before you begin

- Finish [Build a Charms app](/tutorials/build-a-charms-app) — you'll reuse that
  project.
- Set up a [Bitcoin node on `testnet4`](/how-to/set-up-a-bitcoin-node) with a
  funded wallet. We assume `alias b=bitcoin-cli` and `jq` is installed.

Move into your app directory and rebuild it:

```sh
cd ./my-token
app_bin=$(charms app build)
export app_vk=$(charms app vk $app_bin)
export RUST_LOG=info
```

## 1. Pick a UTXO to spend

The NFT's identity is derived from a UTXO you spend when minting. Pick one you
control and record the transaction that created it (the prover needs it):

```sh
# choose a UTXO from your wallet
export in_utxo_0=$(b listunspent | jq -r '.[0] | "\(.txid):\(.vout)"')

# the NFT's identity = SHA-256 of that UTXO id
export app_id=$(echo -n "${in_utxo_0}" | sha256sum | cut -d' ' -f1)

# the raw transaction that produced the UTXO (a prerequisite for proving)
export prev_txs=$(b getrawtransaction $(echo $in_utxo_0 | cut -d: -f1))
```

## 2. Fill in the spell's outputs

The `mint-nft.yaml` template puts the new NFT on a fresh output. Derive the
destination from a new wallet address, and set the output amount and a change
address:

```sh
export dest_0=$(charms util dest --addr $(b getnewaddress))
export amount_0=20000                       # sats carried by the NFT output
export change_address=$(b getrawchangeaddress)
```

## 3. Prove the spell

Proving runs the app contract and generates the zero-knowledge proof. By default
the CLI sends the request to the hosted prover at
`https://v15.charms.dev/spells/prove` — this
takes a little while.

```sh
out=$(cat ./spells/mint-nft.yaml | envsubst | charms spell prove \
  --app-bins=$app_bin \
  --prev-txs=$prev_txs \
  --private-inputs=<(cat ./spells/mint-nft-private.yaml | envsubst) \
  --change-address=$change_address)
```

`charms spell prove` prints a JSON array containing one unsigned Bitcoin
transaction — the spell transaction, with the spell and its proof in an
`OP_RETURN` output. Extract its hex:

```sh
tx=$(echo "$out" | jq -r '.[0].bitcoin')
```

## 4. Sign and broadcast

Sign with your wallet, then send it to the network:

```sh
signed=$(b signrawtransactionwithwallet "$tx" | jq -r '.hex')
b sendrawtransaction "$signed"
```

`sendrawtransaction` prints the txid. Your NFT is now minted on `testnet4`! 🎉

## 5. Verify

Inspect the spell carried by your transaction:

```sh
charms tx show-spell --tx "$signed"
```

You can also look the txid up on
[mempool.space/testnet4](https://mempool.space/testnet4).

## What's next

- Mint tokens against your NFT, or transfer charms — see the
  [How-to guides](/how-to).
- Understand what just happened: [Spells](/concepts/spells) and
  [Transactions](/concepts/transactions).
- Run proving yourself: [Run a prover server](/how-to/run-a-prover-server).
