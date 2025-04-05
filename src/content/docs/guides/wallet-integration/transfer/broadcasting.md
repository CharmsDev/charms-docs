---
title: Broadcasting Transactions
sidebar:
  order: 7
---

After signing the transactions, they must be broadcast to the Bitcoin network. This guide provides the essential information for broadcasting Charms transactions.

## Package Submission Requirement

The spell transaction spends outputs created by the commit transaction, creating a dependency between them. To handle this dependency:

- **Broadcast both transactions together** as a package to ensure they're accepted simultaneously
- Most wallet libraries offer methods for submitting dependent transactions
- This approach is conceptually similar to Bitcoin Core's "submitpackage" functionality

## Important Considerations

- **Mempool Acceptance**: Both transactions must be accepted into the mempool to ensure proper processing
- **Fee Rates**: Ensure both transactions have appropriate fee rates to prevent one from being confirmed while the other remains in the mempool


