---
title: Call the Prover API
description: "Generate a spell transaction from client code by calling the Prover API."
---

The [Prover API](/reference/prover-api) turns a spell into a proven,
ready-to-broadcast transaction. This guide calls it from client code (for example
a wallet). For the full request/response contract, see the
[Prover API reference](/reference/prover-api).

## Choose an endpoint

| | URL |
| --- | --- |
| Hosted (default) | `https://v15.charms.dev/spells/prove` |
| Self-hosted | `http://localhost:17784/spells/prove` ([run your own](/how-to/run-a-prover-server)) |

## Build the spell and call the API

Construct the [spell](/reference/spell) object, then `POST` it. The response is a
JSON array; for Bitcoin it contains a single unsigned transaction.

```javascript
const proveApiUrl = 'https://v15.charms.dev/spells/prove';

const spell = {
  version: 15,
  tx: {
    ins: ["eb711823b50d368c5e0121649e414d78086cad69817b5163e871f7039ac0a4a3:0"],
    outs: [{ "0": { ticker: "CHARMIX", name: "Panoramix #1" } }],
    coins: [{ amount: 1000, dest: "5120…" }]   // dest from `charms util dest`
  },
  app_public_inputs: {
    "n/af50d82d…/a0029d4e…": null
  }
};

const requestBody = {
  spell,
  prev_txs: [{ bitcoin: "020000000001…" }],     // tx(s) that produced the inputs
  change_address: "tb1p…",
  fee_rate: 2.0,
  chain: "bitcoin"
};

const response = await fetch(proveApiUrl, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(requestBody),
});

if (!response.ok) {
  // 400 = bad spell/params; 500 = transient prover failure (retry with backoff)
  throw new Error(`prove failed: ${response.status}`);
}

const [tx] = await response.json();   // e.g. { bitcoin: "<unsigned hex>" }
const spellTxHex = tx.bitcoin;
```

## After proving

The returned transaction is **unsigned**. Sign it with the keys for its funding
inputs and broadcast it — see
[Sign and broadcast](/how-to/wallet-integration/sign-and-broadcast):

```sh
bitcoin-cli signrawtransactionwithwallet <spellTxHex>
bitcoin-cli sendrawtransaction <signed_hex>
```

## Tips

- Include every app's binary in `binaries` (or use `--app-bins` from the CLI) for
  anything beyond a [simple transfer](/concepts/apps#simple-transfers-need-no-contract).
- Pass app witnesses in `app_private_inputs` (keyed by app `tag/identity/vk`).
- For [versioned apps](/how-to/manage-app-keys), include `app_signatures`.
- Ensure the funding UTXOs cover the outputs plus fees; pick a `fee_rate`
  appropriate to network conditions.
- Retry `500` responses with backoff; `400` responses indicate a bad request and
  will not succeed on retry.
