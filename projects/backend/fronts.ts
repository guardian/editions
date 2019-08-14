import { s3fetch, Path } from './s3'
import { Front, Collection, CAPIArticle, PillarAppearance } from './common'
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
import { notNull } from '../common/src'
import { isPreview } from './preview'

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
                (furniture && furniture.bylineOverride) || article.byline
            const showByline = furniture.showByline //TODO
            const showQuotedHeadline = furniture.showQuotedHeadline // TODO
            const mediaType = furniture.mediaType // TODO// TODO
            const slideshowImages =
                furniture.slideshowImages &&
                furniture.slideshowImages
                    .map(_ => _.src)
                    .map(getImageFromURL)
                    .filter(notNull)

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
                            showByline,
                            showQuotedHeadline,
                            mediaType,
                            slideshowImages,
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
                            showByline,
                            showQuotedHeadline,
                            mediaType,
                            slideshowImages,
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
                            byline: byline || '',
                            showByline,
                            showQuotedHeadline,
                            mediaType,
                            slideshowImages,
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

const getFrontColor = (front: string) => {
    //TODO: delete when https://github.com/guardian/facia-tool/pull/918 on all fronts
    switch ((front.split('/').pop() || front).toLowerCase()) {
        case 'special1':
        case 'special2':
        case 'topstories':
        case 'crossword':
        case 'special 1':
        case 'special 2':
        case 'top stories':
        case 'crosswords':
            return 'neutral'
        case 'uknewsguardian':
        case 'uknewsobserver':
        case 'worldnewsguardian':
        case 'worldnewsobserver':
        case 'uk news':
        case 'world news':
            return 'news'
        case 'journal':
        case 'comment':
        case 'opinion':
            return 'opinion'
        case 'arts':
        case 'filmandmusic':
        case 'guide':
        case 'newreview':
        case 'books':
        case 'culture':
        case 'books':
            return 'culture'
        case 'sport':
            return 'sport'
        case 'features':
        case 'weekend':
        case 'magazine':
        case 'food':
        case 'observerfood':
        case 'lifestyle':
        case 'food':
        case 'the fashion':
            return 'lifestyle'
    }
    return 'neutral'
}

export const getFront = async (
    issue: string,
    id: string,
    source: string,
    lastModifiedUpdater: LastModifiedUpdater,
): Promise<Attempt<Front>> => {
    const path: Path = {
        key: `daily-edition/${issue}/${source}.json`,
        bucket: isPreview ? 'preview' : 'published',
    }
    const resp = await s3fetch(path)

    if (hasFailed(resp)) {
        return withFailureMessage(
            resp,
            `Attempt to fetch ${issue} and ${id} failed.`,
        )
    }

    lastModifiedUpdater(resp.lastModified)

    const issueResponse: PublishedIssue = (await resp.json()) as PublishedIssue
    const front = issueResponse.fronts.find(_ => _.name === id)
    if (!front) {
        return failure({ httpStatus: 404, error: new Error('Front not found') })
    }

    const appearance: PillarAppearance = {
        type: 'pillar',
        name: front.swatch || getFrontColor(id),
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
