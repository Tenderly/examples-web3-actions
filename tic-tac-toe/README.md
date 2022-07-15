# How to Handle On-Chain Events?

This tutorial will teach you how to **create a serverless backend for your smart contract using Tenderly’s Web3
Actions**. Web3 Actions allow you to run custom code in response to on-chain or off-chain events that are initiated by
your smart contract.

To illustrate how Web3 Actions work, we will build a simple Tic-Tac-Toe game and deploy it to a test network. The smart
contract will be responsible for maintaining the game state while Web3 Actions will be used to monitor changes to the
game.

**Whenever a specific event gets fired from the smart contract, Tenderly will execute your custom code in the form of a
NodeJS project**. The results of the game and the game board will be printed to the console each time a player makes a
move or when the game is over.

## Tutorial and explanation

Check out the tutorial and explanation in our [official documentation](https://docs.tenderly.co/web3-actions/how-to-handle-on-chain-events).

## Running the examples

To run these examples, you need to have Tenderly CLI. If you haven't already, install [Tenderly CLI](https://github.com/Tenderly/tenderly-cli#installation).

Before you go on, you need to log in with CLI, using your Tenderly credentials:

```bash
tenderly login
```

### Install dependencies for Web3 Actions project:

First `cd` into an example you're interested in and `cd actions`. Then run `npm i`:

``` bash
npm install
```

### Test, Build, Deploy

To build/deploy the actions, `cd` into example you're interested in and then run the CLI.

``` bash
npm test
tenderly build  # local build only
tenderly deploy # deploys and activates the action
```
