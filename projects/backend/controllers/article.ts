import { Request, Response } from 'express'
import {
    BufferedTransport,
    CompactProtocol,
} from '@creditkarma/thrift-server-core'
import { ItemResponseCodec } from '@guardian/capi-ts'
import { elementParser } from '../capi/elements'
import fetch from 'node-fetch'
const url = (path: string) =>
    `https://content.guardianapis.com/${path}?format=thrift&api-key=${
        process.env.CAPI_KEY
    }&show-elements=all&show-atoms=all&show-rights=all&show-fields=all&show-tags=all&show-blocks=all&show-references=all`

export const getArticle = async (path: string) => {
    const resp = await fetch(url(path))
    const buffer = await resp.arrayBuffer()

    const receiver: BufferedTransport = BufferedTransport.receiver(
        new Buffer(buffer),
    )
    const input = new CompactProtocol(receiver)

    const data = ItemResponseCodec.decode(input)
    const title = data && data.content && data.content.webTitle
    const blocks =
        data &&
        data.content &&
        data.content.blocks &&
        data.content.blocks.body &&
        data.content.blocks.body.map(_ => _.elements)
    const body = blocks && blocks.reduce((acc, cur) => [...acc, ...cur], [])
    const elements = body && body.map(elementParser)
    return [title, elements]
}

export const articleController = (req: Request, res: Response) => {
    const path: string = req.params[0]
    getArticle(path).then(data => {
        res.setHeader('Content-Type', 'application/json')
        res.send(JSON.stringify(data))
    })
}
