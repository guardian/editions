import { check, PERMISSIONS, RESULTS } from 'react-native-permissions'
import { Platform } from 'react-native'

export const resolveLocationPermissionStatus = async () => {
    return await check(
        Platform.select({
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        }),
    )
}
