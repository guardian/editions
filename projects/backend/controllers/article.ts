import { Request, Response } from 'express'
import {
    BufferedTransport,
    CompactProtocol,
} from '@creditkarma/thrift-server-core'
import { ItemResponseCodec } from '@guardian/capi-ts'
import { elementParser } from '../capi/elements'
import fetch from 'node-fetch'
import { Article } from '../common'
import { extractImage } from '../capi/assets'
const url = (path: string) =>
    `https://content.guardianapis.com/${path}?format=thrift&api-key=${
        process.env.CAPI_KEY
    }&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all`

export const getArticle = async (path: string): Promise<Article> => {
    const resp = await fetch(url(path))
    const buffer = await resp.arrayBuffer()

    const receiver: BufferedTransport = BufferedTransport.receiver(
        new Buffer(buffer),
    )
    const input = new CompactProtocol(receiver)

    const data = ItemResponseCodec.decode(input)
    const title = data && data.content && data.content.webTitle
    if (title == null) throw new Error('Title was undefined!')
    const standfirst =
        data &&
        data.content &&
        data.content.fields &&
        data.content.fields.standfirst
    if (standfirst == null) throw new Error('Standfirst was undefined!')

    const image =
        data &&
        data.content &&
        data.content.blocks &&
        data.content.blocks.main &&
        data.content.blocks.main.elements &&
        data.content.blocks.main.elements[0].assets &&
        extractImage(data.content.blocks.main.elements[0].assets)
    const imageURL =
        (image && image.file) ||
        'https://media.guim.co.uk/d1c48b0c6ec594b396f786cfd3f6ba6ae0d93516/0_105_2754_1652/2754.jpg'

    const blocks =
        data &&
        data.content &&
        data.content.blocks &&
        data.content.blocks.body &&
        data.content.blocks.body.map(_ => _.elements)
    const body = blocks && blocks.reduce((acc, cur) => [...acc, ...cur], [])
    const elements = body && (await Promise.all(body.map(elementParser)))
    if (elements == null) throw new Error('Elements was undefined!')

    return {
        title,
        standfirst,
        imageURL,
        elements,
    }
}

export const articleController = (req: Request, res: Response) => {
    const path: string = req.params[0]
    getArticle(path).then(data => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(data))
    })
}
