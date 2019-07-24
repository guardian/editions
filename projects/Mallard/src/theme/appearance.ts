import { color } from './color'
import { createContext, useContext } from 'react'
import merge from 'deepmerge'
import { ColorFromPalette } from 'src/common'
import { metrics } from './spacing'
import { getColor } from 'src/helpers/transform'

/*
Types
*/
export interface AppAppearanceStyles {
    backgroundColor: string
    cardBackgroundColor: string
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
    Card bg overrides
    */
    cardBackgrounds: {
        backgroundColor?: string
    }
    /*
    Contrast-y cards
    */
    contrastCardBackgrounds: {
        backgroundColor?: string
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
        marginBottom?: number
    }
    /*
    Feel free to add more stuff as needed!!
    */
}

export type AppAppearance = 'default' | 'primary' | 'tertiary'

export const appAppearances: { [key in AppAppearance]: AppAppearanceStyles } = {
    primary: {
        backgroundColor: color.primaryDarker,
        cardBackgroundColor: color.primaryDarker,
        borderColor: color.lineOverPrimary,
        color: color.textOverPrimary,
        dimColor: color.textOverPrimary,
    },
    default: {
        backgroundColor: color.dimBackground,
        cardBackgroundColor: color.background,
        borderColor: color.line,
        color: color.text,
        dimColor: color.dimText,
    },
    tertiary: {
        backgroundColor: color.dimBackground,
        cardBackgroundColor: color.dimBackground,
        borderColor: '#052962',
        color: '#052962',
        dimColor: '#052962',
    },
}

/*
COLOURS
*/
export const articleAppearances: {
    [key in ColorFromPalette]: ArticleAppearanceStyles
} = {
    neutral: {
        backgrounds: {
            backgroundColor: color.background,
            borderColor: color.line,
        },
        contrastCardBackgrounds: {
            backgroundColor: color.palette.neutral[7],
        },
        cardBackgrounds: {},
        text: {
            color: color.text,
        },
        headline: {},
        kicker: {},
        byline: {
            marginBottom: metrics.vertical,
        },
        standfirst: {},
    },
    news: {
        backgrounds: {},
        cardBackgrounds: {},
        contrastCardBackgrounds: {},
        text: {},
        headline: {
            color: color.dimText,
        },
        kicker: {},
        byline: {
            marginBottom: metrics.vertical,
        },
        standfirst: {
            color: color.text,
        },
    },
    opinion: {
        backgrounds: {
            backgroundColor: color.palette.opinion.faded,
        },
        cardBackgrounds: {},
        contrastCardBackgrounds: {},
        text: {
            color: color.palette.opinion.main,
        },
        headline: {
            fontFamily: 'GHGuardianHeadline-Light',
        },
        kicker: {},
        byline: {
            marginBottom: metrics.vertical,
        },
        standfirst: {},
    },
    sport: {
        backgrounds: {
            backgroundColor: color.palette.sport.faded,
        },
        cardBackgrounds: {},
        contrastCardBackgrounds: {
            backgroundColor: color.palette.sport.main,
        },
        text: {
            color: color.palette.sport.main,
        },
        headline: {
            fontFamily: 'GHGuardianHeadline-Light',
            color: color.text,
        },
        kicker: {},
        byline: {
            marginBottom: metrics.vertical,
        },
        standfirst: { color: color.text },
    },
    culture: {
        backgrounds: {
            backgroundColor: color.palette.culture.faded,
        },
        cardBackgrounds: {},
        contrastCardBackgrounds: {},
        text: {
            color: color.palette.culture.main,
        },
        headline: {
            color: color.text,
        },
        kicker: {},
        byline: {
            marginBottom: metrics.vertical,
        },
        standfirst: {
            color: color.text,
        },
    },
    lifestyle: {
        backgrounds: {
            backgroundColor: color.palette.lifestyle.faded,
        },
        cardBackgrounds: {},
        contrastCardBackgrounds: {},
        text: {},
        headline: {
            //fontFamily: 'GHGuardianHeadline-Bold',
        },
        kicker: {
            color: color.palette.lifestyle.main,
        },
        byline: {
            marginBottom: metrics.vertical,
        },
        standfirst: {},
    },
}

/*
  Exports
 */
const AppAppearanceContext = createContext<AppAppearance>('default')
const ArticleAppearanceContext = createContext<ColorFromPalette>('neutral')

export const WithAppAppearance = AppAppearanceContext.Provider
export const useAppAppearance = (): AppAppearanceStyles =>
    appAppearances[useContext(AppAppearanceContext)]

export const WithArticleAppearance = ArticleAppearanceContext.Provider

export const useArticleAppearance = (): {
    name: ColorFromPalette
    appearance: ArticleAppearanceStyles
} => {
    const name = useContext(ArticleAppearanceContext)
    return {
        name,
        appearance: name
            ? merge(articleAppearances.neutral, articleAppearances[name])
            : articleAppearances.neutral,
    }
}

export const useArticleToneColor = () =>
    getColor({ color: useArticleAppearance().name })
