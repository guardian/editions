import { useState, useEffect } from 'react'

import {
    storeSetting,
    Settings,
    getAllSettings,
    UnsanitizedSetting,
    gdprSwitchSettings,
} from 'src/helpers/settings'
import { createProviderHook } from 'src/helpers/provider'

type SettingsFromContext = [
    Settings,
    (setting: keyof Settings, value: UnsanitizedSetting) => void,
]

/**
 * Fetch settings stored in AsyncStorage on mount
 */
const useSettingsInCtx = (): SettingsFromContext | null => {
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
    return settings && [settings, setSetting]
}

const {
    Provider: SettingsProvider,
    useAsHook: useSettings,
} = createProviderHook<SettingsFromContext>(useSettingsInCtx)

const useGdprSwitches = () => {
    const [settings, setSetting] = useSettings()

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

export { SettingsProvider, useSettings, useGdprSwitches }
