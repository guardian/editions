import { attempt, hasFailed, hasSucceeded } from '../utils/try'
import {
    SearchResponseCodec,
    ItemResponseCodec,
    ContentType,
} from '@guardian/capi-ts'
import { Article, BlockElement } from '../common'
import {
    BufferedTransport,
    CompactProtocol,
} from '@creditkarma/thrift-server-core'
import { extractImage } from './assets'
import { elementParser } from './elements'
import fromEntries from 'object.fromentries'
import { IContent } from '@guardian/capi-ts/dist/Content'
import fetch from 'node-fetch'

interface CAPIArticle {
    id: number | undefined
    headline: string
    image: string
    byline: string
    standfirst: string
    imageURL?: string
    elements: BlockElement[]
}

const url = (paths: string[]) =>
    `https://content.guardianapis.com/search?ids=${paths.join(
        ',',
    )}format=thrift&api-key=${
        process.env.CAPI_KEY
    }&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all&format=thrift`

export const getArticles = async (
    paths: string[],
): Promise<{ [key: string]: CAPIArticle }> => {
    const resp = await attempt(fetch(url(paths)))
    if (hasFailed(resp)) throw new Error('Could not connect to CAPI.')
    // console.log(await resp.text())
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

const parseArticleResult = async (
    result: IContent,
): Promise<[string, CAPIArticle]> => {
    const id = result.id

    if (result.type !== ContentType.ARTICLE)
        throw new Error(`${id} isn't an article`)
    const internalid = result.fields && result.fields.internalPageCode

    const parser = elementParser(id)
    const title = result && result.webTitle
    const standfirst = result && result.fields && result.fields.standfirst
    if (standfirst == null)
        throw new Error(`Standfirst was undefined in ${id}!`)

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
    const body = blocks && blocks.reduce((acc, cur) => [...acc, ...cur], [])
    if (body == null) throw new Error(`Body was undefined in ${id}!`)

    const elements = await attempt(Promise.all(body.map(parser)))
    if (hasFailed(elements)) throw new Error(`Element parsing failed in ${id}!`) //This should not fire, the parser should log if anything async fails and then return the remainder.

    if (elements == null) throw new Error(`Elements was undefined in ${id}!`)

    const byline = result && result.fields && result.fields.byline

    if (byline == null) throw new Error(`Byline was undefined in ${id}!`)

    return [
        result.id,
        {
            id: internalid,
            byline,
            headline: title,
            standfirst,
            image: imageURL,
            elements,
        },
    ]
}
