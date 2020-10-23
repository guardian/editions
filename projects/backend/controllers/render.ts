import { Request, Response } from 'express'
import fetch from 'node-fetch'

export const renderController = async (req: Request, res: Response) => {
    const path = req.params.path
    const renderingUrl = `${process.env.APPS_RENDERING_URL}${path}`
    console.log(`fetching ${renderingUrl}`)
    const response = await fetch(renderingUrl)
    const text = await response.text()
    res.send(text)
}
