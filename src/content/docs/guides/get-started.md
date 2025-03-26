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
cargo install --locked charms --version=0.5.1
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

# set to a UTXO you're spending (you can see what you have by running `b listunspent`)
export in_utxo_0="a2889190343435c86cd1c2b70e58efed0d101437a753e154dff1879008898cd2:2"

export app_id=$(echo -n "${in_utxo_0}" | sha256sum | cut -d' ' -f1)
export addr_0="tb1p3w06fgh64axkj3uphn4t258ehweccm367vkdhkvz8qzdagjctm8qaw2xyv"

cat ./spells/mint-nft.yaml | envsubst | charms app run
```

If all is well, you should see that the app contract for minting an NFT has been satisfied.

To continue playing with the other example spells, keep the same `app_id` value: you create the `app_id` value for a
newly minted NFT, and then keep using it for the lifetime of the NFT and any associated fungible tokens (if the app
supports them).
