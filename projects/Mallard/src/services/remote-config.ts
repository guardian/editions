import remoteConfig from '@react-native-firebase/remote-config'
import { errorService } from './errors'

// see https://rnfirebase.io/remote-config/usage for docs
export const initialiseRemoteConfig = async () => {
    const activated = await remoteConfig()
        .setDefaults({
            apple_sign_in: false,
            lightbox_enabled: false,
        })
        // fetch config, cache for 5mins
        // NOTE: this cache persists when app is reloaded
        .then(() => remoteConfig().fetch(300))
        // activate() replaces the default config with what has been fetched
        .then(() => remoteConfig().activate())
        .catch(error => errorService.captureException(error))

    if (activated) {
        console.log('Remote config defaults set, fetched & activated!')
    } else {
        console.log(
            'Remote config not activated - using default or cached values.',
        )
    }
}
