import remoteConfig from '@react-native-firebase/remote-config'

// see https://rnfirebase.io/remote-config/usage for docs
export const initialiseRemoteConfig = async () => {
    const activated = await remoteConfig()
        .setDefaults({
            apple_sign_in: false,
        })
        // fetch config, cache for 15mins
        // NOTE: this cache persists when app is reloaded
        .then(() => remoteConfig().fetch(900))
        // activate() replaces the default config with what has been fetched
        .then(() => remoteConfig().activate())

    if (activated) {
        console.log('Remote config defaults set, fetched & activated!')
    } else {
        console.warn('Failed to activate remote config - using default values.')
    }
}
