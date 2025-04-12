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
  "version": 2,
  "apps": {
    "$00": "n/<app_id>/<app_vk>"
  },
  "ins": [
    {
      "utxo_id": "<source_txid>:<vout>",
      "charms": {
        "$00": {
          <nft_data>
        }
      }
    }
  ],
  "outs": [
    {
      "address": "<destination_address>",
      "charms": {
        "$00": {
          <nft_data>
        }
      },
      "sats": 1000
    }
  ]
}
```

:::note
The simplest case is when the transaction does **not involve** anything beside simple transfers. If it does (e.g. new NFTs are minted or any inputs or outputs contain charms that are neither tokens nor NFTs), the transaction must satisfy the app contracts involved. We will describe how to deal with this in the [Prover API](/guides/wallet-integration/transactions/prover-api) section.
:::

## Key Components

- **`version`**: Must be set to 2 for the current protocol
- **`apps`**: Lists app specifications (each NFT is an app)
- **`ins`**: Specifies the source UTXO(s): 
  - **`utxo_id`**: The transaction ID and output index (txid:vout) of the source UTXO
  - **`charms`** (optional): Contains the NFTs being transferred. Optional: it's there for developer convenience, the Charms prover doesn't need it.
- **`outs`**: Defines destination output(s):
  - **`address`**: The destination address for the tranferred NFT
  - **`charms`**: Describes charms (in this case, the transferred NFTs) being created in the output
  - **`sats`**: The amount of satoshis for the output (optional, defaults to 1000)

## Implementation Steps

1. **Retrieve Charm Data**: Get the charm's details from the source UTXO
2. **Construct the Spell JSON**: Fill in the template with the specific NFT data (see [Spell JSON Reference](/references/spell-json))
3. **Validate the JSON**: Ensure all required fields are present and correctly formatted
4. **Proceed to Prover API**: Use this JSON in the Prover API call (see [Prover API](/guides/wallet-integration/transactions/prover-api))

## Example

Here's an example of a completed Spell JSON for an NFT transfer:

```json
{
  "version": 2,
  "apps": {
    "$00": "n/af50d82d1e47e77ef5d03d1f6a1280eb137c91a51d696edcc0d2cc9351659508/a0029d4e7f8ba7361cde6004561c6209d968bd3686c456504cd0005e19ac1a2f"
  },
  "ins": [
    {
      "utxo_id": "eb711823b50d368c5e0121649e414d78086cad69817b5163e871f7039ac0a4a3:0",
      "charms": {
        "$00": {
          "ticker": "CHARMIX",
          "name": "Panoramix #1",
          "description": "An Ancient magician from the Gallia",
          "image": "https://shorturl.at/KfUka",
          "image_hash": "eb6e19663b72ab41354462cb2d3e03a97a745d0d2874f5d010c9b5c8f2544e9c",
          "url": "https://charms.dev"
        }
      }
    }
  ],
  "outs": [
    {
      "address": "tb1pvlvth530kvcth207u2mw7366pj8aezlvx35866k0g9mx7cf48r9q6yjsqr",
      "charms": {
        "$00": {
          "ticker": "CHARMIX",
          "name": "Panoramix #1",
          "description": "An Ancient magician from the Gallia",
          "image": "https://shorturl.at/KfUka",
          "image_hash": "eb6e19663b72ab41354462cb2d3e03a97a745d0d2874f5d010c9b5c8f2544e9c",
          "url": "https://charms.dev"
        }
      }
    }
  ]
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
