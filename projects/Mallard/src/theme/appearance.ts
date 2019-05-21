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
    backgrounds: {
        backgroundColor?: string
        borderColor?: string
    }
    text: {
        color?: string
    }
    headline: {
        color?: string
        fontFamily?: string
    }
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
        backgrounds: {
            backgroundColor: color.background,
            borderColor: color.line,
        },
        text: {
            color: color.text,
        },
        headline: {},
    },
    news: {
        backgrounds: {},
        text: {
            color: color.palette.news.main,
        },
        headline: {},
    },
    comment: {
        backgrounds: {
            backgroundColor: color.palette.opinion.faded,
        },
        text: {
            color: color.palette.opinion.main,
        },
        headline: {
            fontFamily: 'GHGuardianHeadline-Light',
        },
    },
    lifestyle: {
        backgrounds: {
            backgroundColor: color.palette.lifestyle.faded,
        },
        text: {
            color: color.palette.lifestyle.main,
        },
        headline: {
            fontFamily: 'GHGuardianHeadline-Bold',
        },
    },
    longread: {
        backgrounds: {
            backgroundColor: color.palette.neutral[7],
        },
        text: { color: color.palette.neutral[100] },
        headline: {},
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
