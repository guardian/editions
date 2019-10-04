import { Request, Response } from 'express'
import { getImageURL, getPalette } from '../image'
import { imageSizes } from '../../common/src/index'
import { Image } from '../common'

export const imageController = (req: Request, res: Response) => {
    const source = req.params.source
    const size = req.params.size
    const lastPathParam: string = req.params[0]
    const img: Image = { source, path: lastPathParam }
    console.log(`Getting image redirect for ${source} ${size} ${lastPathParam}`)
    if (!imageSizes.includes(size)) {
        res.status(500)
        res.send('Invalid size')
    }
    const redirect = getImageURL(img, size)
    res.redirect(redirect)
}
export const imageColourController = (req: Request, res: Response) => {
    const source = req.params.source
    const lastPathParam: string = req.params[0]
    const img: Image = { source, path: lastPathParam }
    getPalette(img)
        .then(data => {
            res.setHeader('Content-Type', 'application/json')
            res.send(JSON.stringify(data))
        })
        .catch(e => console.error(e))
}
