---
title: Cast a Spell
sidebar:
  order: 2
---

Now that we have implemented an app, we're ready to cast a spell onto a real Bitcoin transaction. We're going to use
`bitcoin-cli` to interact with the Bitcoin network.

**Quick note:** Check if you have [pre-requisites](/guides/pre-reqs) installed.

**Important:** we assume `bitcoin-cli` is aliased as `b`:

```sh
alias b=bitcoin-cli
```

## Using an app

We've just tested the app with an NFT-minting spell. Let's use it on Bitcoin `testnet4`.

```sh
app_bins=$(charms app build)

# pick from the output of `bitcoin-cli listunspent`
# should NOT be the same as the one you used for minting the NFT
funding_utxo_id="8c1d638a7ff6b6a977580beec47fcc9b8a93e44893c27ab69935c14e9316a735:1"

cat ./spells/mint-nft.yaml | envsubst | RUST_LOG=info charms wallet cast --app-bins=${app_bins} --funding-utxo-id=${funding_utxo_id}
```

This will create and sign (but not yet submit to the network) two Bitcoin transactions:

- _commit_ transaction and
- _cast_ transaction.

The _commit_ transaction creates exactly one output (committing to a spell and its proof) which is then spent by the
_cast_ transaction. The _cast_ transaction contains the spell and proof (in the witness spending the
output created by the _commit_ tx), and it cannot exist without the _commit_ transaction.

Note: currently, `charms wallet cast` takes a pretty long time (about 27 minutes on MBP M2 64GB) and requires Docker to
run. We're working on improving this.

`charms wallet cast` prints the 2 hex-encoded signed transactions at the end of its output, which looks like a JSON array (because it is a JSON array):

```
["020000000001015f...57505efa00000000", "020000000001025f...e14c656300000000"]
```

You can copy this JSON array of hex strings and submit both transaction to the network as a package:

```sh
b submitpackage '["020000000001015f...57505efa00000000", "020000000001025f...e14c656300000000"]'
```
