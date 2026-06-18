---
title: Apps
description: "Everything is an app"
sidebar:
  order: 2
---

Charms exist to make programmable assets possible on Bitcoin. The unit of
programmability is the **app**.

## What an app is

An app is identified by a triple `tag/identity/vk`:

- **`tag`** — a single character describing the kind of app. Three tags have
  special meaning: `t` for fungible **tokens**, `n` for **NFTs**, and `s` for
  [**Scrolls**](/concepts/scrolls). Any other character denotes a general
  app whose logic is defined entirely by its contract.
- **`identity`** — a 32-byte value identifying a particular asset *within* the
  app (for example, one NFT collection, or one token).
- **`vk`** — the verification key that pins down the app's code: the logic that
  governs how its charms may be minted, burned, or transferred.

A **charm** is one entry in the `app -> data` map carried by a UTXO. So a single
output can hold several charms from several apps at once — a *string of charms*.

## The app contract

An app's logic is a single predicate, the **app contract**:

```rust
use charms_sdk::data::{
    check, App, Data, Transaction, NFT, TOKEN,
};

/// The entry point of the app. This function defines the app contract that
/// must be satisfied for a transaction's spell to be correct.
pub fn app_contract(app: &App, tx: &Transaction, x: &Data, w: &Data) -> bool {
    match app.tag {
        NFT => check!(nft_contract_satisfied(app, tx, w)),
        TOKEN => check!(token_contract_satisfied(app, tx)),
        _ => unreachable!(),
    }
    true
}
```

The contract receives:

- **`app`** — the app being evaluated (`tag/identity/vk`),
- **`tx`** — the transaction, including its inputs, outputs and reference inputs
  (each carrying its charms),
- **`x`** — the app's **public input** (visible in the spell),
- **`w`** — the app's **private input** (a witness; never published).

It returns `true` if and only if the transaction is allowed by the app. If every
app participating in a spell is satisfied — and every prerequisite transaction
also has a correct spell — then the spell is **correct**. This is the only thing
that makes charms appear, change, or disappear.

Get a full working example by running:

```sh
charms app new my-token
```

For the patterns you'll use when writing one, see
[Write an app contract](/how-to/write-an-app-contract); for the exact SDK types
and helpers, see the [SDK reference](/reference/sdk).

## Simple transfers need no contract

Just moving an NFT or some tokens from one UTXO to another does **not** require
running (or proving) the app contract. The protocol recognizes two
*simple-transfer* rules that hold by construction:

- **NFT**: the NFT charms in the outputs are exactly the NFT charms in the
  inputs.
- **Fungible token**: the total token amount across outputs equals the total
  across inputs.

Because these cases don't need an app-contract proof, the recursive spell proof
can be generated much faster. You only pay for proving an app contract when you
do something more interesting than a transfer — minting, burning, or any custom
logic.

## Apps run as WebAssembly

An app is ordinary Rust that compiles to a small WebAssembly module
(`wasm32-wasip1`) via `charms app build`. During checking and proving, the
module is executed in a sandboxed [wasmi](https://github.com/wasmi-labs/wasmi)
interpreter that feeds it the `(app, tx, x, w)` tuple and records how many cycles
it used. The proof attests that this execution returned `true`.

## Immutable and versioned apps

There are two kinds of apps, distinguished by what the `vk` commits to:

- **Immutable apps**: `vk = SHA-256(wasm binary)`. The verification key is bound
  to one exact binary — the code can never change.
- **Versioned apps**: `vk = SHA-256(signing public key)`. The code may be
  upgraded over time. Each spell that uses the app must carry a
  [BIP-340 signature](/how-to/manage-app-keys) from the key-holder authorizing
  the specific binary (and version number) being run.

Versioned apps let you ship fixes and new features without invalidating
already-issued assets, at the cost of trusting the key-holder to authorize
binaries. Immutable apps are maximally trustless but frozen forever. See
[Manage app keys and signatures](/how-to/manage-app-keys) for how to work with
versioned apps.
