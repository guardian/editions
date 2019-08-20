import { useEffect, useState } from 'react'
import { createProviderFromHook, providerHook } from 'src/helpers/provider'
import {
    gdprSwitchSettings,
    getAllSettings,
    Settings,
    storeSetting,
    UnsanitizedSetting,
} from 'src/helpers/settings'

/**
 * Fetch settings stored in AsyncStorage on mount
 */
const useSettingsInCtx = () => {
    const [settings, setSettings] = useState(null as Settings | null)
    const setSetting = (setting: keyof Settings, value: UnsanitizedSetting) => {
        setSettings(settings => {
            if (!settings) {
                console.warn(
                    'Settings had not yet been fetched when trying to set a setting, ignoring setting update.',
                )
                return settings
            }
            return { ...settings, [setting]: value }
        })
        storeSetting(setting, value)
    }
    useEffect(() => {
        getAllSettings().then(s => setSettings(s))
    }, [])
    return settings && providerHook({ getter: settings, setter: setSetting })
}

const {
    Provider: SettingsProvider,
    useAsSetterHook: useSettings,
    useAsGetterHook: useSettingsValue,
} = createProviderFromHook(useSettingsInCtx)

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

export { SettingsProvider, useSettings, useSettingsValue, useGdprSwitches }
