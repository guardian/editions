import { NetInfoStateType } from '@react-native-community/netinfo';
import { DownloadBlockedStatus } from './types';
import type { NetInfoCore, NetInfoInputs, NetInfoValues } from './types';

export const getDownloadBlockedStatus = (
	netInfo: {
		type: NetInfoCore['type'];
		isConnected: NetInfoCore['isConnected'];
	},
	wifiOnlyDownloads: boolean,
): DownloadBlockedStatus => {
	return !netInfo.isConnected
		? DownloadBlockedStatus.Offline
		: wifiOnlyDownloads && netInfo.type !== 'wifi'
		? DownloadBlockedStatus.WifiOnly
		: DownloadBlockedStatus.NotBlocked;
};

export const isDisconnectedState = (type: NetInfoStateType) =>
	type === NetInfoStateType.none || type === NetInfoStateType.unknown;

export const isTruelyConnected = ({
	isConnected,
	isInternetReachable,
}: {
	isConnected: NetInfoCore['isConnected'];
	isInternetReachable: NetInfoCore['isInternetReachable'];
}) => {
	const internetUnreachable = isInternetReachable === false;
	return isConnected && !internetUnreachable;
};

export const isPoorConnection = (type: NetInfoStateType) =>
	type === NetInfoStateType.cellular;

export const stateResolver = (
	netInfo: NetInfoInputs,
	wifiOnlyDownloads: boolean,
): NetInfoValues => {
	const {
		type,
		isConnected,
		isInternetReachable,
		isDevButtonShown,
		overrideIsConnected,
		overrideNetworkType,
		overrideIsInternetReachable,
	} = netInfo;

	const checkPoorConnection = isPoorConnection(
		isDevButtonShown ? overrideNetworkType : type,
	);
	const isFullyConnected = isTruelyConnected({
		isConnected: isDevButtonShown ? overrideIsConnected : isConnected,
		isInternetReachable: isDevButtonShown
			? overrideIsInternetReachable
			: isInternetReachable,
	});

	if (isDevButtonShown) {
		return {
			...netInfo,
			type: overrideNetworkType,
			isConnected: isDisconnectedState(overrideNetworkType)
				? false
				: isFullyConnected,
			isInternetReachable: isDisconnectedState(overrideNetworkType)
				? false
				: overrideIsInternetReachable,
			isPoorConnection: checkPoorConnection,
			downloadBlocked: getDownloadBlockedStatus(
				{
					type: overrideNetworkType,
					isConnected: isFullyConnected,
				},
				wifiOnlyDownloads,
			),
		};
	}

	return {
		...netInfo,
		isConnected: isFullyConnected,
		isPoorConnection: checkPoorConnection,
		downloadBlocked: getDownloadBlockedStatus(
			{
				type,
				isConnected: isFullyConnected,
			},
			wifiOnlyDownloads,
		),
	};
};
