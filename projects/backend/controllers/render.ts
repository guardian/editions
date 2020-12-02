import { Request, Response } from 'express'
import fetch from 'node-fetch'
import { attempt, hasFailed } from '../utils/try'
import {
    RenderingRequest,
    RenderingRequestSerde,
} from '@guardian/apps-rendering-api-models/renderingRequest'
import {
    BufferedTransport,
    CompactProtocol,
} from '@creditkarma/thrift-server-core'
import {
    TProtocol,
    TCompactProtocol,
    TBinaryProtocol,
    TBufferedTransport,
    TFramedTransport,
} from 'thrift'
import { IContent, SearchResponseCodec } from '@guardian/capi-ts'

const fetchRenderedArticle = async (url: string) => {
    const response = await fetch(url, {
        headers: {
            Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
    })
    const responseBody = await response.text()
    return {
        success: response.statusText === 'OK',
        status: response.status,
        body: responseBody,
    }
}

// TODO: this needs a test once we're happy with the correct format for the paths
const replaceImageUrls = (html: string): string => {
    return html.replace(/https:\/\/i.guim.co.uk\/img\//g, `../media/`)
}

type CAPIEndpoint = 'preview' | 'printsent' | 'live'
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

export const renderController = async (req: Request, res: Response) => {
    const pageCode = 8251844 //TODO
    const capi = 'live' //TODO
    const paths = [`internal-code/page/${pageCode}`]
    const isFromPrint = false //capi === 'printsent'
    const endpoint = getEndpoint(capi, paths)
    // const headers = capi === 'preview' ? await getPreviewHeaders(endpoint) : {}
    const headers = {}
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

    const rr: RenderingRequest = {
        content: results[0],
    } as RenderingRequest

    const newBuffer = new TBufferedTransport()
    const protocol = new TCompactProtocol(newBuffer)
    RenderingRequestSerde.write(protocol, rr)

    const response = await fetch('http://localhost:8080/edition-article', {
        method: 'post',
        body: protocol.readBinary(),
    })

    res.send('OK')

    // const path = req.params.path
    // const renderingUrl = `${process.env.APPS_RENDERING_URL}${path}?editions`
    // console.log(`Fetching ${renderingUrl} from apps rendering`)
    // const renderResponse = await fetchRenderedArticle(renderingUrl)

    // if (renderResponse.success) {
    //     const htmlWithImagesReplaced = replaceImageUrls(renderResponse.body)
    //     res.setHeader('Content-Type', 'text/html')
    //     res.send(htmlWithImagesReplaced)
    // } else {
    //     const message = `Failed to fetch story from ${renderingUrl}. Response: ${renderResponse.body}`
    //     console.error(`${message}`)
    //     res.status(renderResponse.status).send(message)
    // }
}
