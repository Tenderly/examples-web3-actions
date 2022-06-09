import * as TActions from "@tenderly/actions-test";
import { onPoolCreatedEventEmitted } from "./uniswapActions";
import CreatePoolEventPayload from "./tests/fixtures/createPoolEventPayload.json";

const runtime = new TActions.TestRuntime();
const txEventCreatePool =
  CreatePoolEventPayload as TActions.TestTransactionEvent;

const DISCORD_WEBHOOK = process.env.DISCORD_WEBHOOK || "";
runtime.context.secrets.put("discord.uniswapChannelWebhook", DISCORD_WEBHOOK);
runtime.execute(onPoolCreatedEventEmitted, txEventCreatePool);
