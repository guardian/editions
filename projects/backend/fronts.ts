import { s3fetch } from './s3'
import fromEntries from 'object.fromentries'
import { Diff } from 'utility-types'
import {
    Front,
    Collection,
    CAPIArticle,
    Card,
    Crossword,
    WithColor,
} from './common'
import { LastModifiedUpdater } from './lastModified'
import {
    attempt,
    hasFailed,
    Attempt,
    withFailureMessage,
    hasSucceeded,
} from './utils/try'
import { getArticles } from './capi/articles'
import { createCardsFromAllArticlesInCollection } from './utils/collection'

export const getCollection = async (
    id: string,
    live: boolean = true,
    lastModifiedUpdater: LastModifiedUpdater,
): Promise<Attempt<Collection>> => {
    const resp = await attempt(
        s3fetch(`frontsapi/collection/${id}/collection.json`),
    )
    if (hasFailed(resp))
        return withFailureMessage(resp, 'Could not fetch from S3')

    lastModifiedUpdater(resp.lastModified)

    const deserialized = await attempt(resp.json())
    if (hasFailed(deserialized))
        return withFailureMessage(deserialized, 'Response was not valid json')

    const collection = deserialized as CollectionFromResponse

    const articleFragmentList = collection.live.map((fragment): [
        number,
        NestedArticleFragment,
    ] => [parseInt(fragment.id.replace('internal-code/page/', '')), fragment])
    const articleFragments = fromEntries(articleFragmentList)
    const ids: number[] = articleFragmentList.map(([id]) => id)
    const preview = live ? undefined : true
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

    const articles: [string, CAPIArticle][] = Object.entries(articleFragments)
        .filter(([key]) => {
            const inResponse =
                key in capiPrintArticles || key in capiSearchArticles
            if (!inResponse) {
                console.warn(`Removing ${key} as not in CAPI response.`)
            }
            return inResponse
        })
        .map(([key, fragment]) => {
            const article = capiSearchArticles[key] || capiPrintArticles[key]
            const meta = fragment && (fragment.meta as ArticleFragmentRootMeta)
            const kicker = (meta && meta.customKicker) || article.kicker || '' // I'm not sure where else we should check for a kicker
            const headline = (meta && meta.headline) || article.headline

            switch (article.type) {
                case 'crossword':
                    return [
                        article.path,
                        {
                            ...article,
                            key: article.path,
                            headline,
                            kicker,
                            crossword: (article.crossword as unknown) as Crossword,
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
                            imageURL:
                                (meta && meta.imageSrc) || article.imageURL,
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
                            imageURL:
                                (meta && meta.imageSrc) || article.imageURL,
                        },
                    ]

                default:
                    const msg: never = article
                    throw new TypeError(`Unknown type: ${msg}`)
            }
        })

    return {
        key: id,
        displayName: collection.displayName,
        cards: createCardsFromAllArticlesInCollection(articles),
        preview,
    }
}

const getDisplayName = (front: string) => {
    const split = front.split('/').pop() || front
    return split.charAt(0).toUpperCase() + split.slice(1)
}

const getFrontColor = (front: string): WithColor => {
    switch (front.split('/').pop() || front) {
        case 'topstories':
            return { color: 'neutral' }
        case 'news':
        case 'new':
            return { color: 'news' }
        case 'opinion':
        case 'journal':
            return { color: 'opinion' }
        case 'sport':
            return { color: 'sport' }
        case 'life':
        case 'review':
        case 'guide':
        case 'weekend':
        case 'food':
            return { color: 'lifestyle' }
    }
    return { color: 'neutral' }
}

export const getFront = async (
    id: string,
    lastModifiedUpdater: LastModifiedUpdater,
): Promise<Front> => {
    const resp = await s3fetch('frontsapi/config/config.json')
    if (!resp.ok) throw new Error('failed s3')
    lastModifiedUpdater(resp.lastModified)
    //But ALEX, won't this always be now, as the fronts config will change regularly?
    //Yes. We don't intend to read it from here forever. Comment out as needed.
    const tone = getFrontColor(id)
    const config: FrontsConfigResponse = (await resp.json()) as FrontsConfigResponse
    if (!(id in config.fronts)) throw new Error('Front not found')
    const front = {
        ...config.fronts[id],
        ...tone,
        displayName: getDisplayName(id),
        collections: (await Promise.all(
            config.fronts[id].collections.map(id =>
                getCollection(id, true, lastModifiedUpdater),
            ),
        )).filter(hasSucceeded),
        key: id,
    }

    return front
}

//from https://github.com/guardian/facia-tool/blob/681fe8e6c37e815b15bf470fcd4c5ef4a940c18c/client-v2/src/shared/types/Collection.ts#L95-L107

interface CollectionFromResponse {
    live: NestedArticleFragment[]
    previously?: NestedArticleFragment[]
    draft?: NestedArticleFragment[]
    lastUpdated?: number
    updatedBy?: string
    updatedEmail?: string
    platform?: string
    displayName: string
    groups?: string[]
    metadata?: { type: string }[]
    uneditable?: boolean
}
interface ArticleFragmentRootMeta {
    group?: string
    headline?: string
    trailText?: string
    byline?: string
    customKicker?: string
    href?: string
    imageSrc?: string
    imageSrcThumb?: string
    imageSrcWidth?: string
    imageSrcHeight?: string
    imageSrcOrigin?: string
    imageCutoutSrc?: string
    imageCutoutSrcWidth?: string
    imageCutoutSrcHeight?: string
    imageCutoutSrcOrigin?: string
    isBreaking?: boolean
    isBoosted?: boolean
    showLivePlayable?: boolean
    showMainVideo?: boolean
    showBoostedHeadline?: boolean
    showQuotedHeadline?: boolean
    showByline?: boolean
    imageCutoutReplace?: boolean
    imageReplace?: boolean
    imageHide?: boolean
    showKickerTag?: boolean
    showKickerSection?: boolean
    showKickerCustom?: boolean
    snapUri?: string
    snapType?: string
    snapCss?: string
    imageSlideshowReplace?: boolean
    slideshow?: {
        src?: string
        thumb?: string
        width?: string
        height?: string
        origin?: string
    }[]
}

interface NestedArticleFragmentRootFields {
    id: string
    frontPublicationDate: number
    publishedBy?: string
}

type NestedArticleFragment = NestedArticleFragmentRootFields & {
    meta: {
        supporting?: Diff<NestedArticleFragment, { supporting: unknown }>[]
        group?: string | null
    }
}

//the following types are stubs of https://github.com/guardian/facia-tool/blob/6970833aa5302522e25045c49302edb07a2b0a54/client-v2/src/types/FaciaApi.ts#L49-L56

interface FrontsConfigResponse {
    fronts: {
        [id: string]: FrontConfigResponse
    }
    collections: {
        [id: string]: CollectionConfigResponse
    }
}

interface FrontConfigResponse {
    collections: string[]
    priority?: unknown
    canonical?: string
    group?: string
    isHidden?: boolean
    isImageDisplayed?: boolean
    imageHeight?: number
    imageWidth?: number
    imageUrl?: string
    onPageDescription?: string
    description?: string
    title?: string
    webTitle?: string
    navSection?: string
}

interface CollectionConfigResponse {
    displayName: string
    type: string
    backfill?: unknown
    href?: string
    groups?: string[]
    metadata?: unknown[]
    uneditable?: boolean
    showTags?: boolean
    hideKickers?: boolean
    excludedFromRss?: boolean
    description?: string
    showSections?: boolean
    showDateHeader?: boolean
    showLatestUpdate?: boolean
    excludeFromRss?: boolean
    hideShowMore?: boolean
    platform?: unknown
    frontsToolSettings?: unknown
}
