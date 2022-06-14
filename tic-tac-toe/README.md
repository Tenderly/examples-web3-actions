
# How to How to Handle On-Chain Events?

This example shows how to listen to on-chain events in Web3 Actions. Events are fired by a Smart Contract representing a tic-tac-toe game, and consumed by Web3 Actions, doing additional processing.

## Running the examples
To run these examples, you need to have Tenderly CLI. If you haven't already, install [Tenderly CLI](https://github.com/Tenderly/tenderly-cli#installation). 

Before you go on, you need to login with CLI, using your Tenderly credentials:

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
