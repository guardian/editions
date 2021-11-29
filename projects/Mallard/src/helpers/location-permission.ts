import type { ApolloClient } from 'apollo-client';
import { Platform } from 'react-native';
import type { PermissionStatus } from 'react-native-permissions';
import { check, PERMISSIONS, request } from 'react-native-permissions';
import { refreshWeather } from './weather';

const LOCATION_PERMISSION = Platform.select({
	ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
	android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
	default: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
});

export const resolveLocationPermissionStatus =
	async (): Promise<PermissionStatus> => await check(LOCATION_PERMISSION);

export const requestLocationPermission = async (
	apolloClient: ApolloClient<object>,
): Promise<PermissionStatus> => {
	const result = await request(LOCATION_PERMISSION);
	refreshWeather(apolloClient);
	return result;
};
