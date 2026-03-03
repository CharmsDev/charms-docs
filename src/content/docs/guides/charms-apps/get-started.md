---
title: Getting Started
sidebar:
  order: 2
---

Let's get started with Charms! This guide will walk you through building your Charms app in a few minutes.

Make sure you have Rust installed:

Install Charms CLI:

```sh
## important to have this end with `/target` (a dependency issue)
export CARGO_TARGET_DIR=$(mktemp -d)/target
cargo install --locked charms
```

## Create an app

This will create a directory initialized with a Git repo for your new Charms app:

```sh
charms app new my-token

cd ./my-token
```

This will print out the verification key for your new app:

```sh
app_bin=$(charms app build)
charms app vk "$app_bin"
```

(something like this:)

```
8e877d70518a5b28f5221e70bd7ff7692a603f3a26d7076a5253e21c304a354f
```

Test the app for a spell with a simple NFT mint example:

```sh
export app_vk=$(charms app vk)

# set to a UTXO you're spending (you can see what you have by running `b listunspent`)
export in_utxo_0="d8fa4cdade7ac3dff64047dc73b58591ebe638579881b200d4fea68fc84521f0:0"

export app_id=$(echo -n "${in_utxo_0}" | sha256sum | cut -d' ' -f1)
export addr_0="tb1p3w06fgh64axkj3uphn4t258ehweccm367vkdhkvz8qzdagjctm8qaw2xyv"

prev_txs=02000000000101a3a4c09a03f771e863517b8169ad6c08784d419e6421015e8c360db5231871eb0200000000fdffffff024331070000000000160014555a971f96c15bd5ef181a140138e3d3c960d6e1204e0000000000002251207c4bb238ab772a2000906f3958ca5f15d3a80d563f17eb4123c5b7c135b128dc0140e3d5a2a8c658ea8a47de425f1d45e429fbd84e68d9f3c7ff9cd36f1968260fa558fe15c39ac2c0096fe076b707625e1ae129e642a53081b177294251b002ddf600000000

cat ./spells/mint-nft.yaml | envsubst | charms spell check --prev-txs=${prev_txs} --app-bins=${app_bin} 
```

If all is well, you should see that the app contract for minting an NFT has been satisfied.

To continue playing with the other example spells, keep the same `app_id` value: you create the `app_id` value for a
newly minted NFT, and then keep using it for the lifetime of the NFT and any associated fungible tokens (if the app
supports them).
