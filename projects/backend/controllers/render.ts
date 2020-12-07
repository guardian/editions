import { Request, Response } from 'express'
import fetch from 'node-fetch'
import {
    CAPIEndpoint,
    generateCapiEndpoint,
    getPreviewHeaders,
} from '../utils/article'
import { attempt, hasFailed } from '../utils/try'

const fetchRenderedArticle = async (url: string, buffer: ArrayBuffer) => {
    const response = await fetch(url, {
        method: 'post',
        headers: { 'Content-Type': 'application/octet-stream' },
        body: buffer,
    })
    const responseBody = await response.text()
    return {
        success: response.statusText === 'OK',
        status: response.status,
        body: responseBody,
    }
}

const fetchCapiArticle = async (
    internalPageCode: number,
    capi: CAPIEndpoint,
): Promise<ArrayBuffer | undefined> => {
    try {
        const endpoint = generateCapiEndpoint([internalPageCode], capi)
        const headers =
            capi === 'preview' ? await getPreviewHeaders(endpoint) : {}
        console.log('Making CAPI query', endpoint)
        console.log('Debug link:', endpoint.replace(/thrift/g, 'json'))
        const resp = await attempt(fetch(endpoint, { headers }))

        if (hasFailed(resp)) throw new Error('Could not connect to CAPI.')

        if (resp.status != 200) {
            console.warn(
                `Non 200 status code: ${resp.status} ${resp.statusText}`,
            )
        }

        return await resp.arrayBuffer()
    } catch (error) {
        console.warn(
            `Failed to fetch article from capi (${capi}) for internalPageCode=${internalPageCode}`,
        )
        return undefined
    }
}

export const renderController = async (req: Request, res: Response) => {
    const pageCode = req.params.internalPageCode
    //The article we are looking for could be in any environment, need to
    //make an attempt to fetch from all three environment
    console.log(`Trying to fetch article from capi (live)`)
    let capiResponse = await fetchCapiArticle(pageCode, 'live')
    if (!capiResponse) {
        console.log(
            `Article was not found in capi (live), trying to fetch from printsent`,
        )
        capiResponse = await fetchCapiArticle(pageCode, 'printsent')
    }
    if (!capiResponse) {
        console.log(
            `Article was not found in capi (printsent), trying to fetch from preview`,
        )
        capiResponse = await fetchCapiArticle(pageCode, 'preview')
    }

    if (!capiResponse) {
        const message = `Failed to fetch article from capi (print, live & preview) for ${pageCode}`
        console.error(`${message}`)
        res.status(400).send(message)
        return
    }

    const stage = process.env.stage || 'dev'
    const renderingUrl =
        stage == 'dev'
            ? 'http://localhost:8080/render-edition-article'
            : `${process.env.APPS_RENDERING_URL}`

    const response = await fetchRenderedArticle(renderingUrl, capiResponse)

    if (response.success) {
        res.setHeader('Content-Type', 'text/html')
        res.send(response.body)
    } else {
        const message = `Failed to fetch story from ${renderingUrl}. Response: ${response.body}`
        console.error(`${message}`)
        res.status(response.status).send(message)
    }
}
