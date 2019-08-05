import PushNotification from 'react-native-push-notification'
import { Alert } from 'react-native'
import { fetchFromNotificationService } from 'src/helpers/fetch'

const pushNotifcationRegistration = () =>
    PushNotification.configure({
        onRegister: (token: { token: string } | undefined) => {
            if (token) {
                fetchFromNotificationService(token)
            }
        },

        onNotification: (notification: any) => {
            Alert.alert('NOTIFICATION:', JSON.stringify(notification))
            // Process the silent notification here

            // required on iOS only (see fetchCompletionHandler docs: https://facebook.github.io/react-native/docs/pushnotificationios.html)
            // notification.finish(PushNotificationIOS.FetchResult.NoData)
        },
        senderID: '43377569438',
        permissions: {
            alert: false,
            badge: false,
            sound: false,
        },
    })

export { pushNotifcationRegistration }
