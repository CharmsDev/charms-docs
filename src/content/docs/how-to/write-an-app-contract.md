---
title: Write an app contract
description: "Implement the app_contract predicate that governs your charms."
---

An app's logic is a single Rust function, the **app contract**. This guide shows
how to implement one, starting from the generated template. For the concepts, see
[Apps](/explanation/apps); for the exact API, see the [SDK reference](/reference/sdk).

## Scaffold a project

```sh
charms app new my-token
cd ./my-token
cargo update
```

The template is a working **fungible token managed by a reference NFT**: the
NFT's state records the `remaining` supply, and whoever controls the NFT can mint
tokens by decreasing it.

## The contract

`src/lib.rs` exposes `app_contract`, the predicate that must hold for the
transaction's spell to be correct:

```rust
use charms_sdk::data::{
    charm_values, check, sum_token_amount, App, Data, Transaction, UtxoId, B32, NFT, TOKEN,
};

pub fn app_contract(app: &App, tx: &Transaction, x: &Data, w: &Data) -> bool {
    let empty = Data::empty();
    assert_eq!(x, &empty);          // this app takes no public input
    match app.tag {
        NFT => check!(nft_contract_satisfied(app, tx, w)),
        TOKEN => check!(token_contract_satisfied(app, tx)),
        _ => unreachable!(),
    }
    true
}
```

The arguments are `app` (the app being evaluated), `tx` (the transaction with its
charms), `x` (public input), and `w` (private input/witness). Return `true` to
allow the transaction.

### Minting the NFT

The NFT can be minted only by the party spending a specific UTXO. The contract
takes that UTXO id as its **private input** `w`, and requires that its hash equals
the NFT's `identity` — which is exactly how the `identity` is chosen when minting:

```rust
fn can_mint_nft(nft_app: &App, tx: &Transaction, w: &Data) -> bool {
    let w_str: String = w.value().expect("witness should be a UTXO id string");

    // the NFT's identity is the hash of the UTXO being spent...
    check!(hash(&w_str) == nft_app.identity);
    // ...and that UTXO must actually be an input of this transaction.
    let w_utxo_id = UtxoId::from_str(&w_str).unwrap();
    check!(tx.ins.iter().any(|(utxo_id, _)| utxo_id == &w_utxo_id));

    // exactly one NFT charm out, with the expected structure.
    let nft_charms = charm_values(nft_app, tx.outs.iter()).collect::<Vec<_>>();
    check!(nft_charms.len() == 1);
    check!(nft_charms[0].value::<NftContent>().is_ok());
    true
}
```

### Minting tokens against the NFT's supply

Tokens may be minted only by the amount the managing NFT's `remaining` supply
decreases — a conservation rule:

```rust
fn can_mint_token(token_app: &App, tx: &Transaction) -> bool {
    let nft_app = App { tag: NFT, identity: token_app.identity.clone(), vk: token_app.vk.clone() };

    let incoming = nft_remaining(&nft_app, tx.ins.iter().map(|(_, v)| v));
    let outgoing = nft_remaining(&nft_app, tx.outs.iter());
    check!(incoming >= outgoing);

    let input_amount = sum_token_amount(token_app, tx.ins.iter().map(|(_, v)| v)).unwrap();
    let output_amount = sum_token_amount(token_app, tx.outs.iter()).unwrap();

    // minted tokens == reduction in remaining supply
    output_amount - input_amount == incoming - outgoing
}
```

(See the generated `src/lib.rs` for the full, compiling version.)

## Patterns

- **Dispatch on `app.tag`.** One binary can implement several related apps (here,
  the NFT `n` and its token `t`).
- **`check!(cond)`** returns `false` from the contract early if `cond` fails (and
  logs the failing expression). Prefer it over manual `if/return`.
- **`charm_values(app, charms)`** iterates the `Data` for `app` across inputs,
  outputs, or references. **`sum_token_amount(app, charms)`** sums a token's
  amounts.
- **Public vs private input.** `x` is visible in the spell; `w` is a witness that
  is never published. The template requires `x` to be empty and uses `w` for the
  minting UTXO.
- **Allow simple transfers cheaply.** Moving an NFT or tokens without minting is a
  [simple transfer](/explanation/apps#simple-transfers-need-no-contract) and does
  not run your contract at all — only mint/burn/custom operations do. You can use
  `is_simple_transfer`, `token_amounts_balanced`, and `nft_state_preserved` from
  the SDK when you want to special-case them.

## Build and check

Build the WebAssembly binary:

```sh
app_bin=$(charms app build)
charms app vk $app_bin          # the app's verification key
```

The example spells under `spells/` use environment variables. Test the NFT mint
locally (no proof, no network) — the `app_id` is the SHA-256 of the UTXO you
spend:

```sh
export app_vk=$(charms app vk $app_bin)
export in_utxo_0="d8fa4cdade7ac3dff64047dc73b58591ebe638579881b200d4fea68fc84521f0:0"
export app_id=$(echo -n "${in_utxo_0}" | sha256sum | cut -d' ' -f1)
export dest_0=$(charms util dest --addr tb1p3w06fgh64axkj3uphn4t258ehweccm367vkdhkvz8qzdagjctm8qaw2xyv)
export amount_0=20000

# the raw transaction that produced in_utxo_0 (a prerequisite for checking)
prev_txs=02000000000101a3a4c09a03f771e863517b8169ad6c08784d419e6421015e8c360db5231871eb0200000000fdffffff024331070000000000160014555a971f96c15bd5ef181a140138e3d3c960d6e1204e0000000000002251207c4bb238ab772a2000906f3958ca5f15d3a80d563f17eb4123c5b7c135b128dc0140e3d5a2a8c658ea8a47de425f1d45e429fbd84e68d9f3c7ff9cd36f1968260fa558fe15c39ac2c0096fe076b707625e1ae129e642a53081b177294251b002ddf600000000

cat ./spells/mint-nft.yaml | envsubst | charms spell check \
  --prev-txs=$prev_txs \
  --app-bins=$app_bin \
  --private-inputs=<(cat ./spells/mint-nft-private.yaml | envsubst)
```

If the contract is satisfied, `charms spell check` reports success and the cycles
used. Next, [cast it onto a real transaction](/tutorials/cast-your-first-spell).
