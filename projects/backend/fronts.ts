import striptags from 'striptags'
import { oc } from 'ts-optchain'
import { BlockElement } from '../common/src'
import { CAPIContent, CArticle, getArticles } from './capi/articles'
import {
    CAPIArticle,
    Collection,
    CreditedImage,
    Front,
    Image,
    PillarAppearance,
} from './common'
import {
    PublishedCardImage,
    PublishedCollection,
    PublishedFront,
    PublishedFurtniture,
    PublishedIssue,
} from './fronts/issue'
import { getImageFromURL } from './image'
import { LastModifiedUpdater } from './lastModified'
import { isPreview } from './preview'
import { Path, s3fetch } from './s3'
import { createCardsFromAllArticlesInCollection } from './utils/collection'
import { getCrosswordArticleOverrides } from './utils/crossword'
import {
    attempt,
    Attempt,
    failure,
    hasFailed,
    hasSucceeded,
    withFailureMessage,
} from './utils/try'
import { articleShouldHaveDropCap, isHTMLElement } from './utils/article'

// overrideArticleMainMedia may be false in most cases
const getImage = (
    overrideArticleMainMedia: boolean,
    maybeImageOverride: Image | undefined,
    maybeArticleImage: CreditedImage | undefined,
): CreditedImage | undefined => {
    return overrideArticleMainMedia && maybeImageOverride !== undefined
        ? maybeImageOverride
        : maybeArticleImage
}

const getCardImages = (
    maybeCoverCardImages: PublishedCardImage | undefined,
): { cardImage: Image; cardImageTablet: Image } | undefined => {
    const maybeCardImage = getImageFromURL(
        oc(maybeCoverCardImages).mobile.src(),
    )
    const maybeCardImageTablet = getImageFromURL(
        oc(maybeCoverCardImages).tablet.src(),
    )
    if (maybeCardImage && maybeCardImageTablet) {
        return {
            cardImage: maybeCardImage,
            cardImageTablet: maybeCardImageTablet,
        }
    }
}

const getTrailImage = (
    maybeMainImage: CreditedImage | undefined,
    maybeCapiTrailImage: Image | undefined,
    maybeImageOverride: Image | undefined,
): Image | undefined => {
    return maybeImageOverride || maybeMainImage || maybeCapiTrailImage
}

export const getImages = (
    article: CAPIContent,
    furniture: PublishedFurtniture,
): {
    image?: CreditedImage
    cardImage?: Image
    cardImageTablet?: Image
    trailImage?: Image
} => {
    const {
        overrideArticleMainMedia,
        imageSrcOverride: maybeImageSrcOverride,
        coverCardImages: maybeCoverCardImages,
    } = furniture

    const maybeArticleImage = oc(article).image()

    const maybeCapiTrailImage = oc(article).trailImage()

    const maybeImageOverride = getImageFromURL(oc(maybeImageSrcOverride).src())

    const maybeMainImage = getImage(
        overrideArticleMainMedia,
        maybeImageOverride,
        maybeArticleImage,
    )

    const maybeCardImages = getCardImages(maybeCoverCardImages) || {}
    const maybeTrailImage = getTrailImage(
        maybeMainImage,
        maybeCapiTrailImage,
        maybeImageOverride,
    )

    return {
        image: maybeMainImage,
        trailImage: maybeTrailImage,
        ...maybeCardImages,
    }
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

const patchArticleElements = (article: CArticle): BlockElement[] => {
    const [head, ...tail] = article.elements
    return !articleShouldHaveDropCap(article) || !isHTMLElement(head)
        ? article.elements
        : [{ ...head, hasDropCap: true }, ...tail]
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
                    elements: patchArticleElements(article),
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
