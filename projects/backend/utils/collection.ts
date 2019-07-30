import { CAPIArticle, Card } from '../common'
import {
    CollectionCardLayouts,
    CollectionCardLayout,
    cardLayouts,
} from '../../common/src/index'
import { fromPairs } from 'ramda'
import { PublishedFront } from '../fronts/issue'

const chunk = <T>(arr: T[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size),
    )

const maxCardSize = 6

const getCardLayoutForArticles = (
    layout: CollectionCardLayouts,
    articleLength: number,
): CollectionCardLayout => {
    return layout[articleLength] || Object.values(layout).pop()
}

export const createCardsFromAllArticlesInCollection = (
    articles: [string, CAPIArticle][],
    front: PublishedFront,
): Card[] => {
    const cardLayout = cardLayouts[front.name]
        ? cardLayouts[front.name]
        : cardLayouts.default

    const layout = getCardLayoutForArticles(cardLayout, articles.length)

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
                    articles: fromPairs(
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
                        articles: fromPairs(groupOfArticles),
                    }
                },
            ),
        ]
    }

    return cards
}
