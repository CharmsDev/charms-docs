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
app_bins=$(charms app build)

# pick from the output of `bitcoin-cli listunspent`
# should NOT be the same as the one you used for minting the NFT
funding_utxo="2d6d1603f0738085f2035d496baf2b91a639d204b414ea180beb417a3e09f84e:1"

export RUST_LOG=info
```

Run:
```sh
cat ./spells/mint-nft.yaml | envsubst | charms spell prove --app-bins=${app_bins} --prev-txs=$prev_txs --funding-utxo=$funding_utxo --funding-utxo-value=$funding_utxo_value --change-address=$change_address
```

This will create (but not yet sign) two Bitcoin transactions:

- _commit_ transaction and
- _spell_ transaction.

The _commit_ transaction creates exactly one output (committing to a spell and its proof) which is then spent by the
_spell_ transaction. The _spell_ transaction contains the spell and proof (in the witness spending the
output created by the _commit_ tx), and it cannot exist without the _commit_ transaction.

:::note
Currently, `charms spell prove` takes a pretty long time (about 5 minutes). We're working on improving this.
:::

`charms spell prove` prints the 2 hex-encoded signed transactions at the end of its output, which looks like a JSON
array (because it is a JSON array):

```
["020000000001015f...57505efa00000000", "020000000001025f...e14c656300000000"]
```

You can now sign these transactions. Then submit both to the Bitcoin network as a package:

```sh
b submitpackage '["020000000001015f...57505efa00000000", "020000000001025f...e14c656300000000"]'
```
