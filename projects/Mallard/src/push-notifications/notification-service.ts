import { Platform } from 'react-native'
import { notificationEdition } from 'src/helpers/settings/defaults'
import { getSetting } from 'src/helpers/settings'

const registerWithNotificationService = async (deviceToken: {
    token: string
}) => {
    const registerDeviceUrl = await getSetting('notificationServiceRegister')
    const { token } = deviceToken
    const options = {
        deviceToken: token,
        platform:
            Platform.OS === 'ios'
                ? notificationEdition.ios
                : notificationEdition.android,
        topics: [
            {
                name: 'uk',
                type: 'editions',
            },
        ],
    }
    return fetch(registerDeviceUrl as string, {
        method: 'post',
        body: JSON.stringify(options),
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(response =>
        response.ok
            ? Promise.resolve(response.json())
            : Promise.reject(response.status),
    )
}

export { registerWithNotificationService }
