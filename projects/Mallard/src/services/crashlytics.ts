import { loggingService, Level } from 'src/services/logging'
import crashlytics from '@react-native-firebase/crashlytics'
import { gdprAllowPerformanceKey, getSetting } from 'src/helpers/settings'

const enableCrashlytics = async (): Promise<Boolean> => {
    const defVal = crashlytics().isCrashlyticsCollectionEnabled
    console.log('Crashlytics Default:', defVal)

    const crashlyticsPermissionGranted: boolean =
        (await getSetting(gdprAllowPerformanceKey)) == true
    console.log('User Perform:', crashlyticsPermissionGranted)

    await crashlytics().setCrashlyticsCollectionEnabled(
        crashlyticsPermissionGranted,
    )

    return crashlyticsPermissionGranted
}

export const sendCrashlyticsAttributes = async () => {
    const isEnabled = await enableCrashlytics()
    if (isEnabled) {
        crashlytics().log('Crashlytics initialized')
        console.log('Crashlytics initialized')
    } else {
        console.log('Crashlytics is Disabled')
        return
    }

    const data = await loggingService.basicLogInfo({
        level: Level.INFO,
        message: 'App Data',
    })

    // send some basic app/user attributes to crashlytics
    crashlytics().setAttributes({
        signedIn: String(data.signedIn),
        hasCasCode: String(data.casCode !== null || data.casCode !== ''),
        hasDigiSub: String(data.digitalSub),
        networkStatus: data.networkStatus,
    })
}
