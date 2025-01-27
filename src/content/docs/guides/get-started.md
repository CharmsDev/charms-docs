---
title: Getting Started
sidebar:
  order: 1
---

Let's get started with Charms! This guide will walk you through building your Charms app in a few minutes.

Make sure you have Rust installed:

Install Charms CLI:

```sh
## important to have this end with `/target` (a dependency issue)
export CARGO_TARGET_DIR=$(mktemp -d)/target
cargo install --locked charms --version=0.3.0
```

## Create an app

This will create a directory initialized with a Git repo for your new Charms app:

```sh
charms app new my-token
cd ./my-token
```

This will print out the verification key for your new app:

```sh
charms app vk
```

(something like this:)

```
8e877d70518a5b28f5221e70bd7ff7692a603f3a26d7076a5253e21c304a354f
```

Test the app for a spell with a simple NFT mint example:

```sh
export app_vk=$(charms app vk)

# set to a UTXO you're spending to mint the NFT (you can see what you have by `b listunspent`)
export in_utxo_0="dc78b09d767c8565c4a58a95e7ad5ee22b28fc1685535056a395dc94929cdd5f:1"

export app_id=$(sha256 -s "${in_utxo_0}")
export addr_0=$(b getnewaddress)

cat ./spells/mint-nft.yaml | envsubst | charms app run
```

If all is well, you should see that the app contract for minting an NFT has been satisfied.

To continue playing with the other example spells, keep the same `app_id` value: you create the `app_id` value for a
newly minted NFT, and then keep using it for the lifetime of the NFT and any associated fungible tokens (if the app
supports them).
