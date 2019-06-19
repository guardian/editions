import { s3fetch } from './s3'
import fromEntries from 'object.fromentries'
import { Diff } from 'utility-types'
import { Front, Collection, Article } from './common'
import { LastModifiedUpdater } from './lastModified'
import { attempt, hasFailed } from './utils/try'
import { getArticles } from './capi/articles'

export const getCollection = async (
    id: string,
    live: boolean = true,
    lastModifiedUpdater: LastModifiedUpdater,
): Promise<Collection> => {
    const resp = await attempt(
        s3fetch(`frontsapi/collection/${id}/collection.json`),
    )
    if (hasFailed(resp)) throw new Error('Could not fetch from S3.')

    lastModifiedUpdater(resp.lastModified)

    const deserialized = await attempt(resp.json())
    if (hasFailed(resp)) throw new Error('Response was not valid json')

    const collection: CollectionFromResponse = deserialized as CollectionFromResponse

    const articleFragmentList = live ? collection.live : collection.draft
    if (articleFragmentList == null) throw new Error('Hello that didnt work')
    const articleFragments = fromEntries(
        articleFragmentList.map(
            (fragment): [string, NestedArticleFragment] => [
                fragment.id,
                fragment,
            ],
        ),
    )

    const preview = live ? undefined : true
    const capiArticles = await getArticles(Object.keys(articleFragments))
    const articles: [string, Article][] = Object.entries(capiArticles).map(
        ([key, article]) => {
            const fragment =
                articleFragments[`internal-code/page/${article.id}`] ||
                articleFragments[key]
            const meta = fragment && (fragment.meta as ArticleFragmentRootMeta)
            const kicker = (meta && meta.customKicker) || '' // I'm not sure where else we should check for a kicker
            const headline = (meta && meta.headline) || article.headline
            const imageURL = (meta && meta.imageSrc) || article.imageURL

            return [key, { ...article, key, kicker, headline, imageURL }]
        },
    )

    return {
        displayName: collection.displayName,
        articles: fromEntries(articles),
        preview,
    }
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

    const config: FrontsConfigResponse = (await resp.json()) as FrontsConfigResponse
    if (!(id in config.fronts)) throw new Error('Front not found')
    const front = config.fronts[id]
    const collectionIds = front.collections

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
    slideshow?: Array<{
        src?: string
        thumb?: string
        width?: string
        height?: string
        origin?: string
    }>
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
