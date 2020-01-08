import {
    Collection,
    CAPIArticle,
    Appearance,
    FrontCardAppearance,
} from 'src/common'
import { palette, PillarColours } from '@guardian/pasteup/palette'
import { ArticlePillar } from '../../../Apps/common/src'

export interface FlatCard {
    collection: Collection
    appearance: FrontCardAppearance | null
    articles: CAPIArticle[]
}

const colorMap = {
    news: palette.news,
    opinion: palette.opinion,
    sport: palette.sport,
    culture: palette.culture,
    lifestyle: palette.lifestyle,
    neutral: {
        dark: palette.neutral[7],
        main: palette.neutral[7],
        bright: palette.neutral[20],
        pastel: palette.neutral[60],
        faded: palette.neutral[97],
    },
}

export const getPillarColors = (pillar: ArticlePillar): PillarColours => {
    return colorMap[pillar]
}

export const getColor = (app: Appearance): string => {
    switch (app.type) {
        case 'pillar': {
            return getPillarColors(app.name).main
        }
        case 'custom': {
            return app.color
        }
        default: {
            return colorMap.neutral.main
        }
    }
}

export const flattenCollectionsToCards = (
    collections: Collection[],
): FlatCard[] =>
    collections
        .map(collection =>
            collection.cards.map(({ articles, appearance }) => ({
                articles: Object.values(articles || {}),
                appearance,
                collection,
            })),
        )
        .reduce((acc, val) => acc.concat(val), [])

export const flattenFlatCardsToFront = (
    flatCards: FlatCard[],
): { article: CAPIArticle; collection: Collection }[] =>
    flatCards
        .map(({ articles, collection }) =>
            articles.map(article => ({ article, collection })),
        )
        .reduce((acc, val) => acc.concat(val), [])
