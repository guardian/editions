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
    cardAndPlaque: {
        backgroundColor?: string
        borderColor?: string
        color?: string
    }
    headline: {}
}

export type AppAppearance = 'default' | 'primary'
export type ArticleAppearance =
    | 'default'
    | 'news'
    | 'lifestyle'
    | 'comment'
    | 'longread'

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
        cardAndPlaque: {
            backgroundColor: color.background,
            borderColor: color.line,
        },
        headline: {
            color: color.text,
        },
    },
    news: {
        cardAndPlaque: {},
        headline: {
            color: color.palette.news.main,
        },
    },
    comment: {
        cardAndPlaque: {
            backgroundColor: color.palette.opinion.faded,
        },
        headline: {
            color: color.palette.opinion.main,
            fontFamily: 'GHGuardianHeadline-Light',
        },
    },
    lifestyle: {
        cardAndPlaque: {
            backgroundColor: color.palette.lifestyle.faded,
        },
        headline: {
            fontFamily: 'GHGuardianHeadline-Bold',
            color: color.palette.lifestyle.main,
        },
    },
    longread: {
        cardAndPlaque: {
            backgroundColor: color.palette.neutral[7],
            color: color.palette.neutral[100],
        },
        headline: { color: color.palette.neutral[100] },
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

export const useArticleAppearance = (): {
    name: ArticleAppearance
    appearance: ArticleAppearanceStyles
} => ({
    name: useContext(ArticleAppearanceContext),
    appearance: articleAppearances[useContext(ArticleAppearanceContext)],
})
