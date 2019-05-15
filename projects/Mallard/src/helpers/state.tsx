import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-community/async-storage'

interface Settings {
    apiUrl: string
}
const defaultSettings: Settings = {
    apiUrl: 'https://editions-api.gutools.co.uk',
}

type StateContext = [Settings, (setting: keyof Settings, value: string) => void]

const useSettings = (): StateContext => {
    const [state, setState] = useState(defaultSettings)
    const setSetting = (setting: keyof Settings, value: string) => {
        setState({ [setting]: value })
        AsyncStorage.setItem('@setting-' + setting, value)
    }
    useEffect(() => {
        for (let [setting] of Object.entries(state)) {
            AsyncStorage.getItem('@setting-' + setting).then(value => {
                //@ts-ignore
                setState({ [setting]: value })
            })
        }
    }, [])
    return [state, setSetting]
}

//@ts-ignore
export const StateContext = createContext<StateContext>(null)
export const StateProvider = ({ children }: { children: React.ReactNode }) => (
    <StateContext.Provider value={useSettings()}>
        {children}
    </StateContext.Provider>
)
export const useStateValue = () => useContext(StateContext)
