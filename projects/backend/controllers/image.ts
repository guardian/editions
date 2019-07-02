import { Request, Response } from 'express'
import { getRedirect } from '../image'
import { imageSizes } from '../../common/src/index'
export const imageController = (req: Request, res: Response) => {
    const source = req.params.source
    const size = req.params.size
    if (!imageSizes.includes(size)) {
        res.status(500)
        res.send('Invalid size')
    }
    const path: string = req.params[0]
    const redirect = getRedirect(source, size, path)
    res.redirect(redirect)
}
