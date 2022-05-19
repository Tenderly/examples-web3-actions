
# Examples of Tenderly Web3 Actions

Example repository for web3 actions, accompanying tutorials and how-to guides.

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
cd tic-tac-toe/actions
npm install
cd ..
```

### Build and Run 

To build/deploy run, `cd` into example you're interested in and then run the CLI.

``` bash
cd tic-tac-toe
tenderly build  # stays on your machine
tenderly deploy # deploys and activates the action
```


## On examples structure

All examples were generated via

```bash
tenderly actions init
```

Each example root has the following structure:
- It contains `tenderly.yaml`
- It contains relevant smart contracts and a corresponding JSON file (if any are present). 
- It contains `actions` directory you'd get when you initialize Web3 Actions project using Tenderly CLI
    - `actions` is a node project (`package.json`) 
    - `actions` is a typescript project (`tsconfig.json`)
- Examples use `ethers`, which is an arbitrary decision.

## Common plumbing:
What doesn't come out of the box with CLI setup is:
- Support for [ethers.js](https://github.com/ethers-io/ethers.js/) or any other library, you need to add it yourself:

```bash 
cd actions 
npm install --save-dev axios ethers @types/node 
cd ..
```

- Importing contract's JSON file. You have to configure TS for this:
```diff
{
    "compileOnSave": true,
    "compilerOptions": {
        "module": "commonjs",
        "noImplicitReturns": true,
        "noUnusedLocals": true,
        "outDir": "out",
        "sourceMap": true,
        "strict": true,
        "target": "es2020",
+        "resolveJsonModule": true,
+        "esModuleInterop": true
    },
    "include": [
        "**/*"
    ]
}
```
