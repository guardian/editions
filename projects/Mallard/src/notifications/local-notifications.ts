import PushNotification from 'react-native-push-notification'

const localnotification = (notificationsEnabled: boolean) => {
    if (notificationsEnabled) {
        PushNotification.localNotification({
            title: 'Good Morning!',
            message: 'This weekend’s edition is ready. Have a good one!',
        })
    }
}

export { localnotification }

/**
 *
 * use the logging to try and find out information
 * implement remote config so it can be turned off
 * use scheduled and use the utc offset from the editions endpoint / defaults
 *
 */
