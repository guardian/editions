import { useEffect, useState } from 'react'
import { createProviderFromHook, providerHook } from 'src/helpers/provider'
import {
    getAllSettings,
    onSettingChanged,
    Settings,
    storeSetting,
    UnsanitizedSetting,
} from 'src/helpers/settings'

/*
Fetch settings stored in AsyncStorage on mount
*/
type SetterFn = (setting: keyof Settings, value: UnsanitizedSetting) => void

const useSettingsFromStore = (): [
    Settings | null,
    {
        setSetting: SetterFn
        storeSetting: SetterFn
    },
] => {
    const [settings, setSettings] = useState(null as Settings | null)
    const setSetting: SetterFn = (setting, value) => {
        setSettings(settings => {
            if (!settings) {
                console.warn(
                    'Settings had not yet been fetched when trying to set a setting, ignoring setting update.',
                )
                return settings
            }
            return { ...settings, [setting]: value }
        })
    }
    useEffect(() => {
        return onSettingChanged((key, val) => {
            setSetting(key, val)
        })
    }, [])
    useEffect(() => {
        getAllSettings().then(s => setSettings(s))
    }, [])
    return [settings, { setSetting, storeSetting }]
}

/*
extract a single setting and give it its own context
*/
const createSingleSettingHook = (key: keyof Settings) => () => {
    const [settings] = useSettingsFromStore()
    return (
        settings &&
        providerHook({
            getter: settings[key],
            setter: () => {},
        })
    )
}

const applyExtractSettings = <E extends keyof Settings>(
    extractSettings: (E)[],
) => {
    //eslint-disable-next-line @typescript-eslint/no-object-literal-type-assertion
    let extractedGetterHooks = {} as {
        [key in typeof extractSettings[number]]: () => Settings[key]
    }
    let providers = []

    for (let setting of extractSettings) {
        const { Provider, useAsGetterHook } = createProviderFromHook(
            createSingleSettingHook(setting),
        )
        providers.push(Provider)
        extractedGetterHooks[
            setting
        ] = useAsGetterHook as () => Settings[typeof setting]
    }
    return { providers, extractedGetterHooks }
}

export { applyExtractSettings, useSettingsFromStore }
