import { ActionFn, Context, Event, TransactionEvent } from "@tenderly/actions";

import { ethers } from "ethers";
import axios from "axios";
import CoinOracleContract from "./CoinOracleContract.json";

const CONTRACT_ADDRESS = "0x15aa485ba52ddb7ceb269b2090e45b6a0c42cc5f";

export const coinPrice: ActionFn = async (context: Context, event: Event) => {
    let transactionEvent = event as TransactionEvent;

    const ifc = new ethers.utils.Interface(CoinOracleContract.abi);

    const { data, topics } = transactionEvent.logs[0];
    const priceRequest = ifc.decodeEventLog("RequestCoinPrice", data, topics);
    const price = await getPrice(priceRequest.name);

    const oc = await oracleContract(context, ifc);

    await oc.update(priceRequest.reqId, price, {
        gasLimit: 250000,
        gasPrice: ethers.utils.parseUnits("100", "gwei"),
    });
    console.log(
        `Processed: ${priceRequest.reqId} with price in cents: ${price}`
    );
};

const getPrice = async (coin: string) => {
    const coinInfo = await axios.get(
        `https://api.coingecko.com/api/v3/coins/${coin}`
    );
    return coinInfo.data.market_data.current_price.usd * 100;
};

const oracleContract = async (
    context: Context,
    contractInterface: ethers.utils.Interface
) => {
    const etherscanApiKey = await context.secrets.get("oracle.providerApiKey");

    const provider = ethers.getDefaultProvider(ethers.providers.getNetwork(3), {
        etherscan: etherscanApiKey,
    });

    const oracleWallet = new ethers.Wallet(
        await context.secrets.get("oracle.addressPrivateKey"),
        provider
    );

    const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        contractInterface,
        oracleWallet
    );
    return contract;
};
