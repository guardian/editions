import { Request, Response } from 'express'
import { imageSizes, ImageUse, imageUses } from '../../Apps/common/src/index'
import { Image, ImageRole, imageRoles } from '../common'
import { getImageURL } from '../image'

const getUse = (use: string | undefined): ImageUse | undefined => {
    const imageUse = imageUses.find((_) => _ == use)
    return imageUse
}
/**
 * This controller is responsible for returning image source urls
 * Params:
 * source: the path to the image
 * size: refers to device - currently we produce 4 zip files for phone, tablet, tabletL, tabletXL
 * use: where the image is used. images on fronts will be 'thumbnail' typically, images in articles
 *      (or on full size front cards) are 'full-size'
 * role: refers to 'role' field coming from the content API. Comes from composer:
 * https://github.com/guardian/flexible-content/blob/2b6c563e7649ccaaba22a178df868f9a274aded4/composer/src/js/controllers/content/common/body-block/elements/edit.js#L269
 */
export const imageController = (req: Request, res: Response) => {
    const source = req.params.source
    const size = req.params.size
    const lastPathParam: string = req.params[0]
    const use = getUse(req.params.use) || 'full-size'
    const role: ImageRole =
        imageRoles.find((r) => r === req.query.role) || 'inline'
    const img: Image = { source, path: lastPathParam, role }

    if (!imageSizes.includes(size)) {
        res.status(500)
        res.send('Invalid size')
    }
    const redirect = getImageURL(img, size, use)
    console.log(
        `Getting image redirect for ${source} ${size} ${lastPathParam} role : ${role} redirect: ${redirect}`,
    )
    res.redirect(redirect)
}
