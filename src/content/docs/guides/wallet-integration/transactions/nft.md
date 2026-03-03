---
title: NFT Transfers
sidebar:
  order: 2
---

NFT transfer involves sending an NFT charm to a new UTXO. We will cover how to send one NFT charm to a single destination. 

:::note
A transaction can send multiple NFTs to one or more outputs. To achieve that 
1. add apps defining those NFTs, 
2. add inputs with those NFTs to the list of inputs and 
3. add the NFTs to transaction outputs.
:::

## Spell JSON for NFT Transfers

For NFT transfers, the entire charm is sent to a single destination. Here's the Spell JSON structure for an NFT transfer:

```json
{
  "version": 11,
  "tx": {
    "ins": [
      "<source_txid>:<vout>"
    ],
    "outs": [
      {
        "0": {
          <nft_data>
        }
      }
    ],
    "coins": [
      {
        "amount": 1000,
        "dest": "<destination_hex>"
      }
    ]
  },
  "app_public_inputs": {
    "n/<app_id>/<app_vk>": null
  }
}
```

:::note
The simplest case is when the transaction does **not involve** anything beside simple transfers. If it does (e.g. new NFTs are minted or any inputs or outputs contain charms that are neither tokens nor NFTs), the transaction must satisfy the app contracts involved. We will describe how to deal with this in the [Prover API](/guides/wallet-integration/transactions/prover-api) section.
:::

## Key Components

- **`version`**: Must be `11` for Charms `v11.0.1`
- **`app_public_inputs`**: Lists NFT app(s) involved in the spell (`null` for simple transfers)
- **`tx.ins`**: Source UTXO list (`txid:vout`)
- **`tx.outs`**: Destination charm outputs, keyed by app index (`"0"`, `"1"`, ...)
- **`tx.coins`**: Native coin outputs (`amount`, hex-encoded `dest`)

## Implementation Steps

1. **Retrieve Charm Data**: Get the charm's details from the source UTXO
2. **Construct the Spell JSON**: Fill in `tx` and `app_public_inputs` (see [Spell JSON Reference](/references/spell-json))
3. **Add Coin Outputs**: Build `tx.coins` with destination hex (`charms util dest`)
4. **Proceed to Prover API**: Use this JSON in the Prover API call (see [Prover API](/guides/wallet-integration/transactions/prover-api))

## Example

Here's an example of a completed Spell JSON for an NFT transfer:

```json
{
  "version": 11,
  "tx": {
    "ins": [
      "eb711823b50d368c5e0121649e414d78086cad69817b5163e871f7039ac0a4a3:0"
    ],
    "outs": [
      {
        "0": {
          "ticker": "CHARMIX",
          "name": "Panoramix #1",
          "description": "An Ancient magician from the Gallia",
          "image": "https://shorturl.at/KfUka",
          "image_hash": "eb6e19663b72ab41354462cb2d3e03a97a745d0d2874f5d010c9b5c8f2544e9c",
          "url": "https://charms.dev"
        }
      }
    ],
    "coins": [
      {
        "amount": 1000,
        "dest": "2f7e10b8f6e2089b5bb5dcce96e8dd49ca01012f6506af0fe7bf5d2f2f5db531"
      }
    ]
  },
  "app_public_inputs": {
    "n/af50d82d1e47e77ef5d03d1f6a1280eb137c91a51d696edcc0d2cc9351659508/a0029d4e7f8ba7361cde6004561c6209d968bd3686c456504cd0005e19ac1a2f": null
  }
}
```

**Note:** The following fields are (optional) properties of an NFT charm itself (recommended by [CHIP-420](https://github.com/CharmsDev/charms/blob/main/CHIPs/CHIP-0420)):
- **`ticker`**: The ticker or symbol for the charm (e.g., `"ticker": "CHARMIX"`)
- **`name`**: The name of the NFT (e.g., `"name": "Panoramix #1"`)
- `description`: A description of the NFT (e.g., `"description": "An Ancient magician from the Gallia"`)
- **`image`**: A URL to the image of the NFT (e.g., `"image": "https://shorturl.at/KfUka"`)
- **`image_hash`**: A hash of the image for verification (e.g., `"image_hash": "eb6e19663b72ab41354462cb2d3e03a97a745d0d2874f5d010c9b5c8f2544e9c"`)
- **`url`**: A URL for more information about the NFT (e.g., `"url": "https://charms.dev"`)
- (other fields may be added as needed, depending on the app's requirements)

## UI Considerations

When implementing NFT transfers in your wallet UI:

- Clearly display the NFT being transferred
- Show the destination address in a user-friendly format
- Provide transaction fee information
- Include confirmation steps before proceeding
- Display transaction status updates during the process
