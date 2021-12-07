import Geolocation from '@react-native-community/geolocation';
import { Platform } from 'react-native';
import type { PermissionStatus } from 'react-native-permissions';
import { check, PERMISSIONS, request } from 'react-native-permissions';

const LOCATION_PERMISSION = Platform.select({
	ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
	android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
	default: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
});

export const initisaliseLocationPermission = () =>
	Geolocation.setRNConfiguration({
		/**
		 * We want to control the exact moment the permission pop-up shows, so
		 * we don't rely on the Geolocation module and instead manage permissions
		 * ourselves
		 */
		skipPermissionRequests: true,
		authorizationLevel: 'whenInUse',
	});

export const resolveLocationPermissionStatus =
	async (): Promise<PermissionStatus> => await check(LOCATION_PERMISSION);

export const requestLocationPermission =
	async (): Promise<PermissionStatus> => {
		return await request(LOCATION_PERMISSION);
	};
