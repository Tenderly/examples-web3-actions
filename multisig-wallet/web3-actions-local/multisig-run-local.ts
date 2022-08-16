import {
  TestPeriodicEvent,
  TestRuntime,
  TestWebhookEvent,
} from "@tenderly/actions-test";
import { everyDay, onAnEvent, onHook } from "../web3-actions/multisig";

import * as dotenv from "dotenv";
dotenv.config();

/*
 * This is the local run of Action Functions.
 * TestRuntime is a helper class that allows you to run Action Functions locally.
 **/
const main = async () => {
  const testRuntime = new TestRuntime();

  testRuntime.context.secrets.put(
    "multisig.DISCORD_URL",
    process.env.DISCORD_URL || ""
  );

  testRuntime.context.secrets.put(
    "TENDERLY_ACCESS_KEY",
    process.env.TENDERLY_ACCESS_KEY || ""
  );

  await testRuntime.execute(
    onAnEvent,
    require("./payload/payload-submit.json")
  );

  await testRuntime.execute(
    onAnEvent,
    require("./payload/payload-confirm.json")
  );

  await testRuntime.execute(
    onHook,
    new TestWebhookEvent({ txId: 2, who: "reminder0x" })
  );

  await testRuntime.execute(everyDay, new TestPeriodicEvent());

  await testRuntime.execute(
    onAnEvent,
    require("./payload/payload-execute.json")
  );
};

(async () => await main())();
