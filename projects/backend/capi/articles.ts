import { attempt, hasFailed, hasSucceeded } from '../utils/try'
import { SearchResponseCodec, ContentType } from '@guardian/capi-ts'
import { BlockElement } from '../common'
import {
    BufferedTransport,
    CompactProtocol,
} from '@creditkarma/thrift-server-core'
import { extractImage } from './assets'
import { elementParser } from './elements'
import fromEntries from 'object.fromentries'
import { IContent } from '@guardian/capi-ts/dist/Content'
import { ICrossword } from '@guardian/capi-ts/dist/Crossword'
import fetch from 'node-fetch'
import striptags from 'striptags'

interface Article {
    type: 'article'
    id: number
    path: string
    headline: string
    kicker?: string
    image: string
    byline: string
    standfirst: string
    imageURL?: string
    elements: BlockElement[]
}

export interface CrosswordArticle {
    type: 'crossword'
    id: number
    path: string
    headline: string
    kicker?: string
    byline?: string
    standfirst?: string
    crossword: ICrossword
}

export type CAPIContent = Article | CrosswordArticle

const parseArticleResult = async (
    result: IContent,
): Promise<[number, CAPIContent]> => {
    const path = result.id

    const internalid = result.fields && result.fields.internalPageCode
    if (internalid == null)
        throw new Error(`internalid was undefined in ${path}!`)

    const title = result && result.webTitle

    const standfirst =
        result &&
        result.fields &&
        result.fields.standfirst &&
        striptags(result.fields.standfirst)

    const byline = result && result.fields && result.fields.byline

    switch (result.type) {
        case ContentType.ARTICLE:
            const parser = elementParser(path)
            const kicker = result.tags[0] && result.tags[0].webTitle

            const image =
                result &&
                result.blocks &&
                result.blocks.main &&
                result.blocks.main.elements &&
                result.blocks.main.elements[0].assets &&
                extractImage(result.blocks.main.elements[0].assets)

            const imageURL =
                (image && image.file) ||
                'https://media.guim.co.uk/d1c48b0c6ec594b396f786cfd3f6ba6ae0d93516/0_105_2754_1652/2754.jpg'

            const blocks =
                result &&
                result.blocks &&
                result.blocks.body &&
                result.blocks.body.map(_ => _.elements)
            const body =
                blocks && blocks.reduce((acc, cur) => [...acc, ...cur], [])
            if (body == null) throw new Error(`Body was undefined in ${path}!`)

            const elements = await attempt(Promise.all(body.map(parser)))
            if (hasFailed(elements))
                throw new Error(`Element parsing failed in ${path}!`) //This should not fire, the parser should log if anything async fails and then return the remainder.

            if (elements == null)
                throw new Error(`Elements was undefined in ${path}!`)

            const article: [number, Article] = [
                internalid,
                {
                    type: 'article',
                    id: internalid,
                    path: path,
                    headline: title,
                    kicker,
                    image: imageURL,
                    byline: byline || '',
                    standfirst: standfirst || '',
                    imageURL,
                    elements,
                },
            ]
            return article

        case ContentType.CROSSWORD:
            if (result.crossword == null)
                throw new Error(
                    `No crossword defined in Crossword article: ${path}`,
                )

            const crosswordArticle: [number, CrosswordArticle] = [
                internalid,
                {
                    type: 'crossword',
                    id: internalid,
                    path: path,
                    headline: title,
                    byline: byline || '',
                    standfirst: standfirst || '',
                    crossword: result.crossword,
                },
            ]

            return crosswordArticle

        default:
            throw new Error(`${path} isn't an article or a crossword`)
    }
}

const capiApiKey = process.env.CAPI_KEY

const printsent = (paths: string[]) =>
    `${process.env.psurl}?ids=${paths.join(
        ',',
    )}format=thrift&api-key=${capiApiKey}&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all&format=thrift&page-size=100`

const search = (paths: string[]) =>
    `https://content.guardianapis.com/search?ids=${paths.join(
        ',',
    )}format=thrift&api-key=${capiApiKey}&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all&format=thrift&page-size=100`

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
        return fromEntries(firstArray.concat(lastArray))
    }

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
    return fromEntries(articleEntries)
}
