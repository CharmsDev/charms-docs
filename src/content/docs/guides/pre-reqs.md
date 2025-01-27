---
title: Pre-Requisites
sidebar:
  order: 0
---

### Bitcoin Core

Bitcoin Core v28.0 or later is required (we're going to use `testnet4`). You can install it with Homebrew:

```sh
brew install bitcoin
```

This guide assumes a bitcoin node running with the following configuration (`bitcoin.conf`):

```
server=1
testnet4=1
txindex=1
addresstype=bech32m
changetype=bech32m
```

`bitcoin.conf` is usually located at:
- macOS: `~/Library/Application Support/Bitcoin/bitcoin.conf`,
- Linux: `~/.bitcoin/bitcoin.conf`.

**Important:** we assume `bitcoin-cli` is aliased as `b`:

```sh
alias b=bitcoin-cli
```

Make sure you have a wallet loaded:

```sh
b createwallet testwallet  # create a wallet (you might already have one)
b loadwallet testwallet    # load the wallet (bitcoind doesn't do it automatically when it starts)
```

### Test BTC

Get some test BTC:

```sh
b getnewaddress # prints out a new address associated with your wallet
```

Visit https://mempool.space/testnet4/faucet and get some test BTC to the address you just created. Get at least 50000
sats (0.0005 (test) BTC). Also, get more than one UTXO, so either tap the faucet more than once or send some sats within
your wallet to get some small UTXOs and at least one larger one (>= 10000 sats).

### jq

You will also need to have `jq` installed:

```sh
brew install jq
```
