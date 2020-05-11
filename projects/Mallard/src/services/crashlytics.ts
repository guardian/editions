import { Feature, loggingService, Level } from 'src/services/logging'
import crashlytics from '@react-native-firebase/crashlytics'

export const sendCrashlyticsAttributes = async () => {
    const data = await loggingService.basicLogInfo({
        level: Level.INFO,
        message: 'App Data',
    })

    crashlytics().setAttributes({
        app: data.app,
        signedIn: String(data.signedIn),
        userId: data.userId,
    })
}
