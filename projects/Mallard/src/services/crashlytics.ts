import { loggingService, Level } from 'src/services/logging'
import crashlytics from '@react-native-firebase/crashlytics'
import { gdprAllowPerformanceKey, getSetting } from 'src/helpers/settings'

export interface CrashlyticsService {
    init(): Promise<void>
    captureException(err: Error): void
}

class CrashlyticsServiceImpl implements CrashlyticsService {
    async init() {
        const isEnabled = await this.enableCrashlytics()
        if (isEnabled) {
            crashlytics().log('Crashlytics initialized')
            console.log('Crashlytics initialized')
        } else {
            console.log('Crashlytics is Disabled')
            return
        }

        await this.sendBasicAttributes()
    }

    private enableCrashlytics = async (): Promise<Boolean> => {
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

    private sendBasicAttributes = async () => {
        const data = await loggingService.basicLogInfo({
            level: Level.INFO,
            message: 'App Data',
        })

        crashlytics().setAttributes({
            signedIn: String(data.signedIn),
            hasCasCode: String(data.casCode !== null || data.casCode !== ''),
            hasDigiSub: String(data.digitalSub),
            networkStatus: data.networkStatus,
        })
    }

    captureException(err: Error): void {
        crashlytics().recordError(err)
    }
}

export const crashlyticsService = new CrashlyticsServiceImpl()
