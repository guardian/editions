import { loggingService, Level } from 'src/services/logging'
import crashlytics, {
    FirebaseCrashlyticsTypes,
} from '@react-native-firebase/crashlytics'
import { gdprAllowPerformanceKey, getSetting } from 'src/helpers/settings'

export interface CrashlyticsService {
    init(): Promise<void>
    captureException(err: Error): void
}

class CrashlyticsServiceImpl implements CrashlyticsService {
    crashlytics: FirebaseCrashlyticsTypes.Module

    constructor(crashlytics: FirebaseCrashlyticsTypes.Module) {
        this.crashlytics = crashlytics
    }

    async init() {
        const isEnabled = await this.enableCrashlytics()
        if (isEnabled) {
            this.crashlytics.log('Crashlytics initialized')
            console.log('Crashlytics initialized')
        } else {
            console.log('Crashlytics is Disabled')
            return
        }

        await this.sendBasicAttributes()
    }

    private enableCrashlytics = async (): Promise<Boolean> => {
        const defVal = this.crashlytics.isCrashlyticsCollectionEnabled
        console.log('Crashlytics Default:', defVal)

        const crashlyticsPermissionGranted: boolean =
            (await getSetting(gdprAllowPerformanceKey)) == true
        console.log('User Perform:', crashlyticsPermissionGranted)

        await this.crashlytics.setCrashlyticsCollectionEnabled(
            crashlyticsPermissionGranted,
        )

        return crashlyticsPermissionGranted
    }

    private sendBasicAttributes = async () => {
        const data = await loggingService.basicLogInfo({
            level: Level.INFO,
            message: 'App Data',
        })

        this.crashlytics.setAttributes({
            signedIn: String(data.signedIn),
            hasCasCode: String(data.casCode !== null || data.casCode !== ''),
            hasDigiSub: String(data.digitalSub),
            networkStatus: data.networkStatus,
        })
    }

    captureException(err: Error): void {
        this.crashlytics.recordError(err)
    }
}

const crashlyticsService = new CrashlyticsServiceImpl(crashlytics())
export { crashlyticsService }
