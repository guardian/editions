import { Request, Response } from 'express'
import fetch from 'node-fetch'

export const appsRenderingController = async (req: Request, res: Response) => {
    const path = req.params.path
    const renderingUrl = `${process.env.APPS_RENDERING_URL}${path}?editions`
    
    console.log(`Fetching HTML from AppsRendering URL: ${renderingUrl}`)
    const renderResponse = await fetch(renderingUrl, {
        headers: { Accept: 'text/html' },
    })

    if (!renderResponse.ok) {
        const message = `Failed to fetch AppsRendered HTML from ${renderingUrl}. Response: ${renderResponse.statusText}`
        console.error(`${message}`)
        res.status(renderResponse.status).send(message)
        return
    }

    res.setHeader('Content-Type', 'text/html')
    renderResponse.body.pipe(res)
}
