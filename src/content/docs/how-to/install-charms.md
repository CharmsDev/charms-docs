---
title: Install Charms
description: "Install the charms CLI and its prerequisites."
---

This guide installs the `charms` command-line tool. To run your own prover, see
[Run a prover server](/how-to/run-a-prover-server) instead (it builds the
`charms-prover` binary).

## Prerequisites

- **[Rust](https://rust-lang.org/)** 1.94 or later (stable toolchain, via
  [rustup](https://rustup.rs/)). Charms v15 and its app template use Rust edition
  2024.
- The **Protocol Buffers compiler `protoc`** —
  [`protobuf`](https://protobuf.dev/downloads/):

  ```sh
  brew install protobuf      # macOS
  # or: apt-get install protobuf-compiler
  ```

- The **WebAssembly target** used to build apps:

  ```sh
  rustup target add wasm32-wasip1
  ```

## Install the CLI

```sh
## important to have this end with `/target` (a dependency issue)
export CARGO_TARGET_DIR=$(mktemp -d)/target
cargo install --locked charms
```

## Verify

```sh
charms spell vk
```

This prints the spell verification key as JSON, including the protocol version:

```json
{ "prover": false, "version": 15, "vk": "00425796f4c4fa050043eee14d801b4f935244e44aad6a28de0cd5cb3de0ae52" }
```

## Next steps

- [Build a Charms app](/tutorials/build-a-charms-app) — the tutorial.
- [Set up a Bitcoin node](/how-to/set-up-a-bitcoin-node) — needed to broadcast
  spells on `testnet4`.
- [CLI reference](/reference/cli) — every command and option.
