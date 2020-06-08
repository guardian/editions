import { lightboxSettingCache } from 'src/helpers/storage'

const setlightboxSetting = async (lightboxEnabled: boolean) => {
    await lightboxSettingCache.set(lightboxEnabled)
}

const fetchLightboxSetting = async (): Promise<boolean> => {
    try {
        const lightboxEnabledStorage = await lightboxSettingCache.get()

        if (lightboxEnabledStorage === null) {
            setlightboxSetting(false)
            return false
        }
        return lightboxEnabledStorage
    } catch (e) {
        return false
    }
}

export { fetchLightboxSetting, setlightboxSetting }
