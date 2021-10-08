import {
	getDownloadBlockedStatus,
	isPoorConnection,
	isTruelyConnected,
	stateResolver,
	isDisconnectedState,
} from '../utils';
import { DownloadBlockedStatus } from '../types';
import { NetInfoStateType } from '../index';

describe('use-net-info-provider', () => {
	describe('getDownloadBlockedStatus', () => {
		it('should return "Offline" if the user is not connected', () => {
			const downloadBlockedStatus = getDownloadBlockedStatus(
				{ type: NetInfoStateType.none, isConnected: false },
				false,
			);
			expect(downloadBlockedStatus).toEqual(
				DownloadBlockedStatus.Offline,
			);
		});
		it('should return "WifiOnly" if the user is connected, wifi only downloads are selected and the net info type is NOT wifi', () => {
			const downloadBlockedStatus = getDownloadBlockedStatus(
				{ type: NetInfoStateType.cellular, isConnected: true },
				true,
			);
			expect(downloadBlockedStatus).toEqual(
				DownloadBlockedStatus.WifiOnly,
			);
		});

		it('should return "NotBlocked" if the user is connected, wifi only downloads are selected and the net info type is wifi', () => {
			const downloadBlockedStatus = getDownloadBlockedStatus(
				{ type: NetInfoStateType.wifi, isConnected: true },
				true,
			);
			expect(downloadBlockedStatus).toEqual(
				DownloadBlockedStatus.NotBlocked,
			);
		});
		it('should return "NotBlocked" if the user is connected and they have NOT selected wifi only downloads', () => {
			const downloadBlockedStatus = getDownloadBlockedStatus(
				{ type: NetInfoStateType.cellular, isConnected: true },
				false,
			);
			expect(downloadBlockedStatus).toEqual(
				DownloadBlockedStatus.NotBlocked,
			);
		});
	});

	describe('isDisconnectedState', () => {
		it('should return true if the network type is unknown', () => {
			const disconnected = isDisconnectedState(NetInfoStateType.unknown);
			expect(disconnected).toEqual(true);
		});
		it('should return true if the network type is none', () => {
			const disconnected = isDisconnectedState(NetInfoStateType.none);
			expect(disconnected).toEqual(true);
		});
		it('should return fase if the network type is anything else', () => {
			const disconnected = isDisconnectedState(NetInfoStateType.wifi);
			expect(disconnected).toEqual(false);
		});
	});

	describe('isTruelyConnected', () => {
		it('should return true if you are connected and your interenet is reachable', () => {
			const connected = isTruelyConnected({
				isConnected: true,
				isInternetReachable: true,
			});
			expect(connected).toEqual(true);
		});
		it('should return false if you are connected but your internet is NOT reachable', () => {
			const connected = isTruelyConnected({
				isConnected: true,
				isInternetReachable: false,
			});
			expect(connected).toEqual(false);
		});
		it('should return false if you are NOT connected and your internet is NOT reachable', () => {
			const connected = isTruelyConnected({
				isConnected: false,
				isInternetReachable: false,
			});
			expect(connected).toEqual(false);
		});
	});

	describe('isPoorConnection', () => {
		it('should return true when the network type is cellular', () => {
			const checkPoorConnection = isPoorConnection(
				NetInfoStateType.cellular,
			);
			expect(checkPoorConnection).toEqual(true);
		});
		it('should return false when the network type is anything else', () => {
			const checkPoorConnection = isPoorConnection(NetInfoStateType.none);
			expect(checkPoorConnection).toEqual(false);
		});
	});

	describe('stateResolver', () => {
		it('should provide an expected state when no overrides are being enforced', () => {
			const netInfo = {
				type: NetInfoStateType.wifi,
				isConnected: true,
				isInternetReachable: true,
				isDevButtonShown: false,
				overrideIsConnected: false,
				overrideNetworkType: NetInfoStateType.unknown,
				overrideIsInternetReachable: false,
			};

			const resolvedState = stateResolver(netInfo, false);
			expect(resolvedState).toEqual({
				downloadBlocked: DownloadBlockedStatus.NotBlocked,
				isConnected: true,
				isDevButtonShown: false,
				isInternetReachable: true,
				isPoorConnection: false,
				overrideIsConnected: false,
				overrideIsInternetReachable: false,
				overrideNetworkType: NetInfoStateType.unknown,
				type: NetInfoStateType.wifi,
			});
		});
		it('should enforce overrides when they are enabled', () => {
			const netInfo = {
				type: NetInfoStateType.wifi,
				isConnected: true,
				isInternetReachable: true,
				isDevButtonShown: true,
				overrideIsConnected: false,
				overrideNetworkType: NetInfoStateType.cellular,
				overrideIsInternetReachable: false,
			};

			const resolvedState = stateResolver(netInfo, false);
			expect(resolvedState).toEqual({
				downloadBlocked: DownloadBlockedStatus.Offline,
				isConnected: false,
				isDevButtonShown: true,
				isInternetReachable: false,
				isPoorConnection: true,
				overrideIsConnected: false,
				overrideIsInternetReachable: false,
				overrideNetworkType: NetInfoStateType.cellular,
				type: NetInfoStateType.cellular,
			});
		});
	});
});
