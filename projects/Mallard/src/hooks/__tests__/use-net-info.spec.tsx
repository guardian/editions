import type { NetInfoState } from '@react-native-community/netinfo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import ApolloClient from 'apollo-client';
import gql from 'graphql-tag';
import { NON_IMPLEMENTED_LINK } from 'src/helpers/apollo_link';
import { DownloadBlockedStatus, NetInfoStateType } from '../use-net-info';
import type { NetInfo as NetInfoType } from '../use-net-info';

type Handler = (state: NetInfoState) => void;

type NetInfoMock = {
	addEventListener: jest.Mock<(fn: Handler) => void>;
	emit: Handler;
	fetch: jest.MockedFunction<() => Promise<NetInfoState>>;
};

const wifiState = {
	type: 'wifi',
	isConnected: true,
	isInternetReachable: true,
} as NetInfoState;

const cellularState = {
	type: 'cellular',
	isConnected: true,
	isInternetReachable: true,
} as NetInfoState;

jest.mock(
	'@react-native-community/netinfo',
	(): NetInfoMock => {
		let bound: Handler = () => {};

		const addEventListener = jest.fn((fn: Handler) => {
			bound = fn;
			return () => {};
		});

		const ret = {
			NetInfoStateType: {
				unknown: 'unknown',
				none: 'none',
				wifi: 'wifi',
				cellular: 'cellular',
			},
			addEventListener,
			emit: (state: NetInfoState) => bound(state),
			fetch: jest.fn(),
		};
		return ret;
	},
);

describe('use-net-info', () => {
	describe('createNetInfoResolver', () => {
		let NetInfo: NetInfoMock;
		let createNetInfoResolver: () => (
			_obj: unknown,
			_vars: unknown,
			opts: { client: ApolloClient<object> },
		) => Promise<NetInfoType>;
		let client: ApolloClient<object>;

		beforeEach(() => {
			jest.resetModules();
			createNetInfoResolver = require('../use-net-info')
				.createNetInfoResolver;
			NetInfo = require('@react-native-community/netinfo');
			NetInfo.addEventListener.mockClear(); // ignore side-effects form module load
			client = new ApolloClient({
				cache: new InMemoryCache(),
				link: NON_IMPLEMENTED_LINK,
				resolvers: {},
			});
			// Some mock data that the NetInfo resolver depends on.
			client.writeData({ data: { wifiOnlyDownloads: false } });
		});

		it('registers when resolver is called', () => {
			const resolve = createNetInfoResolver();
			resolve(null, null, { client });
			expect(NetInfo.addEventListener).toHaveBeenCalledTimes(1);
		});

		it('returns a promise with the first value of NetInfo.fetch()', async () => {
			const resolve = createNetInfoResolver();
			NetInfo.fetch.mockResolvedValue(wifiState);

			const state = await resolve(null, null, { client });
			expect(state).toEqual({
				__typename: 'NetInfo',
				...wifiState,
				downloadBlocked: DownloadBlockedStatus.NotBlocked,
				isDevButtonShown: false,
				setIsDevButtonShown: expect.any(Function),
				setOverrideIsConnected: expect.any(Function),
				setOverrideIsInternetReachable: expect.any(Function),
				setOverrideNetworkType: expect.any(Function),
				isPoorConnection: false,
				isInternetReachable: true,
				overrideIsConnected: false,
				overrideIsInternetReachable: false,
				overrideNetworkType: NetInfoStateType.unknown,
			});
		});

		it('returns the latest value of the emitter as a promise', async () => {
			const resolve = createNetInfoResolver();
			NetInfo.fetch.mockResolvedValue(wifiState);
			await resolve(null, null, { client });

			NetInfo.fetch.mockResolvedValue(cellularState);
			await NetInfo.emit(cellularState);

			const state = await resolve(null, null, { client });
			expect(state).toEqual({
				__typename: 'NetInfo',
				...cellularState,
				downloadBlocked: DownloadBlockedStatus.NotBlocked,
				isDevButtonShown: false,
				setIsDevButtonShown: expect.any(Function),
				setOverrideIsConnected: expect.any(Function),
				setOverrideIsInternetReachable: expect.any(Function),
				setOverrideNetworkType: expect.any(Function),
				isPoorConnection: true,
				isInternetReachable: true,
				overrideIsConnected: false,
				overrideIsInternetReachable: false,
				overrideNetworkType: NetInfoStateType.unknown,
			});
		});

		it('updates Apollo client with the the latest value', async () => {
			const resolve = createNetInfoResolver();
			NetInfo.fetch.mockResolvedValue(wifiState);
			await resolve(null, null, { client });

			const query = gql`
				{
					netInfo @client {
						type @client
						isConnected @client
						isPoorConnection @client
						isInternetReachable @client
					}
				}
			`;

			NetInfo.fetch.mockResolvedValue(cellularState);
			await NetInfo.emit(cellularState);
			await Promise.resolve();

			const res = client.cache.readQuery<any>({
				query,
			});
			expect(res.netInfo).toEqual({
				...cellularState,
				__typename: 'NetInfo',
				isPoorConnection: true,
			});
		});

		it('applies the setOverrideNetworkType() override which means we are in dev mode which means the overrides isConnected and isInternetReacable come into play', async () => {
			const resolve = createNetInfoResolver();
			NetInfo.fetch.mockResolvedValue(wifiState);
			let state = await resolve(null, null, { client });

			await state.setIsDevButtonShown(true);
			await state.setOverrideNetworkType(NetInfoStateType.cellular);

			state = await resolve(null, null, { client });
			expect(state).toEqual({
				__typename: 'NetInfo',
				...cellularState,
				downloadBlocked: DownloadBlockedStatus.Offline,
				isDevButtonShown: true,
				setIsDevButtonShown: expect.any(Function),
				setOverrideIsConnected: expect.any(Function),
				setOverrideIsInternetReachable: expect.any(Function),
				setOverrideNetworkType: expect.any(Function),
				isPoorConnection: true,
				isConnected: false,
				isInternetReachable: false,
				overrideIsConnected: false,
				overrideIsInternetReachable: false,
				overrideNetworkType: NetInfoStateType.cellular,
			});
		});

		it('applies the setOverrideIsConnected() override which means we are in dev mode and forces the default network type', async () => {
			const resolve = createNetInfoResolver();
			NetInfo.fetch.mockResolvedValue(wifiState);
			let state = await resolve(null, null, { client });

			await state.setIsDevButtonShown(true);
			await state.setOverrideIsConnected(false);

			state = await resolve(null, null, { client });
			expect(state).toEqual({
				__typename: 'NetInfo',
				...wifiState,
				downloadBlocked: DownloadBlockedStatus.Offline,
				isDevButtonShown: true,
				setIsDevButtonShown: expect.any(Function),
				setOverrideIsConnected: expect.any(Function),
				setOverrideIsInternetReachable: expect.any(Function),
				setOverrideNetworkType: expect.any(Function),
				isPoorConnection: false,
				isConnected: false,
				isInternetReachable: false,
				overrideIsConnected: false,
				overrideIsInternetReachable: false,
				overrideNetworkType: NetInfoStateType.unknown,
				type: NetInfoStateType.unknown,
			});
		});

		it('applies the setIsInternetIsReachable() override which means we are in dev mode and forces the default overrides', async () => {
			const resolve = createNetInfoResolver();
			NetInfo.fetch.mockResolvedValue(wifiState);
			let state = await resolve(null, null, { client });

			await state.setIsDevButtonShown(true);
			await state.setOverrideIsInternetReachable(true);

			state = await resolve(null, null, { client });
			expect(state).toEqual({
				__typename: 'NetInfo',
				...wifiState,
				downloadBlocked: DownloadBlockedStatus.Offline,
				isDevButtonShown: true,
				setIsDevButtonShown: expect.any(Function),
				setOverrideIsConnected: expect.any(Function),
				setOverrideIsInternetReachable: expect.any(Function),
				setOverrideNetworkType: expect.any(Function),
				isPoorConnection: false,
				isConnected: false,
				isInternetReachable: false,
				overrideIsConnected: false,
				overrideIsInternetReachable: true,
				overrideNetworkType: NetInfoStateType.unknown,
				type: NetInfoStateType.unknown,
			});
		});

		it('isConnected should be false when overrideIsInternetReachable is false, despite overrideIsConnected being true and in a wifi state', async () => {
			const resolve = createNetInfoResolver();
			NetInfo.fetch.mockResolvedValue(wifiState);
			let state = await resolve(null, null, { client });

			await state.setIsDevButtonShown(true);
			await state.setOverrideNetworkType(NetInfoStateType.wifi);
			await state.setOverrideIsConnected(true);
			await state.setOverrideIsInternetReachable(false);

			state = await resolve(null, null, { client });
			expect(state).toEqual({
				__typename: 'NetInfo',
				...wifiState,
				downloadBlocked: DownloadBlockedStatus.Offline,
				isDevButtonShown: true,
				setIsDevButtonShown: expect.any(Function),
				setOverrideIsConnected: expect.any(Function),
				setOverrideIsInternetReachable: expect.any(Function),
				setOverrideNetworkType: expect.any(Function),
				isPoorConnection: false,
				isConnected: false,
				isInternetReachable: false,
				overrideIsConnected: true,
				overrideIsInternetReachable: false,
				overrideNetworkType: NetInfoStateType.wifi,
				type: NetInfoStateType.wifi,
			});
		});
	});
});
