import { Feature, loggingService, Level } from 'src/services/logging'
import crashlytics from '@react-native-firebase/crashlytics'

export const sendCrashlyticsAttributes = async () => {
    enableCrashlytics()

    const data = await loggingService.basicLogInfo({
        level: Level.INFO,
        message: 'App Data',
    })

    // send some sample key/value paires to crashlytics
    crashlytics().setAttributes({
        app: data.app,
        signedIn: String(data.signedIn),
        userId: data.userId,
    })
}

const enableCrashlytics = async () => {
    // TODO This need to reflect user consent
    if (__DEV__) {
        await crashlytics().setCrashlyticsCollectionEnabled(true)
        crashlytics().log('Crashlytics initialized')
    }
}
