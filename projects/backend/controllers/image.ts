import { Request, Response } from 'express'
import { getImageURL } from '../image'
import { imageSizes } from '../../common/src/index'
export const imageController = (req: Request, res: Response) => {
    const source = req.params.source
    const size = req.params.size
    if (!imageSizes.includes(size)) {
        res.status(500)
        res.send('Invalid size')
    }
    const path: string = req.params[0]
    const redirect = getImageURL({ source, path }, size)
    res.redirect(redirect)
}
