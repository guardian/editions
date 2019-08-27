import PushNotification from 'react-native-push-notification'
import { PushNotificationIOS, Platform } from 'react-native'
import { fetchFromNotificationService } from 'src/helpers/fetch'
import { downloadAndUnzipIssue, clearOldIssues } from 'src/helpers/files'
import { imageForScreenSize } from 'src/helpers/screen'
import { pushNotificationRegistrationCache } from '../authentication/storage'
import Moment from 'moment'

export interface PushNotificationRegistration {
    registrationDate: string
}

const DATE_FORMAT = 'YYYY-MM-DD'

const shouldReRegister = (registrationDate: string): boolean => {
    const regDate = Moment.utc(registrationDate, DATE_FORMAT)
    const now = Moment().utc()
    return now.diff(regDate, 'days') > 14
}

const register = (deviceToken: {token: string }) => {
    fetchFromNotificationService(deviceToken)
    pushNotificationRegistrationCache.set({
        registrationDate: Moment()
            .utc()
            .format(DATE_FORMAT)
            .toString(),
    })
}

const pushNotifcationRegistration = () => {
    PushNotification.configure({
        onRegister: (token: { token: string } | undefined) => {
            if (token) {
                pushNotificationRegistrationCache
                .get()
                .then(registrationDateOrNull => {
                    if (
                        !registrationDateOrNull ||
                        shouldReRegister(registrationDateOrNull.registrationDate)
                    ) {
                        register(token)
                    }
                })
                .catch(error => {
                    console.log(
                        'error retrieving push notification registration date from cache - registering anyway.',
                    )
                    register(token)
                })
            }
        },
        onNotification: (notification: any) => {
            const key =
                Platform.OS === 'ios' ? notification.data.key : notification.key
            if (key) {
                const screenSize = imageForScreenSize()
                downloadAndUnzipIssue(key, screenSize)
                clearOldIssues()
            }

            // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
            notification.finish(PushNotificationIOS.FetchResult.NoData)
        },
        senderID: '43377569438',
        permissions: {
            alert: false,
            badge: false,
            sound: false,
        },
    })
}

export { pushNotifcationRegistration }
