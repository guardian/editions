import {
    Collection,
    CAPIArticle,
    Appearance,
    FrontCardAppearance,
} from 'src/common'
import { palette } from '@guardian/pasteup/palette'

export interface FlatCard {
    collection: Collection
    appearance: FrontCardAppearance | null
    articles: CAPIArticle[]
}

const colorMap = {
    news: palette.news.main,
    opinion: palette.opinion.main,
    sport: palette.sport.main,
    culture: palette.culture.main,
    lifestyle: palette.lifestyle.main,
    neutral: palette.neutral[7],
}

export const getColor = (app: Appearance): string => {
    switch (app.type) {
        case 'pillar': {
            return colorMap[app.name]
        }
        case 'custom': {
            return app.color
        }
        default: {
            return colorMap.neutral
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
): { article: CAPIArticle; collection: Collection; cardIndex: number }[] =>
    flatCards
        .map(({ articles, collection }, cardIndex) =>
            articles.map(article => ({ article, collection, cardIndex })),
        )
        .reduce((acc, val) => acc.concat(val), [])
