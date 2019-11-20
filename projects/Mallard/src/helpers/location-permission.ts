import {
    check,
    request,
    PERMISSIONS,
    PermissionStatus,
} from 'react-native-permissions'
import { Platform } from 'react-native'
import { Query, QueryEnvironment } from './queries'

const LOCATION_PERMISSION = Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
})

export const PERMISSION_STATUS_QUERY = Query.create(async () => {
    return await check(LOCATION_PERMISSION)
})

export const requestLocationPermission = async (
    env: QueryEnvironment,
): Promise<PermissionStatus> => {
    const result = await request(LOCATION_PERMISSION)
    env.invalidate(PERMISSION_STATUS_QUERY, undefined)
    return result
}
