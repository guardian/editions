import { color } from './color'
import { createContext, useContext } from 'react'

/*
App appearances
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
/*Article appearances */
interface ArticleAppearanceStyles {
    card: {}
    headline: {}
}
type ArticleAppearance = 'default' | 'news' | 'lifestyle'

const ArticleAppearances: {
    [key in ArticleAppearance]: ArticleAppearanceStyles
} = {
    default: {
        card: {
            backgroundColor: color.primary,
            borderColor: color.lineOverPrimary,
        },
        headline: {
            color: color.textOverPrimary,
            fontFamily: 'GHGuardianHeadline-Regular',
        },
    },
    lifestyle: {
        card: {
            backgroundColor: color.palette.lifestyle.faded,
        },
        headline: {
            fontFamily: 'GHGuardianHeadline-Medium',
            color: color.palette.lifestyle.main,
        },
    },
}

const getCtx = <AppearanceIndex, Styles>(defaultAppearance, appearances: A) => {
    const AppearanceContext = createContext<AppearanceIndex>(defaultAppearance)
    const WithAppearance = AppearanceContext.Provider

    const useAppearance = (): Styles =>
        appearances[useContext(AppearanceContext)]

    return [WithAppearance, useAppearance]
}

export const [WithAppAppearance, useAppAppearance] = getCtx(
    'default',
    AppAppearances,
)
export const [WithArticleAppearance, useArticleAppearance] = getCtx(
    'default',
    ArticleAppearances,
)
