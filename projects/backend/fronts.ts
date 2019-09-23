import { s3fetch, Path } from './s3'
import {
    Front,
    Image,
    Collection,
    CAPIArticle,
    PillarAppearance,
    CreditedImage,
} from './common'
import { LastModifiedUpdater } from './lastModified'
import {
    attempt,
    hasFailed,
    Attempt,
    withFailureMessage,
    hasSucceeded,
    failure,
} from './utils/try'
import { getArticles, CAPIContent } from './capi/articles'
import { createCardsFromAllArticlesInCollection } from './utils/collection'
import { getImageFromURL } from './image'
import {
    PublishedIssue,
    PublishedCollection,
    PublishedFurtniture,
    PublishedFront,
    PublishedCardImage,
    PublishedImage,
} from './fronts/issue'
import { getCrosswordArticleOverrides } from './utils/crossword'
import { isPreview } from './preview'
import striptags from 'striptags'
import { oc } from 'ts-optchain'

// overrideArticleMainMedia may be false in most cases
const getImage = (
    overrideArticleMainMedia: boolean,
    maybeImageSrcOverride: PublishedImage | undefined,
    maybeArticleImage: CreditedImage | undefined,
): Image | undefined => {
    return overrideArticleMainMedia && maybeImageSrcOverride !== undefined
        ? getImageFromURL(oc(maybeImageSrcOverride).src())
        : maybeArticleImage
}

const getCardImage = (
    maybeCoverCardImages: PublishedCardImage | undefined,
    maybeImageSrcOverride: PublishedImage | undefined,
): Image | undefined => {
    const imgFromCardImages = getImageFromURL(
        oc(maybeCoverCardImages).mobile.src(),
    )
    const imgFromOverride = getImageFromURL(oc(maybeImageSrcOverride).src())
    return imgFromCardImages || imgFromOverride
}

const getCardImageForTablet = (
    maybeCoverCardImages: PublishedCardImage | undefined,
): Image | undefined => {
    return getImageFromURL(oc(maybeCoverCardImages).tablet.src())
}

export const getImages = (
    article: CAPIContent,
    furniture: PublishedFurtniture,
): { image?: CreditedImage; cardImage?: Image; cardImageTablet?: Image } => {
    const {
        overrideArticleMainMedia,
        imageSrcOverride: maybeImageSrcOverride,
        coverCardImages: maybeCoverCardImages,
    } = furniture

    const maybeArticleImage = oc(article).image()

    const image = getImage(
        overrideArticleMainMedia,
        maybeImageSrcOverride,
        maybeArticleImage,
    )
    const cardImage = getCardImage(maybeCoverCardImages, maybeImageSrcOverride)
    const cardImageTablet = getCardImageForTablet(maybeCoverCardImages)

    return { image, cardImage, cardImageTablet }
}

const commonFields = (article: CAPIContent, furniture: PublishedFurtniture) => {
    const kicker = oc(furniture).kicker() || article.kicker || '' // I'm not sure where else we should check for a kicker
    const headline = oc(furniture).headlineOverride() || article.headline
    const trail = striptags(
        oc(furniture).trailTextOverride() || article.trail || '',
    )
    const byline = oc(furniture).bylineOverride() || article.byline
    const showByline = furniture.showByline
    const showQuotedHeadline = furniture.showQuotedHeadline
    const mediaType = furniture.mediaType
    const images = getImages(article, furniture)
    return {
        key: article.path,
        kicker,
        headline,
        trail,
        standfirst: trail,
        byline,
        showByline,
        showQuotedHeadline,
        mediaType,
        ...images,
    }
}

export const patchArticle = (
    article: CAPIContent,
    furniture: PublishedFurtniture,
): [string, CAPIArticle] => {
    const sportScore = oc(furniture).sportScore()

    switch (article.type) {
        case 'crossword':
            return [
                article.path,
                {
                    ...article,
                    ...commonFields(article, furniture),
                    ...getCrosswordArticleOverrides(article),
                    sportScore,
                },
            ]

        case 'gallery':
            return [
                article.path,
                {
                    ...article,
                    ...commonFields(article, furniture),
                    key: article.path,
                    sportScore,
                },
            ]

        case 'picture':
            return [
                article.path,
                {
                    ...article,
                    ...commonFields(article, furniture),
                    key: article.path,
                    sportScore,
                },
            ]

        case 'article':
            const fields = commonFields(article, furniture)
            return [
                article.path,
                {
                    ...article,
                    ...fields,
                    byline: fields.byline || '',
                    sportScore,
                },
            ]

        default:
            const msg: never = article
            throw new TypeError(`Unknown type: ${msg}`)
    }
}

export const parseCollection = async (
    collectionResponse: PublishedCollection,
    i: number,
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
        .map(([key, furniture]) =>
            patchArticle(
                capiSearchArticles[key] || capiPrintArticles[key],
                furniture,
            ),
        )

    return {
        key: `${i}:${collectionResponse.name}`,
        cards: createCardsFromAllArticlesInCollection(articles, front),
    }
}

const getDisplayName = (front: string) => {
    const split = front.split('/').pop() || front
    return split.charAt(0).toUpperCase() + split.slice(1)
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
        name: front.swatch,
    }

    const collections = await Promise.all(
        front.collections
            .filter(collection => collection.items.length > 0)
            .map((collection, i) => parseCollection(collection, i, front)),
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
