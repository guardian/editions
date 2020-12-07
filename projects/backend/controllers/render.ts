import { Request, Response } from 'express'
import fetch from 'node-fetch'

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

export const renderController = async (req: Request, res: Response) => {
    const path = req.params.path
    const renderingUrl = `${process.env.APPS_RENDERING_URL}${path}?editions`
    console.log(`Fetching ${renderingUrl} from apps rendering`)
    const renderResponse = await fetchRenderedArticle(renderingUrl)

    if (renderResponse.success) {
        res.setHeader('Content-Type', 'text/html')
        res.send(renderResponse.body)
    } else {
        const message = `Failed to fetch story from ${renderingUrl}. Response: ${renderResponse.body}`
        console.error(`${message}`)
        res.status(renderResponse.status).send(message)
    }
}
