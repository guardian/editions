import { Request, Response } from 'express'
import { imageSizes, ImageUse, imageUses } from '../../common/src/index'
import { Image } from '../common'
import { getImageURL } from '../image'

const getUse = (use: string | undefined): ImageUse | undefined => {
    const imageUse = imageUses.find(_ => _ == use)
    return imageUse
}

export const imageController = (req: Request, res: Response) => {
    const source = req.params.source
    const size = req.params.size
    const lastPathParam: string = req.params[0]
    const img: Image = { source, path: lastPathParam }
    const use = getUse(req.params.use) || 'full-size'
    console.log(`Getting image redirect for ${source} ${size} ${lastPathParam}`)
    if (!imageSizes.includes(size)) {
        res.status(500)
        res.send('Invalid size')
    }
    const redirect = getImageURL(img, size, use)
    res.redirect(redirect)
}
