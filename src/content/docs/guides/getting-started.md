---
title: Getting Started
sidebar:
  order: 1
---

Let's get started with Charms! This guide will walk you through building your Charms app in a few minutes.


Make sure you have nightly Rust installed:

```sh
rustup toolchain install nightly
```

## Installation

Install Charms CLI:

```sh
cargo +nightly install charms
```

## Create an app

```sh
charms app new my-tokens
cd ./my-tokens
charms app vk
```

This will print out the verification key (VK) for your new app, that looks something like:

```
8e877d70518a5b28f5221e70bd7ff7692a603f3a26d7076a5253e21c304a354f
```

You will need the VK to use in your [spells](/concepts/spells).

Keep in mind, that the VK will change as you edit your app, so don't forget to run `charms app vk`: it will build your app and generate new VK.

When you're done implementing the app, it can be run against a spell:

```sh
charms app run <./spells/send.yaml
```
The above is supposed to work almost out of the box (provided you replaced the VK with the one produced for your app).

Now that we know that the app contract is correct (to the best of our knowledge), we can go ahead and enchant a real Bitcoin transaction. 