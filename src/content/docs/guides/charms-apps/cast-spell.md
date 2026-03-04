---
title: Cast a Spell
sidebar:
  order: 3
next: false
---

Now that we have implemented an app, we're ready to cast a spell onto a real Bitcoin transaction. We're going to use
`bitcoin-cli` to interact with the Bitcoin network.

**Quick note:** Check if you have [pre-requisites](/guides/charms-apps/pre-reqs) installed.

**Important:** we assume `bitcoin-cli` is aliased as `b`:

```sh
alias b=bitcoin-cli
```

## Using an app

We've just tested the app with an NFT-minting spell. Let's use it on Bitcoin `testnet4` (we have a node set up
in [pre-requisites](/guides/charms-apps/pre-reqs)).

Prepare:
```sh
app_bin=$(charms app build)

# pick from the output of `bitcoin-cli listunspent`
change_address=$(b getrawchangeaddress)

# set dest and amount env vars used by the spell template
# (dest is a hex-encoded destination derived from a Bitcoin address)
export dest_0=$(charms util dest --addr=$(b getnewaddress))
export amount_0=1000

export RUST_LOG=info
```

Run:
```sh
cat ./spells/mint-nft.yaml | envsubst | charms spell prove \
  --app-bins=${app_bin} \
  --prev-txs=$prev_txs \
  --private-inputs=<(cat ./spells/mint-nft-private.yaml | envsubst) \
  --change-address=$change_address
```

This will create (but not yet sign) a Bitcoin transaction containing the spell and its proof in an `OP_RETURN` output.

`charms spell prove` prints the hex-encoded transaction at the end of its output, which looks like a JSON
array (because it is a JSON array):

```
[{"bitcoin":"020000000001015f...57505efa00000000"}]
```

You can now sign and broadcast the transaction:

```sh
b signrawtransactionwithwallet "020000000001015f...57505efa00000000"
b sendrawtransaction "020000000001015f...57505efa00000000"
```
