# How to send a Discord message about a new Uniswap Pool?

This tutorial shows you **how to use a Web3 Action to send a message to a Discord channel when a new pool is created on
Uniswap V3**. You can use this Web3 Action to notify your community when something happens on the chain.

## Tutorial and explanation

Check out the tutorial and explanation in our [official documentation](https://docs.tenderly.co/web3-actions/how-to-send-a-discord-message-about-a-new-uniswap-pool).

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
npm test
tenderly build  # local build only
tenderly deploy # deploys and activates the action
```