// Derived from Apps-Rendering
// https://github.com/guardian/apps-rendering/blob/986336e5970154754f4f9a294961a4e17569667b/src/server/decoders.ts
// ----- Imports ----- //

import { TBufferedTransport, TCompactProtocol, TProtocol, TTransport } from 'thrift';
import { SearchResponseSerde } from '@guardian/content-api-models/v1/searchResponse';

// ----- Types ----- //

interface ThriftDecoder<A> {
	read(p: TProtocol): A;
}

// ----- Functions ----- //

async function toTransport(buffer: Buffer): Promise<TTransport> {
	return new Promise((resolve, _) => {
		const writer = TBufferedTransport.receiver((transport, _) => {
			resolve(transport);
		}, 0);
		writer(buffer);
	});
}

const decodeContent = <A>(decoder: ThriftDecoder<A>) => async (
	content: Buffer | undefined,
): Promise<A> => {
	if (content) {
		const transport = await toTransport(content);
		const protocol = new TCompactProtocol(transport);

		return decoder.read(protocol);
	} else {
		return Promise.reject('Invalid request');
	}
};

const capiSearchDecoder = decodeContent(SearchResponseSerde);

// ----- Exports ----- //

export { capiSearchDecoder };
