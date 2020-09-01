import PushNotification from 'react-native-push-notification'
import { Platform } from 'react-native'

const localnotification = () => {
    if (Platform.OS === 'android') {
        PushNotification.localNotification({
            title: 'Test notification',
            message: 'Yo Yo Yo',
        })
    }
}

export { localnotification }

/**
 *
 * If android around this function so it cant be called by iOS
 * use async storage for turning it off rather than built in consent
 * use the logging to try and find out information
 * implement remote config so it can be turned off
 * add icons
 * use scheduled and use the utc offset from the editions endpoint / defaults
 *
 *
 */
