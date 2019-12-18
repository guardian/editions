import { IContent } from '@guardian/capi-ts'
import { Image, CreditedImage } from '../../Apps/common/src'
import { oc } from 'ts-optchain'
import { getImage, getCreditedImage } from './assets'

const getMainImage = (result: IContent): CreditedImage | undefined => {
    const maybeMainElement = oc(result).blocks.main.elements[0]()
    const maybeCreditedMainImage =
        maybeMainElement && getCreditedImage(maybeMainElement)

    if (!maybeCreditedMainImage) {
        console.warn(`No main image in ${result.id}`)
    }
    return maybeCreditedMainImage
}

const getTrailImage = (result: IContent): Image | undefined => {
    const maybeThumbnailElement =
        result.elements &&
        result.elements.find(element => element.relation === 'thumbnail')
    console.log(
        result.apiUrl +
            ' maybeThumbnailElement: ' +
            JSON.stringify(maybeThumbnailElement),
    )

    const maybeThumbnailImage =
        maybeThumbnailElement && getImage(maybeThumbnailElement.assets)
    console.log(
        result.apiUrl +
            ' maybeThumbnailImage: ' +
            JSON.stringify(maybeThumbnailImage),
    )

    return maybeThumbnailImage
}

interface ImageAndTrailImage {
    image: CreditedImage | undefined
    trailImage: Image | undefined
}

const getImages = (result: IContent): ImageAndTrailImage => {
    const images = {
        image: getMainImage(result),
        trailImage: getTrailImage(result),
    }
    console.log('Found images: ' + JSON.stringify(images))
    return images
}

export { getImages, ImageAndTrailImage }
