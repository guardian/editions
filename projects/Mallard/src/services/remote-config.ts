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
    join_beta_button_enabled: false,
    enable_multi_edition: false,
    auto_edition_detection: false,
}

export const RemoteConfigProperties = [
    'logging_enabled',
    'join_beta_button_enabled',
    'enable_multi_edition',
    'auto_edition_detection',
] as const

export type RemoteConfigProperty = typeof RemoteConfigProperties[number]

const configValues = {
    // fetch config, cache for 5mins. This cache persists when app is reloaded
    minimumFetchInterval: 300,
    isDeveloperModeEnabled: __DEV__, // dev mode bypass caching and enable quick testing
}

class RemoteConfigService implements RemoteConfig {
    init() {
        remoteConfig()
            .setDefaults(remoteConfigDefaults)
            .then(() => remoteConfig().setConfigSettings(configValues))
            .then(() => {
                remoteConfig()
                    .fetchAndActivate()
                    .then(activated => {
                        if (activated) {
                            console.log('Remote config fetched & activated!')
                            if (__DEV__) console.log(remoteConfig().getAll())
                        } else {
                            console.log('Remote config NOT activated!')
                        }
                    })
            })
            .catch(() => {
                console.log(
                    'Remote config not activated - something went wrong',
                )
            })
    }

    getBoolean(key: RemoteConfigProperty): boolean {
        return remoteConfig().getValue(key).value as boolean
    }

    getString(key: RemoteConfigProperty): RemoteStringValue {
        return remoteConfig().getValue(key).value as string
    }
}

export const remoteConfigService = new RemoteConfigService()
