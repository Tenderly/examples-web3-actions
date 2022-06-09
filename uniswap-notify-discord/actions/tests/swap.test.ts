import * as TActions from "@tenderly/actions-test";
import { onPoolCreatedEventEmitted } from "../uniswapActions";
import moxios from "moxios";
import CreatePoolEventPayload from "./fixtures/createPoolEventPayload.json";
import { expect } from "chai";

describe("Uniswap", () => {
  beforeEach(() => {
    moxios.install();
  });

  afterEach(() => {
    moxios.uninstall();
  });

  it("sends to discord when a pair created event happens on chain", (done) => {
    const runtime = new TActions.TestRuntime();
    const txEventCreatePool =
      CreatePoolEventPayload as TActions.TestTransactionEvent;
    const DISCORD_WEBHOOK = "https://mock.discord.webhook"; // any unique URI will do, we'll stub this request

    runtime.context.secrets.put(
      "discord.uniswapChannelWebhook",
      DISCORD_WEBHOOK
    );

    stubTheGraphResponse();

    // invoke the runtime
    runtime.execute(onPoolCreatedEventEmitted, txEventCreatePool);

    // wait a bit and then check if Discord got the expected message
    setTimeout(() => {
      //
      const discordData = JSON.parse(
        moxios.requests.get("post", DISCORD_WEBHOOK).config.data
      );
      expect(discordData).to.deep.equal({
        content: "🐥 USD Coin IN TEST ↔️ Wrapped Ether IN TEST",
      });
      done();
    }, 500);
  });

  function stubTheGraphResponse() {
    // stub the uniswap response. The content is really irrelevant here because we're just asserting
    // the right data is sent to Discord
    moxios.stubRequest(
      "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
      {
        response: {
          data: {
            token0: {
              id: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
              name: "USD Coin IN TEST", // added this to ensure (mocked) response is properly used
              symbol: "USDC",
              totalValueLocked: "978550777.498939",
              totalSupply: "19312",
              derivedETH: "0.0005595934721935152103857830042930448",
            },
            token1: {
              id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
              name: "Wrapped Ether IN TEST",
              symbol: "WETH",
              totalValueLocked: "597555.62451452980569386",
              totalSupply: "19848",
              derivedETH: "1",
            },
          },
        },
        status: 200,
      }
    );
  }
});
