import { Platform } from 'react-native';
import type { PermissionStatus } from 'react-native-permissions';
import { check, PERMISSIONS, request } from 'react-native-permissions';

const LOCATION_PERMISSION = Platform.select({
	ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
	android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
	default: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
});

export const resolveLocationPermissionStatus =
	async (): Promise<PermissionStatus> => await check(LOCATION_PERMISSION);

export const requestLocationPermission =
	async (): Promise<PermissionStatus> => {
		return await request(LOCATION_PERMISSION);
	};
