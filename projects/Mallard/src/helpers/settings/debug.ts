import { enableEditionMenuCache } from 'src/helpers/storage'
import { AsyncCache } from 'src/authentication/lib/Authorizer'

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

const fetchEditionMenuEnabledSetting = () =>
    fetchDebugSetting(enableEditionMenuCache)
const setEditionMenuEnabledSetting = (toggle: boolean) =>
    setDebugSetting(toggle, enableEditionMenuCache)

export { fetchEditionMenuEnabledSetting, setEditionMenuEnabledSetting }
