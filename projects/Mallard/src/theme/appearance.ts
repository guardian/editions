import { color } from './color'
import { createContext, useContext } from 'react'
import { Animated } from 'react-native'

/*
Types
*/
interface AppAppearanceStyles {
    backgroundColor: string
    borderColor: string
    color: string
    dimColor: string
}
interface ArticleAppearanceStyles {
    card: {}
    headline: {}
}

type AppAppearance = 'default' | 'primary'
type ArticleAppearance = 'default' | 'news' | 'lifestyle' | 'comment'

const appAppearances: { [key in AppAppearance]: AppAppearanceStyles } = {
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

/*
COLOURS
*/
export const articleAppearances: {
    [key in ArticleAppearance]: ArticleAppearanceStyles
} = {
    default: {
        card: {
            backgroundColor: color.background,
            borderColor: color.line,
        },
        headline: {
            color: color.text,
        },
    },
    news: {
        card: {},
        headline: {
            color: color.palette.news.main,
        },
    },
    comment: {
        card: {
            backgroundColor: color.palette.opinion.faded,
        },
        headline: {
            color: color.palette.opinion.main,
            fontFamily: 'GHGuardianHeadline-Light',
        },
    },
    lifestyle: {
        card: {
            backgroundColor: color.palette.lifestyle.faded,
        },
        headline: {
            fontFamily: 'GHGuardianHeadline-Bold',
            color: color.palette.lifestyle.main,
        },
    },
}
/*
  Exports
 */
const AppAppearanceContext = createContext<AppAppearance>('default')
const ArticleAppearanceContext = createContext<ArticleAppearance>('default')

export const WithAppAppearance = AppAppearanceContext.Provider
export const useAppAppearance = (): AppAppearanceStyles =>
    appAppearances[useContext(AppAppearanceContext)]

export const WithArticleAppearance = ArticleAppearanceContext.Provider
export const useArticleAppearance = (): ArticleAppearanceStyles =>
    articleAppearances[useContext(ArticleAppearanceContext)]
