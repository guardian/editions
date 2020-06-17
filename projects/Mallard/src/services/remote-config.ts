import remoteConfig from '@react-native-firebase/remote-config'

// see https://rnfirebase.io/remote-config/usage for docs

interface RemoteConfig {
    init(): void
    getBoolean(key: string): boolean
}

class RemoteConfigService implements RemoteConfig {
    private initialized: boolean

    constructor() {
        this.initialized = false
    }

    private setInitialized(isInitialized: boolean) {
        this.initialized = isInitialized
    }

    async init() {
        await remoteConfig()
            .setDefaults({
                apple_sign_in: false,
                lightbox_enabled: false,
            })
            // fetch config, cache for 5mins
            // NOTE: this cache persists when app is reloaded
            .then(() => remoteConfig().fetch(300))
            // activate() replaces the default config with what has been fetched
            .then(() => {
                remoteConfig().activate()
                this.setInitialized(true)
                console.log('Remote config defaults set, fetched & activated!')
                true
            })
            .catch(() => {
                this.setInitialized(false)
                console.log(
                    'Remote config not activated - using default or cached values.',
                )
            })
    }

    getBoolean(key: string): boolean {
        if (this.initialized) {
            return remoteConfig().getValue(key).value as boolean
        }

        return false
    }
}

export const remoteConfigService = new RemoteConfigService()
