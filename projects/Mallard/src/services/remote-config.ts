import remoteConfig, {
    firebase,
    FirebaseRemoteConfigTypes,
} from '@react-native-firebase/remote-config'
import { isInBeta } from 'src/helpers/release-stream'
import { Platform } from 'react-native'

// see https://rnfirebase.io/remote-config/usage for docs

export type RemoteStringValue = string | undefined

interface RemoteConfig {
    init(): void
    getBoolean(key: string): boolean
    getString(key: string): RemoteStringValue
}

const remoteConfigDefaults = {
    apple_sign_in: false,
    lightbox_enabled: false,
    logging_enabled: true,
    default_locale: true,
}

const configValues = {
    // fetch config, cache for 5mins. This cache persists when app is reloaded
    minimumFetchInterval: 300,
    isDeveloperModeEnabled: __DEV__, // dev mode bypass caching and enable quick testing
}

class RemoteConfigService implements RemoteConfig {
    private initialized: boolean
    private rmConfig: FirebaseRemoteConfigTypes.Module

    constructor() {
        this.initialized = false
        this.rmConfig = isInBeta()
            ? this.createSecondaryFbApp().remoteConfig()
            : remoteConfig()
    }

    private setInitialized(isInitialized: boolean) {
        this.initialized = isInitialized
    }

    init() {
        console.log('Initializing Firebase Secondary app already created')

        this.rmConfig
            .setDefaults(remoteConfigDefaults)
            .then(() => this.rmConfig.setConfigSettings(configValues))
            .then(() => {
                this.rmConfig.fetchAndActivate()
                this.setInitialized(true)
                console.log('Remote config fetched & activated!')
                if (__DEV__) console.log(this.rmConfig.getAll())
            })
            .catch(() => {
                this.setInitialized(false)
                console.log(
                    'Remote config not activated - something went wrong',
                )
            })
    }

    private async createSecondaryFbApp() {
        // Secondary Firebase project credentials from https://console.firebase.google.com/project/guardian-daily-edition-code-2/settings/general/android:com.guardian.editions
        const credentials = {
            clientId: Platform.select({
                ios:
                    '385815722272-ov3324su0gb6nqrsu9f5o5gqortuh5th.apps.googleusercontent.com',
                android: '',
            }),
            appId: Platform.select({
                ios: '1:385815722272:ios:4a237b6066a85ba4f2bf45',
                android: '1:385815722272:android:5aefffd4abea8974f2bf45',
            }),
            apiKey: Platform.select({
                ios: 'AIzaSyD3qpzIH-qiNSgHb23wJAyH758gYvboJIQ',
                android: 'AIzaSyDwnpZbUyNh7dtTTyM8IN0m_NH3P41LEs8',
            }),
            databaseURL: 'https://guardian-daily-edition-code-2.firebaseio.com',
            storageBucket: '',
            messagingSenderId: '',
            projectId: 'guardian-daily-edition-code-2',
        }

        const app = await firebase.initializeApp(credentials, 'SECONDARY_APP')
        console.log('NEW Firebase app created: ', app.remoteConfig)
        return app
    }

    getBoolean(key: string): boolean {
        if (this.initialized) {
            return this.rmConfig.getValue(key).value as boolean
        }

        return false
    }

    getString(key: string): RemoteStringValue {
        if (this.initialized) {
            return this.rmConfig.getValue(key).value as string
        }

        return undefined
    }
}

export const remoteConfigService = new RemoteConfigService()
