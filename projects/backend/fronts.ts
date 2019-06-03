import { s3fetch } from './s3'
import fromEntries from 'object.fromentries'
import { Diff } from 'utility-types'
import { CollectionArticles, Front, Collection } from './common'
import { LastModifiedUpdater } from './lastModified'

export const getCollection = async (
    id: string,
    lastModifiedUpdater: LastModifiedUpdater,
): Promise<CollectionArticles | 'notfound'> => {
    try {
        const resp = await s3fetch(`frontsapi/collection/${id}/collection.json`)
        if (resp.status === 404) return 'notfound'
        if (!resp.ok) throw new Error('failed s3')
        lastModifiedUpdater(resp.lastModified)
        const collection: CollectionFromResponse = (await resp.json()) as CollectionFromResponse
        console.log(collection)
        return {
            id,
            name: collection.displayName,
            articles: collection.live.map(_ => _.id),
        }
    } catch {
        console.log('OH NO', id)
        return 'notfound'
    }
}

export const getCollectionsForFront = async (
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

    // const collections =
    const collections = Object.entries(config.collections)

    const selected = collections.filter(c => collectionIds.includes(c[0]))

    const articles = await Promise.all(
        collectionIds.map(id => getCollection(id, lastModifiedUpdater)),
    )
    console.log(articles, 'SSS')
    const articleMap = new Map(
        articles
            .filter(
                (maybeArticle): maybeArticle is CollectionArticles =>
                    maybeArticle !== 'notfound',
            )
            .map(({ id, articles }) => [id, articles]),
    )
    console.log(articleMap, '>?>')
    const combined: [string, Collection][] = selected.map(([id, data]) => [
        id,
        { ...data, articles: articleMap.get(id) },
    ])

    const cs: { [key: string]: Collection } = fromEntries(combined) //This is a polyfill of Object.Entries which is a bit tooo new.
    console.log(front)
    return { ...front, collections: cs }
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
