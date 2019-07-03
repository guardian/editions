import fromEntries from 'object.fromentries'
import { CAPIArticle, Card } from '../common'

const cardLayouts: { [count: number]: number[] } = {
    1: [1],
    2: [1, 1],
    3: [1, 2],
    4: [1, 3],
}

const chunk = <T>(arr: T[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size),
    )

export const createCardsFromAllArticlesInCollection = (
    articles: [string, CAPIArticle][],
): Card[] => {
    const maxCardSize = 6

    const layout = [...(cardLayouts[articles.length] || cardLayouts[4])]

    let { cards, itemsSoFar } = layout.reduce<{
        itemsSoFar: number
        cards: Card[]
    }>(
        ({ itemsSoFar, cards }, current) => {
            return {
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
            }
        },
        { itemsSoFar: 0, cards: [] },
    )

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
