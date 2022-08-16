import { JsonRpcProvider } from "@ethersproject/providers";
import axios, { AxiosResponse } from "axios";

type TenderlyForkRequest = {
  block_number?: number;
  network_id: string;
  transaction_index?: number;
  initial_balance?: number;
  chain_config?: {
    chain_id: number;
    homestead_block: number;
    dao_fork_support: boolean;
    eip_150_block: number;
    eip_150_hash: string;
    eip_155_block: number;
    eip_158_block: number;
    byzantium_block: number;
    constantinople_block: number;
    petersburg_block: number;
    istanbul_block: number;
    berlin_block: number;
  };
};

export type TenderlyForkProvider = {
  provider: JsonRpcProvider;
  id: number;
  blockNumber: number;
  /**
   * map from address to given address' balance
   */
  removeFork: () => Promise<AxiosResponse<any, any>>;
};

export const tenderlyApi = (
  projectSlug: string,
  username: string,
  accessKey: string
) => {
  const somewhereInTenderly = (where: string = projectSlug || "") =>
    axios.create({
      baseURL: `https://api.tenderly.co/api/v1/${where}`,
      headers: {
        "X-Access-Key": accessKey || "",
        "Content-Type": "application/json",
      },
    });

  const inProject = (...path: any[]) =>
    [`account/${username}/project/${projectSlug}`, ...path]
      .join("/")
      .replace("//", "");

  const anAxiosOnTenderly = () => somewhereInTenderly("");
  const axiosOnTenderly = anAxiosOnTenderly();

  // todo: cache these poor axioses
  const axiosInProject = somewhereInTenderly(inProject());

  const removeFork = async (forkId: string) => {
    console.log("Removing test fork", forkId);
    return await axiosOnTenderly.delete(inProject(`fork/${forkId}`));
  };

  async function aTenderlyFork(
    fork: TenderlyForkRequest
  ): Promise<TenderlyForkProvider> {
    const forkResponse = await axiosInProject.post(`/fork`, fork);
    const forkId = forkResponse.data.root_transaction.fork_id;

    const forkProviderUrl = `https://rpc.tenderly.co/fork/${forkId}`;
    const forkProvider = new JsonRpcProvider(forkProviderUrl);

    const bn = (
      forkResponse.data.root_transaction.receipt.blockNumber as string
    ).replace("0x", "");
    const blockNumber: number = Number.parseInt(bn, 16);

    console.info(
      `\nForked with fork id ${forkId} at block number ${blockNumber}`
    );

    console.info(`https://dashboard.tenderly.co/${inProject("fork", forkId)}`);

    console.info("JSON-RPC:", forkProviderUrl);

    return {
      provider: forkProvider,
      blockNumber,
      id: forkId,
      removeFork: () => removeFork(forkId),
    };
  }

  return {
    aTenderlyFork,
  };
};
