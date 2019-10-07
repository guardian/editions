import {
    Card,
    FrontCardsForArticleCount,
    getCardAppearanceInfoAndOverrides,
    getCardsForFront,
    layouts,
    PageLayout,
    PageLayoutSizes,
    getImageUse,
} from '../common'
import { fromPairs, zip } from 'ramda'
import { PublishedFront, PublishedFurniture } from '../fronts/issue'
import { CAPIContent } from '../capi/articles'
import { patchArticle } from '../fronts'

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

export const createCards = (
    articles: [CAPIContent, PublishedFurniture][],
    front: PublishedFront,
): Card[] => {
    const cardLayout = getCardsForFront(front.name)
    const layout = getCardLayoutForArticles(cardLayout, articles.length)

    /*
    fill the layout with articles
    */
    const { cards, itemsSoFar } = layout.reduce<{
        itemsSoFar: number
        cards: Card[]
    }>(
        ({ itemsSoFar, cards }, current) => {
            const { appearance, fits } = getCardAppearanceInfoAndOverrides(
                current,
            )
            const articlesSlice = articles.slice(itemsSoFar, itemsSoFar + fits)

            const layout: PageLayout = layouts[appearance]
            const mobileItemTypes = layout[PageLayoutSizes.mobile].items
            const tabletItemTypes = layout[PageLayoutSizes.tablet].items

            if (mobileItemTypes.length !== tabletItemTypes.length) {
                console.warn(
                    `Mis-match between mobile and tablet card layout definitions. Mobile length: ${mobileItemTypes.length}, Tablet length: ${tabletItemTypes.length}`,
                )
            }

            const itemTypes = zip(mobileItemTypes, tabletItemTypes)

            if (articlesSlice.length !== itemTypes.length) {
                console.warn(
                    `Possible mis-match between card appearance and card layout definitions. Article length: ${articlesSlice.length}, Item type length: ${itemTypes.length}`,
                )
            }

            const articleItemTypes = zip(articlesSlice, itemTypes)

            const patchedArticles = articleItemTypes.map(
                ([[content, furniture], [mobileItemType, tabletItemType]]) => {
                    const mobileImageUse = getImageUse(
                        mobileItemType.item,
                        mobileItemType.fits,
                        PageLayoutSizes.mobile,
                    )
                    const tabletImageUse = getImageUse(
                        tabletItemType.item,
                        tabletItemType.fits,
                        PageLayoutSizes.tablet,
                    )
                    return patchArticle(
                        content,
                        furniture,
                        mobileImageUse,
                        tabletImageUse,
                    )
                },
            )

            return {
                itemsSoFar: itemsSoFar + fits,
                cards: [
                    ...cards,
                    {
                        appearance,
                        articles: fromPairs(patchedArticles),
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
        return [
            ...cards,
            ...chunk(articles.slice(itemsSoFar), maxCardSize).map(
                groupOfArticles => {
                    const patchedArticles = groupOfArticles.map(
                        ([content, furniture]) => {
                            return patchArticle(
                                content,
                                furniture,
                                'not-used',
                                'not-used',
                            )
                        },
                    )
                    return {
                        appearance: null,
                        articles: fromPairs(patchedArticles),
                    }
                },
            ),
        ]
    }

    return cards
}
