import { Request, Response } from 'express'
import { getImageURL, getPalette } from '../image'
import { imageSizes } from '../../common/src/index'
export const imageController = (req: Request, res: Response) => {
    const source = req.params.source
    const size = req.params.size
    const path: string = req.params[0]
    console.log(`Getting image redirect for ${source} ${size} ${path}`)
    if (!imageSizes.includes(size)) {
        res.status(500)
        res.send('Invalid size')
    }
    const redirect = getImageURL({ source, path }, size)
    res.redirect(redirect)
}
export const imageColourController = (req: Request, res: Response) => {
    const source = req.params.source

    const path: string = req.params[0]
    getPalette({ source, path })
        .then(data => {
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(data))
        })
        .catch(e => console.error(e))
}
