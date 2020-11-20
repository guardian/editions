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

// TODO: this needs a test once we're happy with the correct format for the paths
const replaceImageUrls = (html: string): string => {
    return html.replace(/https:\/\/i.guim.co.uk\/img\//g, `../media/images/`)
}

export const renderController = async (req: Request, res: Response) => {
    const path = req.params.path
    const renderingUrl = `${process.env.APPS_RENDERING_URL}${path}?editions`
    console.log(`Fetching ${renderingUrl} from apps rendering`)
    const renderResponse = await fetchRenderedArticle(renderingUrl)

    if (renderResponse.success) {
        const htmlWithImagesReplaced = replaceImageUrls(renderResponse.body)
        res.setHeader('Content-Type', 'text/html')
        res.send(htmlWithImagesReplaced)
    } else {
        const message = `Failed to fetch story from ${renderingUrl}. Response: ${renderResponse.body}`
        console.error(`${message}`)
        res.status(renderResponse.status).send(message)
    }
}
