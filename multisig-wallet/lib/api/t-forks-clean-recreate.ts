import { readFileSync, writeFileSync } from "fs";
import { tenderlyApi } from "./tenderly-api";
import * as dotenv from "dotenv";

const { aTenderlyFork, removeFork } = tenderlyApi(
  process.env.TENDERLY_PROJECT_SLUG || "",
  process.env.TENDERLY_USERNAME || "",
  process.env.TENDERLY_ACCESS_KEY || ""
);

export type Infra = {
  fork?: {
    name: string;
    id: string;
    url: string;
    chainId: number;
  };
};

(async () => {
  const currentInfra = JSON.parse(
    readFileSync("infra.json").toString()
  ) as unknown as Infra;

  if (currentInfra.fork) {
    await removeFork(currentInfra.fork.id).catch((err) => {
      console.error(err);
    });
  }

  const fork = await aTenderlyFork({
    network_id: currentInfra.fork?.chainId.toString() || "3",
  });

  console.log("Created the fork", fork.id);

  writeFileSync(
    "infra.json",
    JSON.stringify(
      {
        fork: {
          ...currentInfra.fork,
          name: "???",
          id: fork.id,
          url: `https://rpc.tenderly.co/fork/${fork.id}`,
        },
      },
      null,
      2
    )
  );

  writeFileSync("deployments.json", JSON.stringify({ latest: [] }, null, 2));
})().catch(console.error);
