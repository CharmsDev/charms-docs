---
title: Apps
description: "Everything is an app"
sidebar:
  order: 3
---

Charms exist to make programmable tokens (and any other kinds of apps) possible on Bitcoin. 

So, what are Charms apps?

Here's a high level code of such app:

```rust
use charms_sdk::data::{
    check, nft_state_preserved, sum_token_amount, token_amounts_balanced, App, Data, Transaction,
    NFT, TOKEN,
};

pub fn app_contract(app: &App, tx: &Transaction, x: &Data, w: &Data) -> bool {
    let empty = Data::empty();
    assert_eq!(x, &empty); // don't need additional public inputs
    assert_eq!(w, &empty); // don't need private inputs
    match app.tag {
        NFT => {
            check!(nft_contract_satisfied(app, tx))
        }
        TOKEN => {
            check!(token_contract_satisfied(app, tx))
        }
        _ => unreachable!(),
    }
    true
}

fn nft_contract_satisfied(app: &App, tx: &Transaction) -> bool {
    let token_app = &App {
        tag: TOKEN,
        id: app.id.clone(),
        vk_hash: app.vk_hash.clone(),
    };
    check!(nft_state_preserved(app, tx) || can_mint_nft(app, tx) || can_mint_token(&token_app, tx));
    true
}

fn token_contract_satisfied(token_app: &App, tx: &Transaction) -> bool {
    check!(token_amounts_balanced(token_app, tx) || can_mint_token(token_app, tx));
    true
}

// ... `can_mint_nft` and `can_mint_token` implementations ... 
```

Get full example by running:

```sh
charms app new my-tokens
```

`app_contract` is the predicate that needs to be satisfied by the transaction. If all such predicates (for all apps participating in the spell) are satisfied AND all pre-requisite transactions have correct spells, then and only then this transaction's spell is correct.
 