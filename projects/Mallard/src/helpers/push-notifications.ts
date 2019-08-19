import PushNotification from 'react-native-push-notification'
import { PushNotificationIOS, Platform } from 'react-native'
import { fetchFromNotificationService } from 'src/helpers/fetch'
import { downloadAndUnzipIssue } from 'src/helpers/files'

const pushNotifcationRegistration = () =>
    PushNotification.configure({
        onRegister: (token: { token: string } | undefined) => {
            if (token) {
                fetchFromNotificationService(token)
            }
        },
        onNotification: (notification: any) => {
            console.log(notification)
            const key =
                Platform.OS === 'ios' ? notification.data.key : notification.key
            if (key) {
                downloadAndUnzipIssue(
                    key,
                    'tabletXL' /**  todo, how do we work out image size */,
                )
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

export { pushNotifcationRegistration }
