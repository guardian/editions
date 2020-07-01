import remoteConfig from '@react-native-firebase/remote-config'

// see https://rnfirebase.io/remote-config/usage for docs

export type RemoteStringValue = string | undefined

interface RemoteConfig {
    init(): void
    getBoolean(key: RemoteConfigProperty): boolean
    getString(key: RemoteConfigProperty): RemoteStringValue
}

const remoteConfigDefaults = {
    logging_enabled: true,
    default_locale: true,
}

export const RemoteConfigProperties = [
    'logging_enabled',
    'default_locale',
] as const

export type RemoteConfigProperty = typeof RemoteConfigProperties[number]

const configValues = {
    // fetch config, cache for 5mins. This cache persists when app is reloaded
    minimumFetchInterval: 300,
    isDeveloperModeEnabled: __DEV__, // dev mode bypass caching and enable quick testing
}

class RemoteConfigService implements RemoteConfig {
    private initialized: boolean

    constructor() {
        this.initialized = false
    }

    private setInitialized(isInitialized: boolean) {
        this.initialized = isInitialized
    }

    init() {
        remoteConfig()
            .setDefaults(remoteConfigDefaults)
            .then(() => remoteConfig().setConfigSettings(configValues))
            .then(() => {
                remoteConfig().fetchAndActivate()
                this.setInitialized(true)
                console.log('Remote config fetched & activated!')
                if (__DEV__) console.log(remoteConfig().getAll())
            })
            .catch(() => {
                this.setInitialized(false)
                console.log(
                    'Remote config not activated - something went wrong',
                )
            })
    }

    getBoolean(key: RemoteConfigProperty): boolean {
        if (this.initialized) {
            return remoteConfig().getValue(key).value as boolean
        }

        return false
    }

    getString(key: RemoteConfigProperty): RemoteStringValue {
        if (this.initialized) {
            return remoteConfig().getValue(key).value as string
        }

        return undefined
    }
}

export const remoteConfigService = new RemoteConfigService()
