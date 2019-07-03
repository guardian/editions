import fromEntries from 'object.fromentries'
import { CAPIArticle, Card } from '../common'
import {
    CollectionCardLayouts,
    CollectionCardLayout,
} from '../../common/src/index'

const chunk = <T>(arr: T[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size),
    )

const maxCardSize = 6

const getCardLayoutForArticles = (
    layouts: CollectionCardLayouts,
    articleLength: number,
): CollectionCardLayout =>
    layouts[articleLength] || Object.values(layouts).pop()

export const createCardsFromAllArticlesInCollection = (
    layouts: CollectionCardLayouts,
    articles: [string, CAPIArticle][],
): Card[] => {
    const layout = getCardLayoutForArticles(layouts, articles.length)

    /*
    fill the layout with articles
    */
    let { cards, itemsSoFar } = layout.reduce<{
        itemsSoFar: number
        cards: Card[]
    }>(
        ({ itemsSoFar, cards }, current) => ({
            itemsSoFar: itemsSoFar + current,
            cards: [
                ...cards,
                {
                    layout: null,
                    articles: fromEntries(
                        articles.slice(itemsSoFar, itemsSoFar + current),
                    ),
                },
            ],
        }),
        { itemsSoFar: 0, cards: [] },
    )

    /*
    if there's even more articles
    let's just chunk the rest out.
    */
    if (articles.length > itemsSoFar) {
        cards = [
            ...cards,
            ...chunk(articles.slice(itemsSoFar), maxCardSize).map(
                groupOfArticles => {
                    return {
                        layout: null,
                        articles: fromEntries(groupOfArticles),
                    }
                },
            ),
        ]
    }

    return cards
}
