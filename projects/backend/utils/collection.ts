import {
    CAPIArticle,
    Card,
    FrontCardsForArticleCount,
    getCardAppearanceInfo,
    getCardsForFront,
} from '../common'
import { fromPairs } from 'ramda'
import { PublishedFront } from '../fronts/issue'

const chunk = <T>(arr: T[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size),
    )

const maxCardSize = 6

const getCardLayoutForArticles = (
    layout: FrontCardsForArticleCount,
    articleLength: number,
): FrontCardsForArticleCount[0] =>
    layout[articleLength] || Object.values(layout).pop()

export const createCardsFromAllArticlesInCollection = (
    articles: [string, CAPIArticle][],
    front: PublishedFront,
): Card[] => {
    const cardLayout = getCardsForFront(front.name)
    const layout = getCardLayoutForArticles(cardLayout, articles.length)

    /*
    fill the layout with articles
    */
    let { cards, itemsSoFar } = layout.reduce<{
        itemsSoFar: number
        cards: Card[]
    }>(
        ({ itemsSoFar, cards }, current) => {
            const { appearance, fits } = getCardAppearanceInfo(current)
            return {
                itemsSoFar: itemsSoFar + fits,
                cards: [
                    ...cards,
                    {
                        appearance,
                        articles: fromPairs(
                            articles.slice(itemsSoFar, itemsSoFar + fits),
                        ),
                    },
                ],
            }
        },
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
                        appearance: null,
                        articles: fromPairs(groupOfArticles),
                    }
                },
            ),
        ]
    }

    return cards
}
