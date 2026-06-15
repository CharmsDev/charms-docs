---
title: Display charms
description: "Read and render the charms held by a transaction's outputs."
---

To show charms in a wallet, extract them from the transaction that produced the
UTXO. The `charms-lib` WebAssembly module exposes `extractAndVerifySpell`, which
parses a transaction, verifies its spell proof, and returns the charms.

## Get the WASM module

Use the `charms_lib.wasm` module — available as a
[release artifact](https://github.com/CharmsDev/charms/releases) or built from
[`charms-lib`](https://github.com/CharmsDev/charms/tree/main/charms-lib).

Create JS bindings:

```sh
wasm-bindgen --out-dir target/wasm-bindgen-nodejs --target nodejs path/to/charms_lib.wasm
```

## Extract and verify

Pass a chain-tagged transaction to `extractAndVerifySpell(tx, mock)`:

```js
const wasm = require('./target/wasm-bindgen-nodejs/charms_lib.js');

const tx = { bitcoin: "020000000001…" };   // the raw transaction hex
const spell = wasm.extractAndVerifySpell(tx, false);
console.log(spell);
```

The returned spell describes the charms in the transaction's outputs:

```
{
  version: 15,
  tx: {
    ins: [ '13aa92ea…:1' ],
    outs: [ Map(1) { 0 => 40000000000 } ]
  },
  app_public_inputs: Map(1) {
    't/3d7fe7e4…/c975d4e0…' => undefined
  }
}
```

## What you get

`extractAndVerifySpell(tx, mock)` returns the spell object for the transaction:

- **App specifications** — each app's `tag` (`n` NFT, `t` token, `s` Scroll, or
  custom), 32-byte `identity`, and 32-byte verification key `vk`.
- **Inputs** — the UTXO ids spent.
- **Outputs with charms** — each output maps an app (by index) to its charm
  content: an amount for fungible tokens, or arbitrary data for NFTs and other
  apps.

## Render in the wallet

1. **Scan UTXOs.** For each UTXO, extract charms from the transaction that
   created it.
2. **Parse** the returned spell to get each output's charms.
3. **Render** by type: show an NFT's image and name prominently; show a token's
   amount alongside its name/symbol and image.
4. **Show metadata.** NFTs are recommended (not required) to follow
   [CHIP-0420](https://github.com/CharmsDev/charms/tree/main/CHIPs/CHIP-0420) for
   their content structure (`ticker`, `name`, `image`, …).
