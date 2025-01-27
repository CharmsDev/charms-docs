---
title: Apps
description: "Everything is an app"
sidebar:
  order: 3
---

Charms exist to make programmable assets possible on Bitcoin. 

So, what are Charms apps?

Here's the code structure of such app contract (in Rust):

```rust
use charms_sdk::data::{
    check, nft_state_preserved, sum_token_amount, token_amounts_balanced, App, Data, Transaction,
    NFT, TOKEN,
};

/// The entry point of the app. This function defines the app contract
/// that needs to be satisfied for the transaction spell to be correct.
pub fn app_contract(app: &App, tx: &Transaction, x: &Data, w: &Data) -> bool {
    match app.tag {
        NFT => {
            check!(nft_contract_satisfied(app, tx, x, w))
        }
        TOKEN => {
            check!(token_contract_satisfied(app, tx, x, w))
        }
        _ => unreachable!(),
    }
    true
}

fn nft_contract_satisfied(app: &App, tx: &Transaction, x: &Data, w: &Data) -> bool {
    let token_app = &App {
        tag: TOKEN,
        id: app.id.clone(),
        vk_hash: app.vk_hash.clone(),
    };
    check!(nft_state_preserved(app, tx) || can_mint_nft(app, tx, x, w) || can_mint_token(&token_app, tx, x, w));
    true
}

fn token_contract_satisfied(app: &App, tx: &Transaction, x: &Data, w: &Data) -> bool {
    check!(amounts_balanced(app, tx) || can_mint_token(app, tx, x, w));
    true
}

// ... `can_mint_nft` and `can_mint_token` implementations ... 
```

Get a full working example by running:

```sh
charms app new my-tokens
```

`app_contract` is the predicate that needs to be satisfied by the transaction. If all such predicates (for all apps participating in the spell) are satisfied AND all pre-requisite transactions have correct spells, then and only then this transaction's spell is correct.
 