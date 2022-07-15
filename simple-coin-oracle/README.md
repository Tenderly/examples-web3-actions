# How to Build Your Own Oracle Using Web3 Actions?

In this tutorial, we’ll show you how to **build a custom Web3 oracle using Tenderly’s Web3 Actions**. An oracle gathers
data from real-world systems and sends it to the blockchain. It acts as an entry point for streaming data from Web2
applications toward smart contracts.

Using oracles, we can access data from sources outside the blockchain (e.g. exchanges, traffic and weather data, gas
rates, oil prices, etc.) from within our smart contracts.

## Tutorial and explanation

Check out the tutorial and explanation in our [official documentation](https://docs.tenderly.co/web3-actions/how-to-build-a-custom-oracle).

## Running the examples

To run these examples which deploy Web3 Actions, you need to have Tenderly CLI.

## Install Tenderly CLI

If you haven't already, install [Tenderly CLI](https://github.com/Tenderly/tenderly-cli#installation).

Before you go on, you need to log in with CLI, using your Tenderly credentials:

```bash
tenderly login
```

### Install dependencies for Web3 Actions project:

First `cd` into an example you're interested in and `cd actions`. Then run `npm i`:

``` bash
npm install
```

### Build and Run

To build/deploy the actions, `cd` into example you're interested in and then run the CLI.

``` bash
tenderly build  # local build only
tenderly deploy # deploys and activates the action
```