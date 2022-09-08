import {
  ActionFn,
  Context,
  Event,
  TransactionEvent,
  WebhookEvent,
} from "@tenderly/actions";
import axios from "axios";
import { BigNumber, BytesLike, ethers } from "ethers";
import { LogDescription } from "ethers/lib/utils";
import { abi as MultisigAbi } from "./abi/MultiSigWallet.json";
import { abi as TokenAbi } from "./abi/Token.json";
import { tenderlyApi } from "./tenderly-api";

const KEY_STORE_SUBMITTED_TX = "multisig.submitted";

/** TODO: Update with proper username, project etc */
const TENDERLY_USERNAME = "nenad";
const TENDERLY_PROJECT_SLUG = "demo-encode-eth-safari";

const MULTISIG_WALLET_ADDRESS = "0xcea103d9d4040acd684e0e2f2d992ff7d3ea62c4";
const MULTISIG_TOKEN_ADDRESS = "0x453dd88556bcfad1063ea0efa8c6155c2f22ee7d";

type SubmittedTx = {
  owner: string;
  txIndex: BigNumber;
  from: string;
  to: string;
  value: BigNumber;
  data: BytesLike;
  input: BytesLike;
};

/**
 * Web3 Action responding to all events from the multisig contract.
 * It stores every submitted transaction in Action storage.
 * Other actions can use this to simulate the transaction later on.
 *
 * @param context the context of the action function (provided by Tenderly Web3 Actions Runtime)
 * @param event The Action Event that triggered this action function - TransactionEvent.
 * @returns nothing
 */
export const onAnEvent: ActionFn = async (context: Context, event: Event) => {
  const transactionEvent = event as TransactionEvent;

  // obtain the Event from TX
  let iface = new ethers.utils.Interface(MultisigAbi);
  const parsedLogs = transactionEvent.logs.map((log) => iface.parseLog(log));
  const txEvent = parsedLogs[0];

  // tracks all submitted transactions
  const submittedTxs = await loadSubmittedTransactions(context);

  switch (txEvent.name) {
    case "TxSubmission":
      const submitted = extractSubmittedTx(txEvent, transactionEvent);

      submittedTxs.txs.push(submitted);
      await context.storage.putJson(KEY_STORE_SUBMITTED_TX, submittedTxs);

      await simulateAndSendToDiscord(context, submitted);

      break;

    case "TxConfirmation":
      await toDiscord(context, "🛎", "confirmed by" + transactionEvent.from);
      break;

    case "ExecuteTransaction":
      const txIndex = txEvent.args.txIndex;
      console.log("TX Executed " + txIndex);
      submittedTxs.txs = submittedTxs.txs.filter(
        (tx) => tx.txIndex == txEvent.args.txIndex
      );

      await context.storage.putJson(KEY_STORE_SUBMITTED_TX, submittedTxs);
      await toDiscord(context, "💸", "confirmed by" + transactionEvent.from);
      break;
  }
  return;
};

/**
 * Simulates the transaction submitted to Multisig on the Tenderly fork.
 * @param submitted the submitted transaction to simulate
 * @returns difference in token balance prior and after the transaction
 */
async function simulateOnFork(context: Context, submitted: SubmittedTx) {
  // create a fork new fork with the freshest data from the network - using the DIY lib until an official SDK jumps in
  const myApi = tenderlyApi(
    TENDERLY_PROJECT_SLUG,
    TENDERLY_USERNAME,
    // TODO: add the TENDERLY_ACCESS_KEY to the secrets in the dashboard
    await context.secrets.get("TENDERLY_ACCESS_KEY")
  );
  const fork = await myApi.aTenderlyFork({ network_id: "3" });

  const ethersOnFork = fork.provider; // just grab the provider

  const tokenOnFork = new ethers.Contract(
    MULTISIG_TOKEN_ADDRESS,
    TokenAbi,
    ethersOnFork.getSigner()
  );

  const initialBalance = (await tokenOnFork.balanceOf(
    MULTISIG_WALLET_ADDRESS
  )) as BigNumber;

  await ethersOnFork.send("tenderly_setBalance", [
    [MULTISIG_WALLET_ADDRESS],
    ethers.utils.hexValue(ethers.utils.parseUnits("10", "ether")),
  ]);

  const tx = {
    to: submitted.to,
    from: MULTISIG_WALLET_ADDRESS,
    data: submitted.data,
    value: BigNumber.from(submitted.value).toHexString(),
  };

  // send the TX
  await ethersOnFork.send("eth_sendTransaction", [tx]);

  const balance = (await tokenOnFork.balanceOf(
    MULTISIG_WALLET_ADDRESS
  )) as BigNumber;

  console.log("Balances", { initialBalance, balance });

  await fork.removeFork(); // remove the fork. For debugging purposes leave it in place

  return { changeInBalance: balance.sub(initialBalance) };
}

/**
 * Web-hook based Web3 Action
 * @param context
 * @param event
 */
export const onHook: ActionFn = async (context: Context, event: Event) => {
  const evt = event as WebhookEvent;
  await toDiscord(
    context,
    "🛎",
    `${evt.payload.who} is reminding you to check out TX with IDX ${evt.payload.txId}`
  );
};

/**
 * Periodic Web3 Action: daily simulation of unexecuted transactions
 * @param context
 * @param event
 */
export const everyDay: ActionFn = async (context: Context, _: Event) => {
  const stored = await loadSubmittedTransactions(context);
  await toDiscord(context, "🛎", "Daily simulations");
  await Promise.all(
    stored.txs.map((tx) => simulateAndSendToDiscord(context, tx))
  );
};

function extractSubmittedTx(
  txEvent: LogDescription,
  actionEvent: TransactionEvent
): SubmittedTx {
  return {
    owner: txEvent.args.owner,
    txIndex: txEvent.args.txIndex,
    from: txEvent.args.from,
    to: txEvent.args.to,
    value: txEvent.args.value,
    data: txEvent.args.data,
    input: actionEvent.input,
  };
}

const simulateAndSendToDiscord = async (
  context: Context,
  submitted: SubmittedTx
) => {
  const simRes = await simulateOnFork(context, submitted);

  await toDiscord(
    context,
    simRes.changeInBalance.gt(0) ? "🟢" : "🔴",
    `W3A simulated TX idx = ${submitted.txIndex.toString()}`,
    simRes
  );
};

async function loadSubmittedTransactions(context: Context) {
  const stored: { txs: SubmittedTx[] } = await context.storage.getJson(
    KEY_STORE_SUBMITTED_TX
  );
  if (!stored.txs) {
    stored.txs = [];
  }
  return {
    txs: stored.txs.map((tx) => ({
      ...tx,
      value: BigNumber.from(tx.value),
      txIndex: BigNumber.from(tx.txIndex),
    })),
  };
}

async function toDiscord(
  context: Context,
  howItWent: "🟢" | "🔴" | "🛎" | "💸",
  activity: string,
  data?: any
) {
  const body = !!data ? "```" + JSON.stringify(data, null, 2) + "```" : "";

  // TODO: add multisig.DISCORD_URL to the secrets in the dashboard
  const discordUrl = await context.secrets.get("multisig.DISCORD_URL");
  console.log(discordUrl); //  **********
  await axios.post(discordUrl, {
    content: `${howItWent} ${activity} ${body}`,
  });
}
