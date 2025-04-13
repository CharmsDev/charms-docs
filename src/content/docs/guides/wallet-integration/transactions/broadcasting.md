---
title: Broadcasting Transactions
sidebar:
  order: 7
---

After signing the transactions, they must be broadcast to the Bitcoin network.

## Package Submission Requirement

The spell transaction spends one output created by the commit transaction, creating a dependency between them. To handle this dependency:

- **Broadcast both transactions** together **as a package** to ensure they're accepted simultaneously.
- Most wallet libraries offer methods for submitting transaction packages.
- This is functionally equivalent to `bitcoin-cli submitpackage` command.

## Important Considerations

- **Mempool Acceptance**: Both transactions must be accepted into the mempool to ensure proper processing. Therefore, it is a good idea to validate the transactions before submitting them.
- **Fee Rates**: When proving the spell, use an adequate fee rate (defaults to 2.0 sats per vB) to ensure acceptance to the mempool and ultimately, inclusion in the block. The fee rate is specified in the Prover API request.


