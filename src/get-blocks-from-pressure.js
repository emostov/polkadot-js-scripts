import { ApiPromise, WsProvider } from '@polkadot/api';
import { formatNumber } from '@polkadot/util';

import getOpts from './get-opts';

const opts = getOpts();
let blockNumber = opts['block-number'] ? parseInt(opts['block-number']) : 0;
const rpcProvider = opts['rpc-provider'] || 'wss://kusama-rpc.polkadot.io';
const pressure = opts['pressure'] ? parseInt(opts['pressure']) : 0;

(async () => {
	const wsProvider = new WsProvider(rpcProvider).clone();
	const api = await ApiPromise.create({ provider: wsProvider });

	const runStart = Date.now();
	let count = 0;

	let store = [];

	console.log('Pressure: ', pressure)


	while (true) {
		const blockStart = Date.now();

		try {
			let temp = []
			const hash1 = await api.rpc.chain.getBlockHash(blockNumber)
			const hash2 = await api.rpc.chain.getBlockHash(blockNumber -1)
			for (let i = 0; i < pressure; i += 1) {
				temp.push(api.query.system.events.at)
			}

			let tempHash;
			store.push(await Promise.all(temp.map((fn) => {
				tempHash = tempHash === hash1 ? hash2 : hash1;
				return fn(tempHash);
			})));

			const events = await api.query.system.events.at(hash1);
			console.log(formatNumber(blockNumber).padStart(10), `${`${Date.now() - blockStart}`.padStart(7)}ms`, events.map(({ event: { data: { method, section } } }) => `${section}.${method}`).join(', '));


		} catch (e) {
			console.log(Array(80).fill('━').join(''))
			console.log('\n\n\n\n')
			console.log(`ERROR at block: ${formatNumber(blockNumber)}`)
			console.log(e)
			console.log('\n\n\n\n')
			process.exit(1)
		}

		blockNumber+=1;
		count+=1;

		if (count % 100 === 0) {
			console.log('\n', `${formatNumber(count).padStart(10)} blocks, ${((Date.now() - runStart) / count).toFixed(2)}ms/block`, '\n');
			store = []
		}
	}

})();