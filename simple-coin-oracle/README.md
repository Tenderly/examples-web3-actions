# How to Build Your Own Oracle Using Web3 Actions?

## Running the examples
To run these examples which deploy Web3 Actions, you need to have Tenderly CLI.

## Install Tenderly CLI
If you haven't already, install [Tenderly CLI](https://github.com/Tenderly/tenderly-cli#installation). 

Before you go on, you need to login with CLI, using your Tenderly credentials:

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