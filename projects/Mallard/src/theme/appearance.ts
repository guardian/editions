import { color } from './color'
import { createContext, useContext } from 'react'

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
    /*
    You can spread this over any 'hero'
    background in the article page
    */
    backgrounds: {
        backgroundColor?: string
        borderColor?: string
    }
    /*
    Spread this over text and icons
    */
    text: {
        color?: string
    }
    /*
    Overrides for the headline
    */
    headline: {
        color?: string
        fontFamily?: string
    }
    /*
    Overrides for the kicker
    */
    kicker: {
        color?: string
    }
    /*
    Overrides for the standfirst
    */
    standfirst: {
        color?: string
    }
    /*
    Overrides for the byline
    */
    byline: {
        color?: string
    }
    /*
    Feel free to add more stuff as needed!!
    */
}

export type AppAppearance = 'default' | 'primary'
export type ArticleAppearance =
    | 'default'
    | 'news'
    | 'lifestyle'
    | 'sport'
    | 'culture'
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
        kicker: {},
        byline: {},
        standfirst: {},
    },
    news: {
        backgrounds: {},
        text: {},
        headline: {},
        kicker: {},
        byline: {
            color: color.palette.news.main,
        },
        standfirst: {},
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
        kicker: {},
        byline: {},
        standfirst: {},
    },
    sport: {
        backgrounds: {
            backgroundColor: color.palette.sport.faded,
        },
        text: {
            color: color.palette.sport.main,
        },
        headline: {
            fontFamily: 'GHGuardianHeadline-Light',
            color: color.text,
        },
        kicker: {},
        byline: {},
        standfirst: { color: color.text },
    },
    culture: {
        backgrounds: {
            backgroundColor: color.palette.culture.faded,
        },
        text: {
            color: color.palette.culture.main,
        },
        headline: {
            color: color.text,
        },
        kicker: {},
        byline: {},
        standfirst: {
            color: color.text,
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
        kicker: {},
        byline: {},
        standfirst: {},
    },
    longread: {
        backgrounds: {
            backgroundColor: color.palette.neutral[7],
        },
        text: { color: color.palette.neutral[100] },
        headline: {},
        kicker: {},
        byline: {},
        standfirst: {},
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
