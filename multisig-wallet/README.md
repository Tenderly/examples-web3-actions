# Web3 Actions + Multisig wallet

This repository shows usage of Web3 Actions running with a simple [multisig wallet](contracts/MultiSigWallet.sol).

The Web3 Action `multisig` is ran when a transaction emits one of following events:

- **TxSubmission**: run a simulation on a fork and send a message to Discord about the results
- **TxConfirmation**: send a message to Discord
- **ExecuteTransaction**: send a message to Discord

# Prerequisites:

- Tenderly [CLI installed](https://github.com/Tenderly/tenderly-cli#installation)
  and [logged in via CLI](https://github.com/Tenderly/tenderly-cli#login).

# Running the example

The Web3 Actions code is located in `web3-actions` folder. You can specify this when running `tenderly actions init`.

To run the example, you can either use [pre-deployed and Tenderly-verified contracts](#1a-using-pre-deployed-contracts)
or spare some time to [deploy your own contracts](#1b-deploy-your-own-contracts). Follow the rest of instructions to run
the example.

## 0: Configuration for Web3 Actions project

**▶️ Action** First thing's first, install npm dependencies and ⏳.

```bash
yarn
cd web3-actions && yarn && cd ..
```

Note: The Web3 Actions project is an NPM project.

## 1A: Using pre-deployed contracts

To save some time and to manually run Web 3 Actions from Tenderly Dashboard, you can use pre-deployed contracts listed
below.

These include a single approved and executed transaction you can use for running [Web3](https://google.com) Actions.

The contracts are deployed on **Ropsten** at the follwing addresses:

| Contract                                                                                                    | Address                                      |
| ----------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| [MultisigWallet](https://dashboard.tenderly.co/contract/ropsten/0x6794b4635e094982ed890f8b5fd57a45227d4a98) | `0x6794b4635e094982ed890f8b5fd57a45227d4a98` |
| [Token](https://dashboard.tenderly.co/contract/ropsten/0x945b7c7178abd5936db09186b58a789d8308b876)          | `0x945b7c7178abd5936db09186b58a789d8308b876` |

**▶️ Action**: Add the contracts (addresses and links below) to your project in Tenderly. Click the links in the table to open the Dashboard and then click "Add to Project". As soon as you add the
contracts, the transactions will be shown in **Transactions** page.

Transactions executed on these contracts:

| Action    | TX Hash                                                              |
| --------- | -------------------------------------------------------------------- |
| Submit    | `0xa71c273fd5e3b92b4ade35d284995504aed53fb3e6673fe4f5fcec045c75e77a` |
| Confirm 1 | `0x6f08c6803a470039b73072a9dc34d69dcd0261fab29ac4cbcb02bb87daf96aa9` |
| Confirm 2 | `0xf4c527efb784ac58b8c7a4483f00a07a687ecc4b8f38c6cbf9f95dd0f695cfb5` |
| Execute   | `0x9ae0ec902fa209c60ffa10ecaf0446dbccd36a02e33d18f16bc182e57de94ac4` |

You can use these TX hashes to run Web3 Actions manually from the Dashboard. Skip
to [Deploying Web3 Actions](#3-deploying-web3-actions).

Note: since the contracts are deployed with a pre-defined list of owners, you can simulate transactions, but you can't
submit, approve or execute any of these transactions on Ropsten.

## 1B: Deploy your own contracts

If you want to run Web3 Actions on your own contracts, you can deploy them manually. For this example, we will use
the [Ropsten testnet](https://ropsten.etherscan.io/).

0. **▶️ Action**: Set up a hardhat project .env file and replace placeholders. Source
   the [demo-setup-scripts/init-env-hardhat.sh](demo-setup-scripts/init-env-hardhat.sh) script and replace the
   placeholders.

```bash
source demo-setup-scripts/init-env-hardhat.sh
```

1. **▶️ Action**: Deploy the Contracts to Ropsten. Use shorthand script `yarn deploy:ropsten`. Hardhat project is set
   up
   with [Tenderly Hardhat Plugin automatic contract verification](https://github.com/Tenderly/hardhat-tenderly#automatic-verification)
   so your contracts are verified automatically as they're deployed
2. **▶️ Action**: Run a first set of transactions: submit 1 tx to multisig, do two approvals and optionally execute it.
   Use the script `yarn multisig-play:ropsten`.
3. **▶️ Action**: Copy the address of Multisig from deployment step (also found in `deployments.json`) and paste it
   into `tenderly.yaml` in place of `MULTISIG_ADDRESS` placeholder.

## 2: Run it locally

Before deploying the action to Tenderly, you can test it out locally.

```bash
source demo-setup-scripts/init-env-hardhat.sh
yarn multisig-local
```

👾 You should get several Discord messages and see some meaningful output. If all went well, you can go on and deploy the
action to Tenderly.

The file `web3-actions/multisig-local.js` is a simple script that runs Web3 Actions locally,
using [@tenderly/actions-test](https://github.com/Tenderly/tenderly-actions).

It requires Transaction payload to be passed as an argument. In the [web3-actions/payload](web3-actions/payload/)
directory you'll find JSON file corresponding to an example transactions that submit, approve and execute a multisig
transaction. For running locally, it's fine to use the provided ones.

## 3: Deploying Web3 Actions

**▶️ Action**: Open `tenderly.yaml` and replace placeholders with your [Username](https://docs.tenderly.co/other/platform-access/how-to-find-the-project-slug-username-and-organization-name)
and [Project Slug](https://docs.tenderly.co/other/platform-access/how-to-find-the-project-slug-username-and-organization-name).

**▶️ Action**: Go to Tenderly Dashboard, open **Actions** and click **Secrets**. Add:

1. `TENDERLY_ACCESS_KEY` [following these instructions](https://docs.tenderly.co/other/platform-access/how-to-generate-api-access-tokens).
2. `multisig.DISCORD_URL`

**▶️ Action**: Go to [web3-actions/multisig.ts](multisig.ts) and replace the placeholders at the top with appropriate values.

You can either use contract addresses of pre-deployed contracts or your own
**▶️ Action**: From directory containing `tenderly.yaml` (the root of this example project), run

```bash
    tenderly actions deploy
```

## 4: Manually triggering Web3 Actions:

**▶️ Action**: From the Web3 Actions page:

1. open the `multisig` action
2. click **Manual Run**
3. copy TX hash either from Tenderly Dashboard or from the table
   in [1A: Using pre-deployed contracts](#1a-using-pre-deployed-contracts)
4. paste the hash of transaction
5. select **Copy on write** storage option
6. click **⚡️ Trigger** button at the bottom of the page. Your Web3 Action should run, your Discord should receive a
   message

## 5: Trying it out with real-time transactions

If you deployed your own contracts in step [1B: Deploy your own contracts](#1b-deploy-your-own-contracts), you can run
the `multisig-play` script. Your Web3 Actions should pick up on the new transactions and run accordingly.

```bash
    tenderly actions multisig-play:ropsten
```

## Misc

- the `deployments.json` keeps track of deployed contracts so these can be easier to find in run scripts: `multisig-play.ts`.
- When re-deploying, clean the `deployments.json` so the array is empty:

```json
{
  "latest": []
}
```
