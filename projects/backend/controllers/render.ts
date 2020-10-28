import { Request, Response } from 'express'
import fetch from 'node-fetch'

export const renderController = async (req: Request, res: Response) => {
    const path = req.params.path
    const renderingUrl = `${process.env.APPS_RENDERING_URL}${path}`
    console.log(`Fetching ${renderingUrl} from apps rendering`)
    const response = await fetch(renderingUrl, {
        headers: {
            Accept:
                'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        },
    })
    const text = await response.text()
    if (response.status === 200) {
        res.send(text)
    } else {
        const message = `Failed to fetch story from ${renderingUrl}. Response: ${text}`
        console.error(`${message}`)
        res.status(response.status).send(message)
    }
}
