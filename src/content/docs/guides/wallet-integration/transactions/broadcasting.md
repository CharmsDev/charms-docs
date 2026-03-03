---
title: Broadcasting Transactions
sidebar:
  order: 7
---

After signing the spell transaction, it must be broadcast to the Bitcoin network.

## Broadcasting

Send the signed transaction using standard Bitcoin APIs:

```bash
bitcoin-cli sendrawtransaction <signed_spell_tx_hex>
```

## Important Considerations

- **Mempool Acceptance**: The transaction must be accepted into the mempool to ensure proper processing. Validate the transaction before submitting it.
- **Fee Rates**: When proving the spell, use an adequate fee rate (defaults to 2.0 sats per vB) to ensure acceptance to the mempool and ultimately, inclusion in the block. The fee rate is specified in the Prover API request.
