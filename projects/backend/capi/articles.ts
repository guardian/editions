import { attempt, hasFailed, hasSucceeded } from '../utils/try'
import {
    SearchResponseCodec,
    ContentType,
    ICapiDateTime as CapiDateTime64,
    IContent,
    IBlocks,
    ElementType,
} from '@guardian/capi-ts'
import {
    Article,
    GalleryArticle,
    CrosswordArticle,
    PictureArticle,
    CapiDateTime as CapiDateTime32,
    MediaAtomElement,
    TrailImage,
} from '../common'
import {
    BufferedTransport,
    CompactProtocol,
} from '@creditkarma/thrift-server-core'
import { elementParser } from './elements'
import fetch from 'node-fetch'
import { fromPairs } from 'ramda'
import { kickerPicker } from './kickerPicker'
import { getBylineImages } from './byline'
import { rationaliseAtoms } from './atoms'
import { articleTypePicker, headerTypePicker } from './articleTypePicker'
import { getImages } from './articleImgPicker'
import { RequestSigner } from 'aws4'
import { SharedIniFileCredentials, STS } from 'aws-sdk'

type NotInCAPI =
    | 'key'
    | 'showByline'
    | 'showQuotedHeadline'
    | 'mediaType'
    | 'slideshowImages'
    | 'sportScore'

type OptionalInCAPI = 'kicker' | 'bylineImages' | 'trail' | 'articleType'

interface CAPIExtras {
    path: string
    trailImage: TrailImage | undefined
}

export type CArticle = Omit<Article, NotInCAPI | OptionalInCAPI> &
    Partial<Pick<Article, OptionalInCAPI>> &
    CAPIExtras
export type CGallery = Omit<GalleryArticle, NotInCAPI | OptionalInCAPI> &
    Partial<Pick<Article, OptionalInCAPI>> &
    CAPIExtras
export type CPicture = Omit<PictureArticle, NotInCAPI | OptionalInCAPI> &
    Partial<Pick<Article, OptionalInCAPI>> &
    CAPIExtras
export type CCrossword = Omit<CrosswordArticle, NotInCAPI | OptionalInCAPI> &
    Partial<Pick<Article, OptionalInCAPI>> &
    CAPIExtras

export type CAPIContent = CArticle | CGallery | CCrossword | CPicture

const truncateDateTime = (date: CapiDateTime64): CapiDateTime32 => ({
    iso8601: date.iso8601,
    dateTime: date.dateTime.toNumber(),
})

/**
 * We look for a very specific pattern which we know represent a header video
 * on an article. The video/media ID is sort of a UUID which can be later used
 * by the client to build a URL from, ex.
 * https://embed.theguardian.com/embed/atom/media/1c35effc-5275-45b1-802b-719ec45f0087
 */
const getMainMediaAtom = (
    capiBlocks?: IBlocks,
): MediaAtomElement | undefined => {
    if (capiBlocks == null) return
    const { main } = capiBlocks
    if (main == null || main.elements == null || main.elements.length !== 1)
        return
    const element = main.elements[0]
    if (element.type !== ElementType.CONTENTATOM) return
    const { contentAtomTypeData: data } = element
    if (data == null || data.atomType !== 'media') return
    return { id: 'media-atom', atomId: data.atomId } //, html: main.bodyHtml
}

const parseArticleResult = async (
    result: IContent,
    isFromPrint: boolean,
): Promise<[number, CAPIContent]> => {
    const path = result.id
    console.log(`Parsing CAPI response for ${path}`)
    const internalid = result.fields && result.fields.internalPageCode
    if (internalid == null)
        throw new Error(`internalid was undefined in ${path}!`)

    const title = (result.fields && result.fields.headline) || result.webTitle

    const atomData = rationaliseAtoms(result.atoms)

    const parser = elementParser(path, atomData)
    const kicker = kickerPicker(result, title)

    const articleType = articleTypePicker(result)

    const headerType = headerTypePicker(result)

    const displayHint = (result.fields && result.fields.displayHint) || ''

    const trail = result.fields && result.fields.trailText

    const byline = result.fields && result.fields.byline
    const bylineHtml = result.fields && result.fields.bylineHtml
    const bylineImages = getBylineImages(result)

    const images = getImages(result, articleType)

    const starRating = result.fields && result.fields.starRating

    const blocks =
        result.blocks &&
        result.blocks.body &&
        result.blocks.body.map(_ => _.elements)

    const body = blocks && blocks.reduce((acc, cur) => [...acc, ...cur], [])
    if (body == null) throw new Error(`Body was undefined in ${path}!`)

    const elements = await attempt(Promise.all(body.map(parser)))
    if (hasFailed(elements)) {
        console.error(elements)
        throw new Error(`Element parsing failed in ${path}!`) //This should not fire, the parser should log if anything async fails and then return the remainder.
    }

    if (elements == null) throw new Error(`Elements was undefined in ${path}!`)

    const webUrl = !isFromPrint ? result.webUrl : undefined

    switch (result.type) {
        case ContentType.ARTICLE:
            const article: [number, CArticle] = [
                internalid,
                {
                    internalPageCode: internalid,
                    type: 'article',
                    path: path,
                    headline: title,
                    kicker,
                    articleType,
                    headerType,
                    displayHint,
                    trail,
                    ...images,
                    byline: byline || '',
                    bylineHtml: bylineHtml || '',
                    bylineImages,
                    standfirst: trail || '',
                    elements,
                    starRating,
                    mainMedia: getMainMediaAtom(result.blocks),
                    isFromPrint,
                    webUrl,
                },
            ]
            return article

        case ContentType.GALLERY:
            const galleryArticle: [number, CGallery] = [
                internalid,
                {
                    internalPageCode: internalid,
                    type: 'gallery',
                    path: path,
                    headline: title,
                    trail,
                    kicker,
                    articleType,
                    headerType,
                    ...images,
                    byline: byline || '',
                    bylineHtml: bylineHtml || '',
                    standfirst: trail || '',
                    elements,
                    isFromPrint,
                    webUrl,
                },
            ]

            return galleryArticle

        case ContentType.PICTURE:
            const pictureArticle: [number, CPicture] = [
                internalid,
                {
                    internalPageCode: internalid,
                    type: 'picture',
                    path: path,
                    headline: title,
                    trail,
                    kicker,
                    articleType,
                    headerType,
                    ...images,
                    byline: byline || '',
                    bylineHtml: bylineHtml || '',
                    standfirst: trail || '',
                    elements,
                    isFromPrint,
                    webUrl,
                },
            ]

            return pictureArticle

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
                    internalPageCode: internalid,
                    type: 'crossword',
                    trail,
                    path: path,
                    headline: title,
                    headerType: headerType,
                    trailImage: undefined,
                    byline: byline || '',
                    bylineHtml: bylineHtml || '',
                    standfirst: trail || '',
                    crossword,
                    isFromPrint,
                    webUrl,
                },
            ]

            return crosswordArticle

        default:
            return [
                internalid,
                {
                    internalPageCode: internalid,
                    type: 'article',
                    path: path,
                    headline: title,
                    trail,
                    kicker,
                    ...images,
                    byline: byline || '',
                    bylineHtml: bylineHtml || '',
                    standfirst: trail || '',
                    headerType: headerType,
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
                    isFromPrint,
                    webUrl,
                },
            ]
    }
}

type CAPIEndpoint = 'preview' | 'printsent' | 'live'

const getStsCreds = async (role: string) => {
    const sts = new STS({ apiVersion: '2011-06-15' })
    const creds = await sts
        .assumeRole({
            RoleArn: role as string,
            RoleSessionName: 'capi-assume-role-access2',
        })
        .promise()
        .catch(err => console.error('assume role failed', err))

    if (creds && creds.Credentials) {
        return {
            secretAccessKey: creds.Credentials.SecretAccessKey,
            accessKeyId: creds.Credentials.AccessKeyId,
            sessionToken: creds.Credentials.SessionToken,
        }
    } else {
        const errorMessage = `Could not generate credentials using STS role ${role}`
        console.error(errorMessage)
        throw new Error(errorMessage)
    }
}

const getProfileCreds = async () => {
    const credentials = new SharedIniFileCredentials({ profile: 'capi' })
    return {
        secretAccessKey: credentials.secretAccessKey,
        accessKeyId: credentials.accessKeyId,
        sessionToken: credentials.sessionToken,
    }
}

/**
 * To access the capi Preview endpoint we need to sign requests (as it is a private api gateway endpoint)
 * This function generates the necessary headers.
 * @param endpoint
 */
export async function sign(endpoint: string) {
    const url = new URL(endpoint)

    const opts = {
        region: 'eu-west-1',
        service: 'execute-api',
        host: url.hostname,
        path: url.pathname + url.search,
    }

    const credentials = process.env.capiAccessArn
        ? await getStsCreds(process.env.capiAccessArn)
        : await getProfileCreds()

    const { headers } = new RequestSigner(opts, credentials).sign()

    console.log(`Signed request, generated headers: ${JSON.stringify(headers)}`)

    return headers
}

const getEndpoint = (capi: CAPIEndpoint, paths: string[]): string => {
    const queryString = `?ids=${paths.join(',')}&api-key=${
        process.env.CAPI_KEY
    }&format=thrift&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all&page-size=100`

    switch (capi) {
        case 'printsent':
            return `${process.env.psurl}/search${queryString}`
        case 'live':
            return `https://content.guardianapis.com/search${queryString}`
        case 'preview':
            return `${process.env.capiPreviewUrl}/search${queryString}`
        default:
            return ''
    }
}

const getPreviewHeaders = async (endpoint: string) => {
    return {
        Accept: 'application/json',
        ...(await sign(endpoint)),
    }
}

const isScheduledInNext30Days = (dateiso8601: string): boolean => {
    const date = new Date(dateiso8601)
    const oneMonthAway = new Date(new Date().setDate(date.getDate() + 30))
    return date < oneMonthAway
}

const removeUnscheduledDraftContent = (content: IContent[]): IContent[] => {
    return content.filter(
        c =>
            c.fields &&
            c.fields.scheduledPublicationDate &&
            isScheduledInNext30Days(c.fields.scheduledPublicationDate.iso8601),
    )
}

export const getArticles = async (
    ids: number[],
    capi: CAPIEndpoint,
): Promise<{ [key: string]: CAPIContent }> => {
    const paths = ids.map(_ => `internal-code/page/${_}`)
    const isFromPrint = capi === 'printsent'
    const endpoint = getEndpoint(capi, paths)
    const headers = capi === 'preview' ? await getPreviewHeaders(endpoint) : {}

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
    console.log('Debug link:', endpoint.replace(/thrift/g, 'json'))
    const resp = await attempt(fetch(endpoint, { headers }))
    if (hasFailed(resp)) throw new Error('Could not connect to CAPI.')
    if (resp.status != 200) {
        console.warn(`Non 200 status code: ${resp.status} ${resp.statusText}`)
    }
    const buffer = await resp.arrayBuffer()

    const receiver: BufferedTransport = BufferedTransport.receiver(
        Buffer.from(buffer),
    )
    const input = new CompactProtocol(receiver)
    const data = SearchResponseCodec.decode(input)
    const results: IContent[] = data.results
    const filteredResults =
        capi === 'preview' ? removeUnscheduledDraftContent(results) : results
    const articlePromises = await Promise.all(
        filteredResults.map(result =>
            attempt(parseArticleResult(result, isFromPrint)),
        ),
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
