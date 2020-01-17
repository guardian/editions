import {
    check,
    request,
    PERMISSIONS,
    PermissionStatus,
} from 'react-native-permissions'
import { Platform } from 'react-native'
import { ApolloClient } from 'apollo-client'
import { refreshWeather } from './weather'

const LOCATION_PERMISSION = Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
})

const { resolveLocationPermissionStatus, requestLocationPermission } = (() => {
    let promise: Promise<PermissionStatus> | undefined

    const resolveLocationPermissionStatus = () => {
        if (promise) return promise
        promise = LOCATION_PERMISSION && check(LOCATION_PERMISSION)
        return promise
    }

    const requestLocationPermission = async (
        apolloClient: ApolloClient<object>,
    ): Promise<PermissionStatus> => {
        if (LOCATION_PERMISSION) {
            promise = request(LOCATION_PERMISSION)
            const result = await promise
            apolloClient.writeData({
                data: {
                    locationPermissionStatus: result,
                },
            })
            refreshWeather(apolloClient)
            return result
        } else {
            return 'unavailable'
        }
    }

    return { resolveLocationPermissionStatus, requestLocationPermission }
})()

export { resolveLocationPermissionStatus, requestLocationPermission }
