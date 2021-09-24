import * as NetInfo from '@react-native-community/netinfo';
import {
	NetInfoState,
	NetInfoStateType,
} from '@react-native-community/netinfo';
import type ApolloClient from 'apollo-client';
import { isEqual } from 'apollo-utilities';
import gql from 'graphql-tag';
import type { Dispatch } from 'react';
import { useQuery } from './apollo';

/**
 * The purpose of this module is to create a wrapper around netinfo
 *
 * We can fake our offline status in the app. This _doesn't_ mean
 * all `fetch` requests will fail. It just means that wherever we're
 * explicitly checking the netinfo status, we can override it in __DEV__
 *
 * Currently aeroplane mode doesn't work in the Simulator, and switching on
 * aeroplane mode while debugging on device ends up disconnecting you from
 * the debugger and throwing an error in the app
 *
 * Potentially we can wrap our fetches in checks to this status in future
 * if it would be helpful to both not fetch when we're offline and again,
 * mock an offline status.
 *
 **/

export enum DownloadBlockedStatus {
	WifiOnly,
	Offline,
	NotBlocked,
}

const QUERY = gql`
	{
		netInfo @client {
			type @client
			isConnected @client
			isPoorConnection @client
			isInternetReachable @client
			downloadBlocked @client
			isDevButtonShown @client
			setIsDevButtonShown @client
			overrideIsConnected @client
			setOverrideIsConnected @client
			overrideNetworkType @client
			setOverrideIsInternetReachable @client
			overrideIsInternetReachable @client
		}
	}
`;

type CommonState = {
	isDevButtonShown: boolean;
	setIsDevButtonShown: Dispatch<boolean>;
	overrideIsConnected: boolean;
	setOverrideIsConnected: Dispatch<boolean>;
	overrideNetworkType: NetInfoStateType;
	setOverrideNetworkType: Dispatch<NetInfoStateType>;
	overrideIsInternetReachable: boolean;
	setOverrideIsInternetReachable: Dispatch<boolean>;
};

// eslint-disable-next-line @typescript-eslint/naming-convention -- apollo convention
const __typename = 'NetInfo';

type NetInfo = CommonState & {
	__typename: 'NetInfo';
	type: NetInfoStateType;
	isConnected: boolean;
	isPoorConnection: boolean;
	isInternetReachable: boolean;
	downloadBlocked: DownloadBlockedStatus;
};

type InternalState = CommonState & {
	netInfo: NetInfoState;
	wifiOnlyDownloads: boolean;
};

const getDownloadBlockedStatus = (
	netInfo: {
		type: NetInfoState['type'];
		isConnected: NetInfoState['isConnected'];
	},
	wifiOnlyDownloads: boolean,
): DownloadBlockedStatus => {
	console.log(netInfo);
	return !netInfo.isConnected
		? DownloadBlockedStatus.Offline
		: wifiOnlyDownloads && netInfo.type !== 'wifi'
		? DownloadBlockedStatus.WifiOnly
		: DownloadBlockedStatus.NotBlocked;
};

export const isDisconnectedState = (type: NetInfoStateType) =>
	type === NetInfoStateType.none || type === NetInfoStateType.unknown;

const padNetInfoState = (state: InternalState): NetInfoState => {
	const basicNetInfo = {
		type: state.overrideNetworkType,
		isConnected: isDisconnectedState(state.overrideNetworkType)
			? false
			: state.overrideIsConnected,
		isInternetReachable: isDisconnectedState(state.overrideNetworkType)
			? false
			: state.overrideIsInternetReachable,
	};

	return { ...basicNetInfo } as NetInfoState;
};

/**
 * Translate the internal state into the clean, exposed NetInfo data. This must
 * not have any side effects. For example we simulate a netinfo of type "none"
 * if we are currently forced offline (but the internal state keeps track of the
 * real state).
 */
const assembleNetInfo = (state: InternalState): NetInfo => {
	const netInfo = state.isDevButtonShown
		? padNetInfoState(state)
		: state.netInfo;
	const { type, isConnected, isInternetReachable } = netInfo;
	const isPoorConnection = netInfo.type === 'cellular';
	const internetUnreachable = isInternetReachable === false;

	const typeOverrideCheck = state.isDevButtonShown
		? state.overrideNetworkType
		: type;
	const isTrulyConnected = isConnected && !internetUnreachable;
	return {
		__typename,
		type: typeOverrideCheck,
		isConnected: isTrulyConnected,
		isInternetReachable: isInternetReachable ?? false,
		isPoorConnection,
		downloadBlocked: getDownloadBlockedStatus(
			{
				type: typeOverrideCheck,
				isConnected: isTrulyConnected,
			},
			state.wifiOnlyDownloads,
		),
		isDevButtonShown: state.isDevButtonShown,
		setIsDevButtonShown: state.setIsDevButtonShown,
		overrideIsConnected: state.overrideIsConnected,
		setOverrideIsConnected: state.setOverrideIsConnected,
		overrideNetworkType: state.overrideNetworkType,
		setOverrideNetworkType: state.setOverrideNetworkType,
		overrideIsInternetReachable: state.overrideIsInternetReachable,
		setOverrideIsInternetReachable: state.setOverrideIsInternetReachable,
	};
};

export const createNetInfoResolver = () => {
	let statePromise: Promise<InternalState> | undefined;

	/**
	 * The first time try to fetch the NetInfo state, we register a few event
	 * listeners and fetch our initial value. If the resolver is called again we
	 * always return the same promise. On some events, we directly update the
	 * Apollo cache to propagate the updates.
	 */
	return (
		_obj: unknown,
		_vars: unknown,
		{ client }: { client: ApolloClient<object> },
	): Promise<NetInfo> => {
		/**
		 * We already have a past update (either in progress or already
		 * resolved), so return that. We pass it through `assembleNetInfo`
		 * because we don't expose our entire internal state.
		 */
		if (statePromise != null) {
			return statePromise.then(assembleNetInfo);
		}

		/**
		 * This is called whenever we want to update the state in response to a
		 * change in the environment. We first wait on the current update by
		 * awaiting `statePromise` (we don't want updates running concurrently
		 * and corrupting the state). Then we replace it with our new Promise
		 * and finally we update the cache once this resolves.
		 */
		const update = async (
			reducer: (_: InternalState) => Promise<InternalState>,
		) => {
			if (statePromise == null) return;
			statePromise = reducer(await statePromise);
			const state = await statePromise;
			const netInfo = assembleNetInfo(state);
			client.writeQuery({ query: QUERY, data: { netInfo } });
		};

		/**
		 * The main reason we might want to update is when the real NetInfo
		 * itself changes. We use `isEqual` to avoid overriding the state if
		 * nothing really changed (this happens notably at the very beginning
		 * because NetInfo sends the initial value to its event listeners).
		 */
		NetInfo.addEventListener(async (netInfo) => {
			if (statePromise == null) return;
			const state = await statePromise;
			if (isEqual(netInfo, state.netInfo)) return;
			update(async (prevState) => ({ ...prevState, netInfo }));
		});

		/**
		 * When the "wifiOnlyDownloads" setting changes, we want to update
		 * this as this is used to block or allow downloading editions.
		 */
		type InnerQueryValue = { wifiOnlyDownloads: boolean };
		const INNER_QUERY = gql('{ wifiOnlyDownloads @client }');
		client
			.watchQuery<InnerQueryValue>({ query: INNER_QUERY })
			.subscribe((value) => {
				const wifiOnlyDownloads = value.data.wifiOnlyDownloads;
				update(async (prevState) => ({
					...prevState,
					wifiOnlyDownloads,
				}));
			});

		/**
		 * Then we have the mutators for the debug controls.
		 */
		const setIsDevButtonShown = (isDevButtonShown: boolean) =>
			update(async (prevState) => ({ ...prevState, isDevButtonShown }));
		const setOverrideIsConnected = (overrideIsConnected: boolean) =>
			update(async (prevState) => ({
				...prevState,
				overrideIsConnected,
			}));
		const setOverrideNetworkType = (
			overrideNetworkType: NetInfoStateType,
		) =>
			update(async (prevState) => ({
				...prevState,
				overrideNetworkType,
			}));
		const setOverrideIsInternetReachable = (
			overrideIsInternetReachable: boolean,
		) =>
			update(async (prevState) => ({
				...prevState,
				overrideIsInternetReachable,
			}));

		/**
		 * Finally we initialize the result promise with our first value. By
		 * returning this, Apollo will wait until it resolves before returning
		 * any data to React components, instead returning a loading status.
		 * Components shouldn't render anything expensive while loading, so
		 * that we then only do a single render once it is indeed loaded.
		 */
		statePromise = (async (): Promise<InternalState> => {
			const [netInfo, innerQuery] = await Promise.all([
				NetInfo.fetch(),
				client.query<InnerQueryValue>({ query: INNER_QUERY }),
			]);
			return {
				netInfo,
				wifiOnlyDownloads: innerQuery.data.wifiOnlyDownloads,
				isDevButtonShown: false,
				setIsDevButtonShown,
				overrideIsConnected: false,
				setOverrideIsConnected,
				overrideNetworkType: NetInfoStateType.unknown,
				setOverrideNetworkType,
				overrideIsInternetReachable: false,
				setOverrideIsInternetReachable,
			};
		})();

		return statePromise.then(assembleNetInfo);
	};
};

/**
 * Deprecated. Instead, one should directly use `useQuery` with the specific
 * fields one wish to query. This is because otherwise, your React component
 * will re-render whenever any of the fields change, even ones not in use
 * by the component.
 */
const useNetInfo = (() => {
	const LOADING: NetInfo = {
		__typename,
		type: NetInfoStateType.unknown,
		isConnected: false,
		isPoorConnection: false,
		isInternetReachable: false,
		downloadBlocked: DownloadBlockedStatus.NotBlocked,
		isDevButtonShown: false,
		setIsDevButtonShown: () => {},
		overrideIsConnected: false,
		setOverrideIsConnected: () => {},
		overrideNetworkType: NetInfoStateType.unknown,
		setOverrideNetworkType: () => {},
		overrideIsInternetReachable: false,
		setOverrideIsInternetReachable: () => {},
	};

	return (): NetInfo => {
		const res = useQuery<{ netInfo: NetInfo }>(QUERY);
		// FIXME: having a fake 'loading' set of data causes the UI to render
		// with some invalid values at first only to re-render later with the
		// final values. Instead we shouldn't render until it's finished
		// loading.
		return res.loading ? LOADING : res.data.netInfo;
	};
})();

export { useNetInfo, NetInfo, NetInfoState, NetInfoStateType };
