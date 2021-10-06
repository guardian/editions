import type { NetInfoStateType } from '@react-native-community/netinfo';
import type { Dispatch } from 'react';

export enum DownloadBlockedStatus {
	WifiOnly,
	Offline,
	NotBlocked,
}

export type NetInfoCore = {
	type: NetInfoStateType;
	isConnected: boolean;
	isInternetReachable: boolean | null | undefined;
};

export type NetInfoCalculated = {
	isPoorConnection: boolean;
	downloadBlocked: DownloadBlockedStatus;
};

type NetInfoOverrides = {
	isDevButtonShown: boolean;
	overrideIsConnected: boolean;
	overrideNetworkType: NetInfoStateType;
	overrideIsInternetReachable: boolean;
};

type NetInfoOverrideSetters = {
	setIsDevButtonShown: Dispatch<boolean>;
	setOverrideIsConnected: Dispatch<boolean>;
	setOverrideNetworkType: Dispatch<NetInfoStateType>;
	setOverrideIsInternetReachable: Dispatch<boolean>;
};

export type NetInfoState = NetInfoCore &
	NetInfoCalculated &
	NetInfoOverrides &
	NetInfoOverrideSetters;
export type NetInfoInputs = NetInfoCore & NetInfoOverrides;
export type NetInfoValues = NetInfoCore & NetInfoCalculated & NetInfoOverrides;
