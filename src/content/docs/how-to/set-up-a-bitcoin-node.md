---
title: Set up a Bitcoin node
description: "Run a Bitcoin Core node on testnet4 for casting spells."
---

To cast spells on Bitcoin you need a Bitcoin Core node. This guide sets one up on
`testnet4`.

## Bitcoin Core

Bitcoin Core **v28.0 or later** is required (`testnet4` was added in v28.0). A
recent release is recommended — spell transactions carry a larger `OP_RETURN` than
the historical 80-byte standardness limit, and current Bitcoin Core versions
relay them. Install with Homebrew:

```sh
brew install bitcoin
```

Use this configuration (`bitcoin.conf`):

```ini
server=1
testnet4=1
txindex=1
addresstype=bech32m
changetype=bech32m
```

`bitcoin.conf` is usually located at:

- macOS: `~/Library/Application Support/Bitcoin/bitcoin.conf`
- Linux: `~/.bitcoin/bitcoin.conf`

Start `bitcoind` and let it sync.

:::tip
Throughout the docs we assume `bitcoin-cli` is aliased as `b`:

```sh
alias b=bitcoin-cli
```
:::

## Load a wallet

```sh
b createwallet testwallet  # create a wallet (you might already have one)
b loadwallet testwallet    # bitcoind does not load wallets automatically at startup
```

## Get test BTC

Get a new address and fund it from a faucet:

```sh
b getnewaddress            # prints a new address
```

Visit <https://mempool.space/testnet4/faucet> and send test BTC to that address.
Get at least **50,000 sats** (0.0005 test BTC). Aim for **more than one UTXO** —
tap the faucet a few times, or send sats within your own wallet so you have some
small UTXOs and at least one larger one (≥ 10,000 sats).

## jq

Several examples use `jq`:

```sh
brew install jq
```

## Next steps

- [Cast your first spell](/tutorials/cast-your-first-spell) — prove, sign, and
  broadcast on `testnet4`.
