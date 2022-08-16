import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import * as tdly from "@tenderly/hardhat-tenderly";
import { tenderlyNetwork } from "hardhat";
import { readFileSync } from "fs";
import { Infra as ForkInfra } from "./lib/api/t-forks-clean-recreate";

tdly.setup({ automaticVerifications: true });

const loadInfra = () =>
  JSON.parse(readFileSync("infra.json").toString()) as unknown as ForkInfra;

dotenv.config();

const infra = loadInfra();
const fork = infra.fork;

const ACCOUNTS = [
  process.env.ROPSTEN_PRIVATE_KEY_1 || "",
  process.env.ROPSTEN_PRIVATE_KEY_2 || "",
  process.env.ROPSTEN_PRIVATE_KEY_3 || "",
];

const config: HardhatUserConfig = {
  solidity: "0.8.9",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL,
      accounts: ACCOUNTS,
    },
    tenderly: {
      url: fork?.url || "",
      chainId: fork?.chainId,
    },
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT_SLUG || "",
    username: process.env.TENDERLY_USERNAME || "",
    privateVerification: true,
  },
};

export default config;
