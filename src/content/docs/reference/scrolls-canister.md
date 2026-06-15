---
title: Scrolls canister
description: "The scrolls_bitcoin_v15 Internet Computer canister API."
sidebar:
  order: 5
---

The `scrolls_bitcoin_v15` canister is the Bitcoin signer for Charms v15. It
derives the addresses that [Scroll](/explanation/scrolls) outputs are locked to,
and it signs and broadcasts transactions that spend those outputs — but only when
the transaction carries a valid Charms spell and pays the protocol fee.

| | |
| --- | --- |
| Canister (IC mainnet) | `rpgc6-oqaaa-aaaak-qy3uq-cai` |
| Networks (the `network` arg) | `"main"`, `"testnet4"` |
| Access control | None at the caller level — policy-based (valid spell + fee). |

In normal use you call only two methods: [`addresses`](#addresses) (the prover
does this for you) and [`sign_and_submit`](#sign_and_submit) (to spend a
Scroll-controlled output). See [Spend Scroll outputs](/how-to/spend-scroll-outputs).

## Candid interface

```candid
type Addresses = record {
  script_pubkeys : vec record { nat32; text };  // out_index -> hex(scriptPubKey)
  signature      : text;                        // hex BIP-340 Schnorr signature
};

type SignRequest = record {
  prev_txs        : vec text;   // hex prev txs that created the spent outputs
  sign_inputs     : vec nat32;  // input indexes the canister must sign
  tx_to_sign      : text;       // hex unsigned/partially-signed Bitcoin tx
  v14_sign_inputs : opt vec record { nonce : nat64; index : nat64 };
};

type SignAndSubmitResult = record { txid : text; wtxid : text };

service : {
  addresses       : (text, vec nat32) -> (variant { Ok : Addresses; Err : text });
  sign_and_submit : (text, SignRequest) -> (variant { Ok : SignAndSubmitResult; Err : text });
  verify_spell           : (text, bool) -> (variant { Ok : text; Err : text });
  verify_spell_delegated : (text, bool, nat32, vec text) -> (variant { Ok : text; Err : text });
  config         : () -> (Config) query;
  cycles_balance : () -> (nat) query;
  deposit_cycles : () -> (variant { Ok : nat; Err : text });
}
```

## `sign_and_submit`

```candid
sign_and_submit : (network : text, SignRequest) -> (variant { Ok : SignAndSubmitResult; Err : text });
```

Signs the Scroll-controlled inputs of a transaction, enforces policy, broadcasts
it, and returns the transaction id. **This is the only method a wallet normally
needs to call.**

Given a `network` (`"main"` or `"testnet4"`) and a `SignRequest`, the canister:

1. parses `tx_to_sign` and validates the `sign_inputs` indexes;
2. (optional) delegates any `v14_sign_inputs` to the older v14 canister, so one
   transaction can spend mixed v14/v15 Scroll UTXOs;
3. checks that every input **not** in `sign_inputs` is already signed, and every
   input **in** `sign_inputs` is still unsigned (you sign your own inputs; the
   canister signs only the Scroll inputs);
4. **verifies the spell** carried by `tx_to_sign` — failing if there is none;
5. **checks the fee** — the transaction must pay the configured Scrolls fee
   address at least the required amount;
6. signs each requested input with the threshold key derived for that
   Scroll-controlled output;
7. **broadcasts** the fully-signed transaction (via the mempool.space API);
8. returns `{ txid, wtxid }`.

Re-broadcasting an already-confirmed transaction is idempotent (it succeeds
rather than erroring).

```sh
dfx canister --network ic call rpgc6-oqaaa-aaaak-qy3uq-cai sign_and_submit \
  '("main", record {
      sign_inputs = vec { 0 : nat32 };
      prev_txs = vec { "0200000000…" };
      tx_to_sign = "0200000000…";
      v14_sign_inputs = null;
  })'
```

## `addresses`

```candid
addresses : (tx_in_0 : text, out_is : vec nat32) -> (variant { Ok : Addresses; Err : text });
```

Returns the canister-controlled `scriptPubKey` for each requested output index,
plus a BIP-340 Schnorr **signature** over the map. **The prover calls this
automatically** while building a spell that has Scroll outputs — you rarely call
it yourself.

- `tx_in_0` — the first input (`txid:vout`) of the transaction that will *create*
  the outputs; outputs are derived deterministically from it. (For coinbase
  outputs, use the all-zeros txid with the block height in place of the vout.)
- `out_is` — the output indexes to derive (max 256 per call).
- The returned `script_pubkeys` are raw P2WPKH scripts (`OP_0 <20-byte hash>`)
  that go straight into a Bitcoin output's `dest`. They are **network-independent**
  (identical on `main` and `testnet4`), which is why this method takes no
  `network` argument.

The signature lets the spell proof verify, in-circuit, that these are genuinely
the canister's addresses for the given transaction. This is how a Scroll output
is provably pinned to programmable custody — see
[`fill_scroll_outputs`](/explanation/scrolls#scroll-charms).

## Other methods

| Method | Description |
| --- | --- |
| `verify_spell(tx, mock)` | Extract and verify the spell from a raw Bitcoin tx; returns the normalized spell as hex CBOR. |
| `verify_spell_delegated(tx, mock, spell_version, seen)` | Forward-compatible verification: delegates newer-version spells to the next canister, with cycle detection. |
| `config()` | (query) The canister's configuration (fee addresses, fee parameters). |
| `cycles_balance()` | (query) The canister's cycles balance. |
| `deposit_cycles()` | Top up the canister's cycles (it is designed to be blackholed). |

## Calling the canister

- **`ic-agent` / agent-rs (Rust)** — what the prover uses: build an `Agent`
  against `https://ic0.app`, `Encode!` the args, and `update`/`query` the
  canister, decoding the reply with `Decode!`.
- **`dfx`** — `dfx canister --network ic call rpgc6-oqaaa-aaaak-qy3uq-cai <method> '(<candid>)'`.
- **HTTP** — a Cloudflare Worker (`scrolls-api`) wraps the canister and exposes
  `POST /{network}/sign`, returning `{ txid, wtxid }` as JSON.

There is no per-caller access control: the canister signs for anyone, but only a
transaction that carries a valid spell and pays the fee. Address-derivation
integrity is protected by a canister-private secret prefix and the signed
`addresses` attestation.
