import { NetInfoStateType, useNetInfo } from '@react-native-community/netinfo';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { NetInfoDevOverlay } from 'src/components/NetInfoDevOverlay';
import type { NetInfoState } from './types';
import { DownloadBlockedStatus } from './types';
import { isDisconnectedState, stateResolver } from './utils';

const defaultState: NetInfoState = {
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

const NetInfoContext = createContext(defaultState);

export const NetInfoProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	/* Variables to track against the actual Net Info state */
	const [localType, setLocalType] = useState<NetInfoState['type']>(
		defaultState.type,
	);
	const [localIsConnected, setLocalIsConnected] = useState<
		NetInfoState['isConnected']
	>(defaultState.isConnected);
	const [localIsInternetReachable, setLocalIsInternetReachable] = useState<
		NetInfoState['isInternetReachable']
	>(defaultState.isInternetReachable);

	/* Calculated values */
	const [localIsPoorConnection, setLocalIsPoorConnection] = useState<
		NetInfoState['isPoorConnection']
	>(defaultState.isPoorConnection);
	const [localDownloadBlocked, setLocalDownloadBlocked] = useState<
		NetInfoState['downloadBlocked']
	>(defaultState.downloadBlocked);

	/* Values associated with overrides */
	const [isDevButtonShown, setIsDevButtonShown] = useState<
		NetInfoState['isDevButtonShown']
	>(defaultState.isDevButtonShown);
	const [overrideIsConnected, setOverrideIsConnected] = useState<
		NetInfoState['overrideIsConnected']
	>(defaultState.overrideIsConnected);
	const [overrideNetworkType, setOverrideNetworkType] = useState<
		NetInfoState['overrideNetworkType']
	>(defaultState.overrideNetworkType);
	const [overrideIsInternetReachable, setOverrideIsInternetReachable] =
		useState<NetInfoState['overrideIsInternetReachable']>(
			defaultState.overrideIsInternetReachable,
		);

	const { type, isConnected, isInternetReachable } = useNetInfo();

	// Update the state whenever core netinfo values change or overrides are in play
	useEffect(() => {
		const resolvedState = stateResolver({
			type,
			isConnected,
			isInternetReachable,
			isDevButtonShown,
			overrideIsConnected,
			overrideNetworkType,
			overrideIsInternetReachable,
		});

		setLocalType(resolvedState.type);
		setLocalIsConnected(resolvedState.isConnected);
		setLocalIsInternetReachable(resolvedState.isInternetReachable);
		setLocalIsPoorConnection(resolvedState.isPoorConnection);
		setLocalDownloadBlocked(resolvedState.downloadBlocked);
	}, [
		type,
		isConnected,
		isInternetReachable,
		isDevButtonShown,
		overrideIsConnected,
		overrideNetworkType,
		overrideIsInternetReachable,
	]);

	return (
		<NetInfoContext.Provider
			value={{
				type: localType,
				isConnected: localIsConnected,
				isInternetReachable: localIsInternetReachable,
				isPoorConnection: localIsPoorConnection,
				downloadBlocked: localDownloadBlocked,
				isDevButtonShown,
				setIsDevButtonShown,
				overrideIsConnected,
				setOverrideIsConnected,
				overrideNetworkType,
				setOverrideNetworkType,
				overrideIsInternetReachable,
				setOverrideIsInternetReachable,
			}}
		>
			{children}
			<NetInfoDevOverlay />
		</NetInfoContext.Provider>
	);
};

export const useNetInfoProvider = () => useContext(NetInfoContext);
export { NetInfoStateType, isDisconnectedState };
