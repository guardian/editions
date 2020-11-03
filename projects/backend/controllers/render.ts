import { Request, Response } from 'express'
import fetch from 'node-fetch'
import { ImageSize, imageSizes, RenderedContent } from '../../Apps/common/src'

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
const replaceImageUrls = (html: string, imageSize: ImageSize): string => {
    return html.replace(
        /https:\/\/i.guim.co.uk\/img\//g,
        `../../media/${imageSize}/`,
    )
}

const getAllImageSizesHtml = (renderedArticle: string): RenderedContent[] => {
    return imageSizes.map(size => {
        return {
            size,
            html: replaceImageUrls(renderedArticle, size),
        }
    })
}

const getRenderResponse = (renderedArticle: string, imageSize: string) => {
    if (imageSize === 'all') {
        return {
            contentType: 'application/json',
            responseBody: JSON.stringify(getAllImageSizesHtml(renderedArticle)),
        }
    } else {
        const responseBody = (imageSizes as readonly string[]).includes(
            imageSize,
        )
            ? replaceImageUrls(renderedArticle, imageSize as ImageSize)
            : renderedArticle
        return { contentType: 'text/html', responseBody }
    }
}

export const renderController = async (req: Request, res: Response) => {
    const path = req.params.path
    const imageSize = req.query.imageSize
    const renderingUrl = `${process.env.APPS_RENDERING_URL}${path}?editions`
    console.log(
        `Fetching ${renderingUrl} from apps rendering. imageSize: ${imageSize}`,
    )
    const renderResponse = await fetchRenderedArticle(renderingUrl)

    const response = getRenderResponse(renderResponse.body, imageSize)

    if (renderResponse.success) {
        res.setHeader('Content-Type', response.contentType)
        res.send(response.responseBody)
    } else {
        const message = `Failed to fetch story from ${renderingUrl}. Response: ${renderResponse.body}`
        console.error(`${message}`)
        res.status(renderResponse.status).send(message)
    }
}
