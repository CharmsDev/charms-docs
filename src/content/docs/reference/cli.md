---
title: CLI
description: "The charms command-line interface, command by command."
sidebar:
  order: 1
---

The `charms` command-line tool creates and verifies spells, manages apps, and
runs a prover server. This page documents every command in v15.

## Binaries

The workspace builds two binaries from the same code:

| Binary | Built with | Role |
| --- | --- | --- |
| `charms` | default features | The CLI. `charms spell prove` forwards proving to a hosted [Prover API](/reference/prover-api). |
| `charms-prover` | `--features prover` | The proving **server** with real SP1 proving built in. Run it with `charms-prover server`. |

Both expose the same subcommands; only `charms-prover` can generate real proofs
locally. Install the CLI with:

```sh
cargo install --locked charms
```

See [Install Charms](/how-to/install-charms) for prerequisites and
[Run a prover server](/how-to/run-a-prover-server) to build `charms-prover`.

## `charms app`

Manage Charms apps. See [Write an app contract](/how-to/write-an-app-contract)
and [Manage app keys](/how-to/manage-app-keys).

### `charms app new <NAME>`

Scaffold a new app project from the
[`charms-app`](https://github.com/CharmsDev/charms-app) template (via
`cargo generate`; installs `cargo-generate` if missing). Creates a Git-initialized
directory with `src/lib.rs` (your `app_contract`), example spells under
`spells/`, and a `Cargo.toml` depending on `charms-sdk`.

### `charms app build`

Compile the app to WebAssembly:

```sh
cargo build --locked --release --target=wasm32-wasip1
```

Prints the path to the resulting `.wasm` binary. If `.charms/app-key.json`
exists, the freshly built binary is automatically signed and a
`<wasm-path>.sig.yaml` is written (see `app sign`).

### `charms app vk [PATH] [--pubkey <FILE>]`

Print an app verification key (`vk`), a 32-byte hex value.

- `PATH` given → `SHA-256` of that Wasm binary (an **immutable** app's vk).
- `--pubkey <FILE>` given → `SHA-256` of the x-only public key (a **versioned**
  app's vk). Accepts a hex file or an `app-key.json`.
- neither → uses `.charms/app-key.json` if present, otherwise builds the app and
  hashes the Wasm.

### `charms app keygen [--out <FILE>]`

Generate a BIP-340 (Schnorr/secp256k1) keypair for a **versioned** app and write
it as JSON `{ public_key, secret_key, vk }` (where `vk = SHA-256(public_key)`).
Default path: `.charms/app-key.json` (written `0600`; refuses to overwrite). Keep
the secret key private — it is the authority to authorize new app binaries.

### `charms app sign [--key <FILE>] [--bin <WASM>] [--out <FILE>]`

Produce a Schnorr signature over the app binary's `SHA-256`, authorizing it for a
versioned app.

- `--key` default `.charms/app-key.json`.
- `--bin` default: the release build output.
- `--out` default `<wasm-path>.sig.yaml`. A `.yaml`/`.yml` path writes a
  `vk -> AppSignature` map; any other extension writes a single JSON
  `AppSignature`.

### `charms app verify [--bin <WASM>] [--sig <FILE>]`

Verify that the signature(s) match the binary. `--sig` default
`<wasm-path>.sig.yaml`. Checks that each entry's `SHA-256(public_key)` equals its
`vk` key and that the Schnorr signature is valid.

## `charms spell`

### `charms spell check`

Validate a spell and run its app contracts **locally** (in WebAssembly, no
proof). Prints the resolved spell and the cycles each app used.

```sh
charms spell check \
  --spell ./spells/mint-nft.yaml \
  --app-bins ./target/wasm32-wasip1/release/my_token.wasm \
  --private-inputs ./spells/mint-nft-private.yaml \
  --prev-txs <hex>
```

| Option | Description |
| --- | --- |
| `--spell <FILE>` | Spell YAML/JSON. Default: `/dev/stdin`. |
| `--private-inputs <FILE>` | YAML/JSON map of app → private input (`w`). |
| `--beamed-from <STRING>` | YAML/JSON map `input_index -> [source_utxo, nonce]` for [beamed](/concepts/beaming) inputs. |
| `--app-bins <WASM>...` | App `.wasm` binaries (repeatable). |
| `--app-signatures <FILE>` | YAML/JSON map `vk -> {public_key, signature}` for versioned apps. |
| `--prev-txs <HEX>...` | Prerequisite transactions (repeatable). Plain hex, `!bitcoin …`/`!cardano …` tagged forms, or JSON `{"bitcoin":"…"}`. |
| `--chain <CHAIN>` | `bitcoin` (default) or `cardano`. |
| `--mock` | Relax proof-related strictness (mock mode). |

### `charms spell prove`

Prove a spell and emit ready-to-broadcast transaction(s). Accepts every
`spell check` option, plus:

| Option | Description |
| --- | --- |
| `--change-address <ADDR>` | **Required.** Change address for the target chain. |
| `--fee-rate <SATS_PER_VB>` | Bitcoin fee rate. Default `2.0` (must be ≥ `1.0`). |
| `--collateral-utxo <txid:vout>` | **Required for `--chain cardano`.** Collateral UTXO. |
| `--payload` | Print the [Prover API](/reference/prover-api) request instead of proving. |
| `-o, --output <json\|cbor>` | Payload format (with `--payload`). Default `json`. |

On Bitcoin, prints a JSON array with the single unsigned spell transaction:
`[{"bitcoin":"<hex>"}]`. On Cardano, prints a Ledger CDDL transaction envelope.
By default the `charms` binary forwards the proving request to the hosted
[Prover API](/reference/prover-api); build with `--features prover` (the
`charms-prover` binary) to prove locally.

### `charms spell vk`

Print the spell verification key as JSON (pass `--mock` for the mock key), e.g.:

```json
{ "prover": false, "version": 15, "vk": "00425796f4c4fa050043eee14d801b4f935244e44aad6a28de0cd5cb3de0ae52" }
```

## `charms tx show-spell`

Extract and verify the spell embedded in a transaction.

```sh
charms tx show-spell --tx <HEX> [--chain bitcoin|cardano] [--json] [--mock]
```

Prints the spell as YAML (default) or JSON (`--json`). Returns nothing if the
transaction carries no valid spell.

## `charms wallet list`

```sh
charms wallet list [--json] [--mock]
```

List the UTXOs in your local `bitcoin-cli` wallet that carry charms (Bitcoin
only). Shells out to `bitcoin-cli listunspent` and `getrawtransaction`.

## `charms util`

### `charms util dest`

Compute the hex destination (`dest`) used inside `tx.coins[].dest` of a spell.

```sh
charms util dest --addr <ADDRESS> [--chain bitcoin|cardano]
charms util dest --apps <tag/identity/vk>... --chain cardano
```

Exactly one of `--addr` (any address) or `--apps` (Cardano proxy-script address)
is required. The chain is auto-detected from the address when `--chain` is
omitted.

### `charms util install-circuit-files`

(Hidden.) Install the SP1 Groth16 circuit artifacts used for proving.

## `charms server`

```sh
charms server [--ip <IP>] [--port <PORT>]
```

Start the REST API server exposing `POST /spells/prove` and `GET /ready`.
Defaults: `--ip 0.0.0.0`, `--port 17784`. Real proving requires the `prover`
feature — in practice you run the `charms-prover` binary
(`charms-prover server`). See [Run a prover server](/how-to/run-a-prover-server)
and the [Prover API reference](/reference/prover-api).

## `charms completions <SHELL>`

Print shell completions for the given shell (`bash`, `zsh`, `fish`, …). Dynamic
completions are also available via `source <(COMPLETE=zsh charms)`.
