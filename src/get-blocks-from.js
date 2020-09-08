import { ApiPromise, WsProvider } from '@polkadot/api';
import { formatNumber } from '@polkadot/util';

import getOpts from './get-opts';

const opts = getOpts();
let blockNumber = opts['block-number'] ? parseInt(opts['block-number']) : 0;
const rpcProvider = opts['rpc-provider'] || 'wss://kusama-rpc.polkadot.io';
const connections = opts['connections'] ? parseInt(opts['connections']) : 1;

const undeclared = [];
(async () => {
	const wsProvider = new WsProvider(rpcProvider)
	for(let i = 0; i < connections; i += 1) {
		undeclared.push(ApiPromise.create);
	}

	const apis = await Promise.all(undeclared.map((create) => create({provider: wsProvider.clone()})));

	const runStart = Date.now();
	let count = 0;
	let store = [];
	while (true) {
		const blockStart = Date.now();

		try {
			const hash = await apis[0].rpc.chain.getBlockHash(blockNumber)

			const requests = apis.map((a) => a.query.system.events.at)

			const results = await Promise.all(requests.map((fn) => fn(hash)));

			results.forEach((events, idx) =>
				console.log(formatNumber(blockNumber).padStart(10), `(api #${idx})${`${Date.now() - blockStart}`.padStart(7)}ms`, events.map(({ event: { data: { method, section } } }) => `${section}.${method}`).join(', '))
			);


		} catch (e) {
			console.log(Array(80).fill('━').join(''))
			console.log('\n\n\n\n')
			console.log(`ERROR at block: ${formatNumber(blockNumber)}`)
			console.log(e)
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