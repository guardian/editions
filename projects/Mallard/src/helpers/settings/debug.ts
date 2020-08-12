import { enableEditionMenuCache } from 'src/helpers/storage'
import { AsyncCache } from 'src/authentication/lib/Authorizer'
import { isInBeta } from '../release-stream'
import { remoteConfigService } from 'src/services/remote-config'

const setDebugSetting = async (toggle: boolean, cache: AsyncCache<boolean>) => {
    await cache.set(toggle)
}

const fetchDebugSetting = async (
    cache: AsyncCache<boolean>,
): Promise<boolean> => {
    try {
        const debugStorage = await cache.get()

        if (debugStorage === null) {
            setDebugSetting(false, cache)
            return false
        }
        return debugStorage
    } catch (e) {
        return false
    }
}

const fetchEditionMenuEnabledSetting = (isInBeta: boolean) => {
    if (isInBeta || remoteConfigService.getBoolean('enable_multi_edition'))
        return Promise.resolve(true)

    return fetchDebugSetting(enableEditionMenuCache)
}

const setEditionMenuEnabledSetting = (toggle: boolean) =>
    setDebugSetting(toggle, enableEditionMenuCache)

export { fetchEditionMenuEnabledSetting, setEditionMenuEnabledSetting }
