import {
	ActionFn,
	Context,
	Event,
	TransactionEvent,
} from '@tenderly/actions'
import axios from 'axios';
import { ethers } from 'ethers';

import UniswapV3FactoryAbi from './UniswapV3FactoryAbi.json'

export const onPoolCreatedEventEmitted: ActionFn = async (context: Context, event: Event) => {
	try {
		const txEvent = event as TransactionEvent;

		const eventLog = await getPoolCreatedEvent(txEvent);

		const tokensData = await getTokensData(eventLog.token0, eventLog.token1);
		console.log("Received Tokens Data: ", tokensData);

		await notifyDiscord(`${tokensData.token0.name} ↔️ ${tokensData.token1.name}`, context);

	} catch (error) {
		console.error(error);
	}
}

const getPoolCreatedEvent = async (txEvent: TransactionEvent) => {
	const ifc = new ethers.utils.Interface(UniswapV3FactoryAbi);
	const poolCreatedTopic = ifc.getEventTopic("PoolCreated");

	const poolCreatedEventLog = txEvent.logs.find(log => {
		return log.topics.find(topic => topic == poolCreatedTopic) !== undefined
	})

	if (poolCreatedEventLog == undefined) {
		throw Error("PoolCreatedEvent missing")
	}
	return ifc.decodeEventLog("PoolCreated",
		poolCreatedEventLog.data,
		poolCreatedEventLog.topics) as unknown as UniswapPool;
}

const getTokensData = async (token0: string, token1: string) => {
	const tokenFields = `id, name, symbol, totalValueLocked, totalSupply, derivedETH`;
	const theGraphQuery = `
{
	token0: token(id:"${token0.toLowerCase()}"){${tokenFields}},
	token1: token(id:"${token1.toLowerCase()}"){${tokenFields}}
}`;

	const UNISWAP_THE_GRAPH = "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3";
	const resp = await axios.post(UNISWAP_THE_GRAPH, {
		query: theGraphQuery
	});

	return resp.data.data as unknown as {
		token0: UniwswapToken,
		token1: UniwswapToken
	}
}

const notifyDiscord = async (text: string, context: Context) => {
	console.log('Sending to Discord:', `🐥 ${text}`)
	const webhookLink = await context.secrets.get("discord.uniswapChannelWebhook");
	await axios.post(
		webhookLink,
		{
			'content': `🐥 ${text}`
		},
		{
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		}
	);

}

type UniswapPool = {
	token0: string,
	token1: string,
	fee: number,
	tickSpacing: number,
	pool: number
}

type UniwswapToken = {
	id: string,
	name: string,
	symbol: string,
	tokenValueLocked: number,
	totalSupply: number,
	derivedEth: number
}