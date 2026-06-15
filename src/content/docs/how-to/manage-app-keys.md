---
title: Manage app keys and signatures
description: "Use versioned apps: generate a key, sign binaries, and verify them."
---

By default a Charms app is **immutable**: its verification key is the hash of one
exact Wasm binary, so the code can never change. A **versioned app** instead pins
its verification key to a *signing key*, letting you upgrade the binary over time
by signing each new version. This guide covers the versioned-app workflow. For
the trade-offs, see
[Apps](/explanation/apps#immutable-and-versioned-apps).

## When to use a versioned app

- **Immutable app** — maximally trustless; the binary is frozen forever. Good for
  assets that must never change rules. `vk = SHA-256(wasm)`.
- **Versioned app** — upgradeable; holders trust the key-holder to authorize
  binaries. Good for apps you expect to evolve. `vk = SHA-256(public_key)`.

## Generate a signing key

```sh
charms app keygen
```

This writes a BIP-340 keypair to `.charms/app-key.json` (mode `0600`; it refuses
to overwrite). The file contains `{ public_key, secret_key, vk }`, where the
app's verification key is `vk = SHA-256(public_key)`.

:::caution
Keep `secret_key` private — it is the authority to authorize new app binaries.
The `.charms/` directory is git-ignored by the template.
:::

Get the versioned app's `vk`:

```sh
charms app vk --pubkey .charms/app-key.json
```

## Sign a binary

`charms app build` **auto-signs**: when `.charms/app-key.json` exists, building
the app also signs the fresh Wasm and writes the signature next to it as
`<wasm-path>.sig.yaml`.

To sign explicitly:

```sh
charms app sign                 # uses .charms/app-key.json and the release build
# or
charms app sign --key .charms/app-key.json --bin path/to/app.wasm --out app.sig.yaml
```

A `.yaml`/`.yml` output is a `vk -> AppSignature` map; any other extension writes
a single JSON `AppSignature`. Each signature is a Schnorr signature over the
binary's `SHA-256`, declaring its version.

## Verify a binary

```sh
charms app verify               # verifies <wasm>.sig.yaml against the build
# or
charms app verify --bin path/to/app.wasm --sig app.sig.yaml
```

Verification checks that each signature's `SHA-256(public_key)` equals its `vk`
key and that the Schnorr signature over the binary hash is valid.

## Use signatures when proving

A spell that uses a versioned app must carry a signature for it. Pass the
`.sig.yaml` to checking and proving:

```sh
charms spell prove \
  --app-bins=$app_bin \
  --app-signatures=app.sig.yaml \
  …
```

In a [Prover API](/reference/prover-api) request, supply these as the
`app_signatures` field, keyed by app `vk`. The runtime also checks that the
binary's exported `__app_version` matches the version recorded in the spell — so
declare your version in the app with `charms_sdk::app_version!(N)`.
