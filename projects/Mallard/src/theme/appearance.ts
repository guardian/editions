import { color } from './color'
import { createContext, useContext } from 'react'

/*
Appearances are like themes for the core UI
*/
interface AppAppearanceStyles {
    backgroundColor: string
    borderColor: string
    color: string
    dimColor: string
}
type AppAppearance = 'default' | 'primary'

const AppAppearances: { [key in AppAppearance]: AppAppearanceStyles } = {
    primary: {
        backgroundColor: color.primary,
        borderColor: color.lineOverPrimary,
        color: color.textOverPrimary,
        dimColor: color.textOverPrimary,
    },
    default: {
        backgroundColor: color.background,
        borderColor: color.line,
        color: color.text,
        dimColor: color.dimText,
    },
}

const AppAppearanceContext = createContext<AppAppearance>('default')
export const WithAppAppearance = AppAppearanceContext.Provider

export const useAppAppearance = (): AppAppearanceStyles =>
    AppAppearances[useContext(AppAppearanceContext)]
