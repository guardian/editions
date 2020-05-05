import { IContent } from '@guardian/capi-ts'
import {
    CreditedImage,
    TrailImage,
    ImageRole,
    imageRoles,
} from '../../Apps/common/src'
import { oc } from 'ts-optchain'
import { getImage, getCreditedImage } from './assets'

/**
 * if no role is included in capi and content is immersive, set role to immersive
 * this makes it easier for the archiver/backend to identify images that will be stretched to full screen
 * @param displayHint
 * @param capiRole the image role specified in the content API (if any)
 */
const getImageRole = (
    displayHint?: string,
    capiRole?: string,
): ImageRole | undefined => {
    console.log('getImageRole', displayHint, capiRole)
    if (displayHint === 'immersive' && !capiRole) {
        return displayHint
    } else return imageRoles.find(r => r === capiRole)
}

const getMainImage = (result: IContent): CreditedImage | undefined => {
    const maybeMainElement = oc(result).blocks.main.elements[0]()
    const maybeCreditedMainImage =
        maybeMainElement && getCreditedImage(maybeMainElement)

    if (!maybeCreditedMainImage) {
        console.warn(`No main image in ${result.id}`)
    }
    const displayHint = oc(result).fields.displayHint()

    return maybeCreditedMainImage
        ? {
              ...maybeCreditedMainImage,
              role: getImageRole(displayHint, maybeCreditedMainImage.role),
          }
        : maybeCreditedMainImage
}

const getTrailImage = (result: IContent): TrailImage | undefined => {
    const maybeThumbnailElement =
        result.elements &&
        result.elements.find(element => element.relation === 'thumbnail')

    const maybeThumbnailImage =
        maybeThumbnailElement && getImage(maybeThumbnailElement.assets)

    const displayHint = oc(result).fields.displayHint()

    return maybeThumbnailImage
        ? {
              ...maybeThumbnailImage,
              use: {
                  mobile: 'full-size',
                  tablet: 'full-size',
              },
              role: getImageRole(displayHint, maybeThumbnailImage.role),
          }
        : undefined
}

interface ImageAndTrailImage {
    image: CreditedImage | undefined
    trailImage: TrailImage | undefined
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
