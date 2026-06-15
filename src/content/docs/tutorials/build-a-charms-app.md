---
title: Build a Charms app
description: "Create a Charms app and check a spell locally — no blockchain required."
---

In this tutorial you'll install the Charms tools, scaffold an app, build it, and
check a spell against it — entirely on your machine. By the end you'll have a
working app and you'll have seen its contract accept a mint.

## Before you begin

Install the prerequisites and the CLI (details in
[Install Charms](/how-to/install-charms)):

```sh
rustup target add wasm32-wasip1            # WebAssembly target
brew install protobuf                      # Protocol Buffers compiler (macOS)

export CARGO_TARGET_DIR=$(mktemp -d)/target  # note: must end with /target
cargo install --locked charms
```

Check it works:

```sh
charms spell vk
# { "prover": false, "version": 15, "vk": "0042…ae52" }
```

## 1. Create the app

```sh
charms app new my-token
cd ./my-token
cargo update
```

This scaffolds a Git-initialized project. The interesting file is `src/lib.rs` —
your **app contract**. The template implements a fungible token managed by a
reference NFT: the NFT's state holds the `remaining` supply, and whoever controls
the NFT can mint tokens by reducing it. Read
[Write an app contract](/how-to/write-an-app-contract) for a walkthrough of the
code.

## 2. Build it and get its verification key

```sh
app_bin=$(charms app build)
charms app vk $app_bin
```

`charms app build` compiles the app to WebAssembly and prints the path to the
`.wasm` file. `charms app vk` prints the app's **verification key** — a 32-byte
hex value that identifies your app's code, something like:

```
8e877d70518a5b28f5221e70bd7ff7692a603f3a26d7076a5253e21c304a354f
```

## 3. Check an NFT-mint spell

The project ships example spells under `spells/`. Let's check the NFT mint
locally — no network, no proving, just running the contract. Set the environment
variables the spell template uses. The app's `identity` (`app_id`) is the
SHA-256 of the UTXO you're "spending":

```sh
export app_vk=$(charms app vk $app_bin)

# the UTXO whose id seeds this NFT (any value works for a local check)
export in_utxo_0="d8fa4cdade7ac3dff64047dc73b58591ebe638579881b200d4fea68fc84521f0:0"
export app_id=$(echo -n "${in_utxo_0}" | sha256sum | cut -d' ' -f1)

export dest_0=$(charms util dest --addr tb1p3w06fgh64axkj3uphn4t258ehweccm367vkdhkvz8qzdagjctm8qaw2xyv)
export amount_0=20000

# the raw transaction that produced in_utxo_0 (a prerequisite for checking)
prev_txs=02000000000101a3a4c09a03f771e863517b8169ad6c08784d419e6421015e8c360db5231871eb0200000000fdffffff024331070000000000160014555a971f96c15bd5ef181a140138e3d3c960d6e1204e0000000000002251207c4bb238ab772a2000906f3958ca5f15d3a80d563f17eb4123c5b7c135b128dc0140e3d5a2a8c658ea8a47de425f1d45e429fbd84e68d9f3c7ff9cd36f1968260fa558fe15c39ac2c0096fe076b707625e1ae129e642a53081b177294251b002ddf600000000
```

Now run the check, passing the app binary, the prerequisite transaction, and the
private inputs (the witness — here, the minting UTXO):

```sh
cat ./spells/mint-nft.yaml | envsubst | charms spell check \
  --prev-txs=${prev_txs} \
  --app-bins=${app_bin} \
  --private-inputs=<(cat ./spells/mint-nft-private.yaml | envsubst)
```

If all is well, you'll see that the NFT-mint contract is satisfied, along with
the cycles the contract used. 🎉

:::note[What just happened]
`charms spell check` ran your app's `app_contract` in WebAssembly against the
spell, with no proof generated. The `mint-nft.yaml` spell mints one NFT; the
`mint-nft-private.yaml` file passes the minting UTXO to the contract as its
private witness.
:::

Keep the same `app_id` as you explore the other example spells (`mint-token.yaml`,
`send.yaml`): you create an `app_id` when you mint the NFT, then reuse it for the
lifetime of that NFT and its associated tokens.

## Next

You've built an app and checked a spell locally. Next, put a spell on a real
blockchain: [Cast your first spell](/tutorials/cast-your-first-spell).
