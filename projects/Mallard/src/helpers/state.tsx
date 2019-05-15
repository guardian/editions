import React, {
    createContext,
    useContext,
    useState,
    Context,
    useEffect,
} from 'react'
import AsyncStorage from '@react-native-community/async-storage'

const DEFAULT_URL = 'https://editions-api.gutools.co.uk'

type Settings = {
    apiUrl: string
}

const defaultSettings: Settings = {
    apiUrl: DEFAULT_URL,
}

type StateContext = [Settings, (setting: keyof Settings, value: string) => void]

const useSettings = (): StateContext => {
    const [state, setState] = useState(defaultSettings)
    const setSetting = (setting: keyof Settings, value: string) => {
        setState({ [setting]: value })
        AsyncStorage.setItem('@setting-' + setting, value)
    }
    useEffect(() => {
        for (let setting of Object.keys(state)) {
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
