---
title: SDK
description: "The charms-sdk / charms-data API for writing app contracts."
sidebar:
  order: 3
---

App contracts are written in Rust against the `charms-sdk` crate, which
re-exports the core data types as `charms_sdk::data` and provides the two macros
that wire your contract into a runnable WebAssembly module. A generated app
depends on it as:

```toml
[dependencies]
charms-sdk = { version = "15.0.0" }
```

For the patterns you'll use, see
[Write an app contract](/how-to/write-an-app-contract).

## Entry point

```rust
use charms_sdk::data::{check, App, Data, Transaction, NFT, TOKEN};

pub fn app_contract(app: &App, tx: &Transaction, x: &Data, w: &Data) -> bool {
    // return true iff `tx` is allowed by `app`
    true
}

// in src/main.rs:
charms_sdk::main!(my_app::app_contract);
```

### `charms_sdk::main!($path)`

Generates the module's `main`: it reads the `(App, Transaction, Data, Data)`
tuple (CBOR) from stdin and asserts that `$path(&app, &tx, &x, &w)` returns
`true`. This is the convention every app uses to expose its contract.

### `charms_sdk::app_version!($version)`

For [versioned apps](/concepts/apps#immutable-and-versioned-apps). Expands to
`pub const VERSION: u32 = $version;` and exports an `__app_version()` function so
the runtime can confirm the running binary matches the version pinned in the
spell. Requires Rust edition 2024.

## Core types

All under `charms_sdk::data` (re-exported from `charms_data`).

### `App`

```rust
pub struct App {
    pub tag: char,     // 'n' NFT, 't' token, 's' Scroll, or any custom tag
    pub identity: B32, // 32-byte asset identity
    pub vk: B32,       // app verification key
}
```

Displays / parses as the string `tag/identity_hex/vk_hex`.

### `Transaction`

```rust
pub struct Transaction {
    pub ins: Vec<(UtxoId, Charms)>,   // inputs and their charms
    pub refs: Vec<(UtxoId, Charms)>,  // reference inputs and their charms
    pub outs: Vec<Charms>,            // outputs and their charms
    pub coin_ins: Option<Vec<NativeOutput>>,
    pub coin_outs: Option<Vec<NativeOutput>>,
    pub prev_txs: BTreeMap<TxId, Data>,
    pub app_public_inputs: BTreeMap<App, Data>,
}
```

### `Charms`

```rust
pub type Charms = BTreeMap<App, Data>;  // the app -> data map carried by a UTXO
```

### `Data`

An opaque CBOR value. Construct it from any `Serialize` type, and read it back
with `value::<T>()`:

```rust
let n: u64 = x.value()?;                 // deserialize the public input
let d: Data = Data::from(&my_struct);    // serialize anything
Data::empty();                           // the empty value
data.is_empty();
```

### `UtxoId`, `TxId`, `B32`

```rust
pub struct UtxoId(pub TxId, pub u32);  // "txid:index"; 36 bytes via to_bytes()
pub struct TxId(pub [u8; 32]);         // hex (Bitcoin-style reversed)
pub struct B32(pub [u8; 32]);          // 32-byte value, hex Display/FromStr
```

### `NativeOutput`

```rust
pub struct NativeOutput {
    pub amount: u64,
    pub dest: Vec<u8>,
    pub content: Option<Data>,
}
```

## Constants

```rust
pub const TOKEN: char = 't';
pub const NFT: char = 'n';
pub const SCROLL: char = 's';
```

## Helpers

### `check!`

```rust
check!(condition);          // early-return false from a -> bool fn if false
check!(cond, "message");    // with a message printed to stderr
```

The idiomatic way to assert inside a contract: if the condition fails, the
contract returns `false` (and the failing expression is logged).

### `charm_values`

```rust
pub fn charm_values<'a>(
    app: &'a App,
    charms: impl Iterator<Item = &'a Charms>,
) -> impl Iterator<Item = &'a Data>;
```

Yields the `Data` values for `app` across the given charms (e.g. all outputs).
(Replaces the deprecated `app_datas`.)

### `sum_token_amount`

```rust
pub fn sum_token_amount<'a>(
    app: &App,
    charms: impl Iterator<Item = &'a Charms>,
) -> anyhow::Result<u64>;
```

Sum a fungible token's amounts across charms. Requires `app.tag == TOKEN`.

### Simple-transfer predicates

```rust
pub fn is_simple_transfer(app: &App, tx: &Transaction) -> bool;
pub fn token_amounts_balanced(app: &App, tx: &Transaction) -> bool;
pub fn nft_state_preserved(app: &App, tx: &Transaction) -> bool;
```

Useful when a contract wants to allow plain transfers and only enforce extra
rules on mint/burn.

## Versioned-app types

Used by the proving/verification layer (rarely by a simple contract):

```rust
pub struct VersionedApp { pub version: u32, pub wasm_hash: B32 }
pub struct AppSignature { pub public_key: B32, pub signature: [u8; 64] } // BIP-340
```

See [Manage app keys](/how-to/manage-app-keys).
