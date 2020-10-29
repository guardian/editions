import { Request, Response } from 'express'
import fetch from 'node-fetch'
import { ImageSize } from '../../Apps/common/src'

// TODO: this needs a test once we're happy with the correct format for the paths
const replaceImageUrls = (html: string, imageSize: ImageSize): string => {
    return html.replace(
        /https:\/\/i.guim.co.uk\/img\//g,
        `../../media/${imageSize}/`,
    )
}

export const renderController = async (req: Request, res: Response) => {
    const path = req.params.path
    const replaceImagePaths = req.query.replaceImagePaths
    const imageSize = req.query.imageSize as ImageSize
    const renderingUrl = `${process.env.APPS_RENDERING_URL}${path}`
    console.log(
        `Fetching ${renderingUrl} from apps rendering. replaceImagePaths: ${replaceImagePaths}`,
    )
    const response = await fetch(renderingUrl, {
        headers: {
            Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
    })
    const responseBody = await response.text()

    const editionsRenderedHtml =
        replaceImagePaths === 'true'
            ? replaceImageUrls(responseBody, imageSize)
            : responseBody

    if (response.statusText == 'OK') {
        res.setHeader('Content-Type', 'text/html')
        res.send(editionsRenderedHtml)
    } else {
        const message = `Failed to fetch story from ${renderingUrl}. Response: ${responseBody}`
        console.error(`${message}`)
        res.status(response.status).send(message)
    }
}
