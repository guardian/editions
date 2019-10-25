import { check, request, PERMISSIONS } from 'react-native-permissions'
import { Platform } from 'react-native'
import { ApolloClient } from 'apollo-client'

const PERMISSION = Platform.select({
    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
})

export const resolveLocationPermissionStatus = async () => {
    return await check(PERMISSION)
}

export const requestLocationPermission = async (
    apolloClient: ApolloClient<object>,
) => {
    return request(PERMISSION).then(result => {
        apolloClient.writeData({
            data: {
                locationPermissionStatus: result,
            },
        })
        return result
    })
}
