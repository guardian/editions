import { useEffect, useState } from 'react'
import {
    createProviderFromHook,
    providerHook,
    nestProviders,
} from 'src/helpers/provider'
import {
    UnsanitizedSetting,
    onSettingChanged,
    getAllSettings,
    gdprSwitchSettings,
    Settings,
    storeSetting,
} from 'src/helpers/settings'

/**
 * Fetch settings stored in AsyncStorage on mount
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

const extractedSettings = ['isUsingProdDevtools']

/* create settings */
const makeSettings = () => {
    const {
        Provider: BaseProvider,
        useAsSetterHook,
        useAsGetterHook,
    } = createProviderFromHook(() => {
        const [settings, { storeSetting }] = useSettingsFromStore()
        return (
            settings && providerHook({ getter: settings, setter: storeSetting })
        )
    })

    let providers = []
    let extractedGetterHooks: {
        [key in typeof extractedSettings[number]]: () => Settings[keyof Settings]
    } = {}

    for (const setting of extractedSettings) {
        const { Provider, useAsGetterHook } = createProviderFromHook(
            createSingleSettingHook('isUsingProdDevtools'),
        )
        providers.push(Provider)
        extractedGetterHooks[setting] = useAsGetterHook
    }

    const Provider = nestProviders(BaseProvider, ...providers)

    return { Provider, extractedGetterHooks, useAsSetterHook, useAsGetterHook }
}

const {
    Provider: SettingsProvider,
    extractedGetterHooks: useExtractedSettingValue,
    useAsSetterHook: useSettings,
    useAsGetterHook: useSettingsValue,
} = makeSettings()

/* gdpr switchez */
const useGdprSwitches = () => {
    const setSetting = useSettings()
    const settings = useSettingsValue()

    /*
    if a user consents to all via any UI
    means we wanna flip their null switches
    but respect the explicit no's
    */
    const enableNulls = () => {
        gdprSwitchSettings.map(sw => {
            if (settings[sw] === null) {
                setSetting(sw, true)
            }
        })
    }

    /*
    for our own convenience let's add
    a quick toggle to set switches back to
    null (which is made impossible from
    the userland UI by design)
    */
    const DEVMODE_resetAll = () => {
        gdprSwitchSettings.map(sw => {
            setSetting(sw, null)
        })
    }

    return { enableNulls, DEVMODE_resetAll }
}

export {
    SettingsProvider,
    useExtractedSettingValue,
    useSettings,
    useSettingsValue,
    useGdprSwitches,
}
