import { Collection, Article } from 'src/common'

export interface FlatCard {
    collection: Collection
    articles: Article[]
}

export const flattenCollections = (collections: Collection[]): FlatCard[] =>
    collections
        .map(collection =>
            collection.cards.map(({ articles }) => ({
                articles: Object.values(articles || {}),
                collection,
            })),
        )
        .reduce((acc, val) => acc.concat(val), [])
