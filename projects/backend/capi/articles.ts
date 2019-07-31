import { attempt, hasFailed, hasSucceeded } from '../utils/try'
import {
    SearchResponseCodec,
    ContentType,
    ICapiDateTime as CapiDateTime64,
    ICrossword,
} from '@guardian/capi-ts'
import {
    Article,
    GalleryArticle,
    CrosswordArticle,
    CapiDateTime as CapiDateTime32,
} from '../common'
import {
    BufferedTransport,
    CompactProtocol,
} from '@creditkarma/thrift-server-core'
import { getImage } from './assets'
import { elementParser } from './elements'
import { IContent } from '@guardian/capi-ts/dist/Content'
import fetch from 'node-fetch'
import { cleanupHtml } from '../utils/html'
import { fromPairs } from 'ramda'
import { kickerPicker } from './kickerPicker'
import { getBylineImages } from './byline'

type NotInCAPI = 'key'

type OptionalInCAPI = 'kicker' | 'bylineImages' | 'trail'

interface CAPIExtras {
    path: string
}

type CArticle = Omit<Article, NotInCAPI | OptionalInCAPI> &
    Partial<Pick<Article, OptionalInCAPI>> &
    CAPIExtras
type CGallery = Omit<GalleryArticle, NotInCAPI | OptionalInCAPI> &
    Partial<Pick<Article, OptionalInCAPI>> &
    CAPIExtras
export type CCrossword = Omit<CrosswordArticle, NotInCAPI | OptionalInCAPI> &
    Partial<Pick<Article, OptionalInCAPI>> &
    CAPIExtras

type CAPIContent = CArticle | CGallery | CCrossword

const truncateDateTime = (date: CapiDateTime64): CapiDateTime32 => ({
    iso8601: date.iso8601,
    dateTime: date.dateTime.toNumber(),
})

const parseArticleResult = async (
    result: IContent,
): Promise<[number, CAPIContent]> => {
    const path = result.id
    console.log(`Parsing CAPI response for ${path}`)
    const internalid = result.fields && result.fields.internalPageCode
    if (internalid == null)
        throw new Error(`internalid was undefined in ${path}!`)

    const title = (result.fields && result.fields.headline) || result.webTitle

    const standfirst =
        result.fields &&
        result.fields.standfirst &&
        cleanupHtml(result.fields.standfirst)

    const parser = elementParser(path)
    const kicker = kickerPicker(result, title)

    const trail = result.fields && result.fields.trailText

    const byline = result.fields && result.fields.byline
    const bylineImages = getBylineImages(result)

    const maybeMainImage =
        result.blocks &&
        result.blocks.main &&
        result.blocks.main.elements &&
        result.blocks.main.elements[0].assets &&
        getImage(result.blocks.main.elements[0].assets)

    const maybeThumbnailElement =
        result.elements &&
        result.elements.find(element => element.relation === 'thumbnail')
    const maybeThumbnailImage =
        maybeThumbnailElement && getImage(maybeThumbnailElement.assets)
    const maybeImage = maybeMainImage || maybeThumbnailImage
    if (maybeMainImage == null) {
        console.warn(
            `No main image in ${
                result.id
            } using thumbnail (${maybeThumbnailImage &&
                maybeThumbnailImage.path}).`,
        )
    }
    const blocks =
        result.blocks &&
        result.blocks.body &&
        result.blocks.body.map(_ => _.elements)
    const body = blocks && blocks.reduce((acc, cur) => [...acc, ...cur], [])
    if (body == null) throw new Error(`Body was undefined in ${path}!`)

    const elements = await attempt(Promise.all(body.map(parser)))
    if (hasFailed(elements))
        throw new Error(`Element parsing failed in ${path}!`) //This should not fire, the parser should log if anything async fails and then return the remainder.

    if (elements == null) throw new Error(`Elements was undefined in ${path}!`)

    switch (result.type) {
        case ContentType.ARTICLE:
            const article: [number, CArticle] = [
                internalid,
                {
                    type: 'article',
                    path: path,
                    headline: title,
                    kicker,
                    trail,
                    image: maybeImage,
                    byline: byline || '',
                    bylineImages,
                    standfirst: standfirst || '',
                    elements,
                },
            ]
            return article

        case ContentType.GALLERY:
            const galleryArticle: [number, CGallery] = [
                internalid,
                {
                    type: 'gallery',
                    path: path,
                    headline: title,
                    trail,
                    kicker,
                    image: maybeImage,
                    byline: byline || '',
                    standfirst: standfirst || '',
                    elements,
                },
            ]

            return galleryArticle

        case ContentType.CROSSWORD:
            if (result.crossword == null)
                throw new Error(
                    `No crossword defined in Crossword article: ${path}`,
                )
            const crossword64 = result.crossword
            const dateSolutionAvailable =
                crossword64.dateSolutionAvailable &&
                truncateDateTime(crossword64.dateSolutionAvailable)
            const date = truncateDateTime(crossword64.date)

            const entries = crossword64.entries.map(entry => {
                const separatorLocations =
                    entry.separatorLocations &&
                    fromPairs([...entry.separatorLocations.entries()])
                return { ...entry, separatorLocations }
            })

            const crossword = {
                ...crossword64,
                date,
                dateSolutionAvailable,
                entries,
            }

            const crosswordArticle: [number, CAPIContent] = [
                internalid,
                {
                    type: 'crossword',
                    trail,
                    path: path,
                    headline: title,
                    byline: byline || '',
                    standfirst: standfirst || '',
                    crossword,
                },
            ]

            return crosswordArticle

        default:
            return [
                internalid,
                {
                    type: 'article',
                    path: path,
                    headline: title,
                    trail,
                    kicker,
                    image: maybeImage,
                    byline: byline || '',
                    standfirst: standfirst || '',
                    elements: [
                        {
                            id: 'html',
                            html: `We can't render content type ${
                                ContentType[result.type]
                            } currently`,
                        },
                        {
                            id: 'html',
                            html: `<pre>${JSON.stringify(result.apiUrl)}</pre>`,
                        },
                    ],
                },
            ]
    }
}

const capiApiKey = process.env.CAPI_KEY

const printsent = (paths: string[]) =>
    `${process.env.psurl}?ids=${paths.join(
        ',',
    )}&format=thrift&api-key=${capiApiKey}&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all&format=thrift&page-size=100`

const search = (paths: string[]) =>
    `https://content.guardianapis.com/search?ids=${paths.join(
        ',',
    )}&format=thrift&api-key=${capiApiKey}&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all&format=thrift&page-size=100`

export const getArticles = async (
    ids: number[],
    capi: 'printsent' | 'search',
): Promise<{ [key: string]: CAPIContent }> => {
    const paths = ids.map(_ => `internal-code/page/${_}`)

    const endpoint = capi === 'printsent' ? printsent(paths) : search(paths)
    if (endpoint.length > 1000) {
        console.warn(
            `Unusually long CAPI request of ${endpoint.length}, splitting`,
            paths,
        )
        const midpoint = ~~(ids.length / 2) //Coerece into int, even though apparently you can slice on a float
        const firstRequest = attempt(getArticles(ids.slice(0, midpoint), capi))
        const last = await attempt(getArticles(ids.slice(midpoint), capi))
        const first = await firstRequest
        if (hasFailed(first)) {
            console.error(first.error)
            throw new Error('Error when spliting CAPI request (first half)')
        }
        if (hasFailed(last)) {
            console.error(last.error)
            throw new Error('Error when spliting CAPI request (second half)')
        }
        const firstArray = Object.entries(first)
        const lastArray = Object.entries(last)
        return fromPairs(firstArray.concat(lastArray))
    }
    console.log('Making CAPI query', endpoint)
    console.log('Debug link:', endpoint.replace('thrift', 'json'))
    const resp = await attempt(fetch(endpoint))
    if (hasFailed(resp)) throw new Error('Could not connect to CAPI.')
    const buffer = await resp.arrayBuffer()

    const receiver: BufferedTransport = BufferedTransport.receiver(
        Buffer.from(buffer),
    )
    const input = new CompactProtocol(receiver)
    const data = SearchResponseCodec.decode(input)
    const results: IContent[] = data.results
    const articlePromises = await Promise.all(
        results.map(result => attempt(parseArticleResult(result))),
    )

    //If we fail to get an article in a collection we just ignore it and move on.
    articlePromises.forEach(attempt => {
        if (hasFailed(attempt)) {
            console.log('failure when parsing', attempt.error)
        }
    })
    const articleEntries = articlePromises.filter(hasSucceeded)
    return fromPairs(articleEntries)
}
