import { Collection, CAPIArticle, WithColor } from 'src/common'
import { palette } from '@guardian/pasteup/palette'

export interface FlatCard {
    collection: Collection
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

export const getColor = (color: WithColor): string => {
    if (!color.color) return colorMap['neutral']
    if (color.color === 'custom') return color.customColor
    return colorMap[color.color]
}

export const flattenCollectionsToCards = (
    collections: Collection[],
): FlatCard[] =>
    collections
        .map(collection =>
            collection.cards.map(({ articles }) => ({
                articles: Object.values(articles || {}),
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
