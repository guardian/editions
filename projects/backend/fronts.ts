import { s3fetch, s3Latest } from './s3'
import { Front, Collection, CAPIArticle, Appearance } from './common'
import { LastModifiedUpdater } from './lastModified'
import {
    attempt,
    hasFailed,
    Attempt,
    withFailureMessage,
    hasSucceeded,
    failure,
} from './utils/try'
import { getArticles } from './capi/articles'
import { createCardsFromAllArticlesInCollection } from './utils/collection'
import { getImageFromURL } from './image'
import {
    PublishedIssue,
    PublishedCollection,
    PublishedFurtniture,
    PublishedFront,
} from './fronts/issue'
import { getCrosswordArticleOverrides } from './utils/crossword'

export const parseCollection = async (
    collectionResponse: PublishedCollection,
    front: PublishedFront,
): Promise<Attempt<Collection>> => {
    const articleFragmentList = collectionResponse.items.map((itemResponse): [
        number,
        PublishedFurtniture,
    ] => [itemResponse.internalPageCode, itemResponse.furniture])

    const ids: number[] = articleFragmentList.map(([id]) => id)
    const [capiPrintArticles, capiSearchArticles] = await Promise.all([
        attempt(getArticles(ids, 'printsent')),
        attempt(getArticles(ids, 'search')),
    ])
    if (hasFailed(capiPrintArticles))
        return withFailureMessage(
            capiPrintArticles,
            'Could not connect to capi print sent',
        )
    if (hasFailed(capiSearchArticles))
        return withFailureMessage(
            capiSearchArticles,
            'Could not connect to CAPI',
        )

    const articles: [string, CAPIArticle][] = articleFragmentList
        .filter(([key]) => {
            const inResponse =
                key in capiPrintArticles || key in capiSearchArticles
            if (!inResponse) {
                console.warn(`Removing ${key} as not in CAPI response.`)
            }
            return inResponse
        })
        .map(([key, furniture]): [string, CAPIArticle] => {
            const article = capiSearchArticles[key] || capiPrintArticles[key]
            const kicker =
                (furniture && furniture.kicker) || article.kicker || '' // I'm not sure where else we should check for a kicker
            const headline =
                (furniture && furniture.headlineOverride) || article.headline
            const trail =
                (furniture && furniture.trailTextOverride) ||
                article.trail ||
                ''
            const byline =
                (furniture && furniture.bylineOverride) || article.byline || ''
            const showByline = furniture.showByline //TODO
            const showQuotedHeadline = furniture.showQuotedHeadline // TODO
            const mediaType = furniture.mediaType // TODO// TODO
            const slideshowImages = furniture.slideshowImages // TODO

            const imageOverride =
                furniture &&
                furniture.imageSrcOverride &&
                getImageFromURL(furniture.imageSrcOverride.src)

            switch (article.type) {
                case 'crossword':
                    return [
                        article.path,
                        {
                            ...article,
                            ...getCrosswordArticleOverrides(article),
                            key: article.path,
                            trail,
                            byline,
                        },
                    ]

                case 'gallery':
                    return [
                        article.path,
                        {
                            ...article,
                            key: article.path,
                            headline,
                            kicker,
                            trail,
                            byline,
                        },
                    ]

                case 'article':
                    return [
                        article.path,
                        {
                            ...article,
                            key: article.path,
                            headline,
                            kicker,
                            trail,
                            image: imageOverride || article.image,
                            byline,
                        },
                    ]

                default:
                    const msg: never = article
                    throw new TypeError(`Unknown type: ${msg}`)
            }
        })

    return {
        key: collectionResponse.id,
        cards: createCardsFromAllArticlesInCollection(articles, front),
    }
}

const getDisplayName = (front: string) => {
    const split = front.split('/').pop() || front
    return split.charAt(0).toUpperCase() + split.slice(1)
}

const getFrontColor = (front: string): Appearance => {
    switch ((front.split('/').pop() || front).toLowerCase()) {
        case 'special1':
        case 'special2':
        case 'topstories':
        case 'crossword':
        case 'special 1':
        case 'special 2':
        case 'top stories':
        case 'crosswords':
            return { type: 'pillar', name: 'neutral' }
        case 'uknewsguardian':
        case 'uknewsobserver':
        case 'worldnewsguardian':
        case 'worldnewsobserver':
        case 'uk news':
        case 'world news':
            return { type: 'pillar', name: 'news' }
        case 'journal':
        case 'comment':
        case 'opinion':
            return { type: 'pillar', name: 'opinion' }
        case 'arts':
        case 'filmandmusic':
        case 'guide':
        case 'newreview':
        case 'books':
        case 'culture':
        case 'books':
            return { type: 'pillar', name: 'culture' }
        case 'sport':
            return { type: 'pillar', name: 'sport' }
        case 'features':
        case 'weekend':
        case 'magazine':
        case 'food':
        case 'observerfood':
        case 'lifestyle':
        case 'food':
        case 'the fashion':
            return { type: 'pillar', name: 'lifestyle' }
    }
    return { type: 'pillar', name: 'neutral' }
}

export const getFront = async (
    issue: string,
    id: string,
    lastModifiedUpdater: LastModifiedUpdater,
): Promise<Attempt<Front>> => {
    const latest = await s3Latest(`daily-edition/${issue}/`)
    if (hasFailed(latest)) {
        return withFailureMessage(
            latest,
            `Could not get latest issue for ${issue} and ${id}.`,
        )
    }
    const issuePath = latest.key
    const resp = await s3fetch(issuePath)

    if (hasFailed(resp)) {
        return withFailureMessage(
            resp,
            `Attempt to fetch ${issue} and ${id} failed.`,
        )
    }

    lastModifiedUpdater(resp.lastModified)

    const appearance = getFrontColor(id)
    const issueResponse: PublishedIssue = (await resp.json()) as PublishedIssue
    const front = issueResponse.fronts.find(_ => _.name === id)
    if (!front) {
        return failure({ httpStatus: 404, error: new Error('Front not found') })
    }

    const collections = await Promise.all(
        front.collections
            .filter(collection => collection.items.length > 0)
            .map(collection => parseCollection(collection, front)),
    )

    collections.filter(hasFailed).forEach(failedCollection => {
        console.error(
            `silently removing collection from ${issue}/${id} ${JSON.stringify(
                failedCollection,
            )}`,
        )
    })

    return {
        ...front,
        appearance,
        displayName: getDisplayName(id),
        collections: collections.filter(hasSucceeded),
        key: id,
    }
}
