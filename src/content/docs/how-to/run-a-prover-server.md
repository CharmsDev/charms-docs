---
title: Run a prover server
description: "Build and run charms-prover server, proving with the SP1 Prover Network."
---

The hosted [Prover API](/reference/prover-api) is convenient, but you can run your
own prover — for development, privacy, or control over proving costs. The prover
is the `charms-prover` binary: the same code as the `charms` CLI, built with the
`prover` feature, which enables real [SP1](https://docs.succinct.xyz/) proving.

## Build `charms-prover`

```sh
cargo install charms --locked --bin charms-prover --features prover
```

## Run the server

```sh
charms-prover server                       # binds 0.0.0.0:17784
charms-prover server --ip 127.0.0.1 --port 17784
```

It exposes `POST /spells/prove` and `GET /ready`. Check readiness:

```sh
curl http://localhost:17784/ready          # -> OK
```

Point the `charms` CLI (or your client) at it:

```sh
export CHARMS_PROVE_API_URL=http://localhost:17784/spells/prove
charms spell prove …
```

## Proving backends

The prover proves in two stages — the app/spell-checker proof, then a Groth16
wrapper — and two environment variables select the backend for each:

| Variable | Values | Selects |
| --- | --- | --- |
| `APP_SP1_PROVER` | `cpu`, `network` | The app + spell-checker proof. |
| `SPELL_SP1_PROVER` | `app`, `network` | The Groth16 wrapper. `app` reuses the app backend. |

### Prove with the SP1 Prover Network (recommended)

Generating real Groth16 proofs on CPU is slow; the
[Succinct Prover Network](https://docs.succinct.xyz/) does it for you. Set both
stages to use the network and provide your network key:

```sh
export APP_SP1_PROVER=network
export SPELL_SP1_PROVER=app          # the wrapper reuses the network app backend
export NETWORK_PRIVATE_KEY=0x…       # your Succinct Prover Network private key (required)
# optional — defaults to https://rpc.mainnet.succinct.xyz
# export NETWORK_RPC_URL=https://rpc.mainnet.succinct.xyz

charms-prover server
```

`NETWORK_PRIVATE_KEY` is **required** for network proving: the SP1 SDK looks it
up when it builds the network prover, which happens on the **first proof
request**. The server process starts without it, but the first prove will fail.
It is the key for your Succinct account, which pays for proof requests.

### Prove locally on CPU (no network)

Slow, but needs no account — useful for development:

```sh
export APP_SP1_PROVER=cpu
export SPELL_SP1_PROVER=app
charms-prover server
```

## Optional configuration

| Variable | Purpose |
| --- | --- |
| `REDIS_URL` | Cache proofs and deduplicate concurrent identical requests. Omit to disable. |
| `CHARMS_FEE_SETTINGS` | Path to a YAML file configuring the Charms protocol fee (addresses, rate). |
| `SP1_GPU_SERVICE_URL` | URL of a local SP1 GPU (Moongate) service, if proving on GPU. |
| `RUST_LOG` | Log level, e.g. `info`. |

:::note
For Bitcoin spells with [Scroll](/explanation/scrolls) outputs, a prover *server*
is required (not mock mode): the server calls the Scrolls canister to fill in the
Scroll output addresses while proving.
:::
