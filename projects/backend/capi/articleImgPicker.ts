import { Content } from '@guardian/content-api-models/v1/content'
import {
    ArticleType,
    CreditedImage,
    Image,
    ImageRole,
    imageRoles,
    TrailImage,
} from '../common'
import { oc } from 'ts-optchain'
import { getCreditedImage, getImage } from './assets'
import { ContentType } from '@guardian/content-api-models/v1/contentType'
import { getImageFromURL } from '../image'

/**
 * This function exploits the 'role'field that is passed to the backend when generating image urls
 * to add some image quality overrides in certain scenarios. Any content with displayhint or articleType 'immersive'
 * gets it's images bumped to 'immersive' quality. The same happens to 'picture' content
 * @param articleType
 * @param displayHint
 * @param capiRole the image role specified in the content API (if any)
 * @param contentType e.g. gallery/picture/article - we want big pictures for the picture type
 */
export const getImageRole = (
    articleType: ArticleType,
    displayHint?: string,
    capiRole?: string,
    contentType?: ContentType,
): ImageRole | undefined => {
    if (
        (displayHint === 'immersive' ||
            articleType === ArticleType.Immersive ||
            contentType === ContentType.PICTURE) &&
        !capiRole
    ) {
        return 'immersive'
    } else return imageRoles.find((r) => r === capiRole)
}

const getMainImage = (
    result: Content,
    articleType: ArticleType,
): CreditedImage | undefined => {
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
              role: getImageRole(
                  articleType,
                  displayHint,
                  maybeCreditedMainImage.role,
                  result.type,
              ),
          }
        : maybeCreditedMainImage
}

const getTrailImage = (
    result: Content,
    articleType: ArticleType,
): TrailImage | undefined => {
    const maybeThumbnailElement =
        result.elements &&
        result.elements.find((element) => element.relation === 'thumbnail')

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
              role: getImageRole(
                  articleType,
                  displayHint,
                  maybeThumbnailImage.role,
              ),
          }
        : undefined
}

const getCartoonImages = (result: Content): Image[] | undefined => {
    const data = oc(result).blocks.main.elements[0].cartoonTypeData()
    if (data) {
        const mobileImages = data.variants?.find(
            (v) => v.viewportSize === 'small',
        )?.images
        const desktopImages = data?.variants?.find(
            (v) => v.viewportSize === 'large',
        )?.images
        if (mobileImages && mobileImages.length > 0) {
            return mobileImages
                .map((image) => getImageFromURL(image.file))
                .filter((item): item is Image => !!item)
        } else if (desktopImages && desktopImages.length > 0) {
            return desktopImages
                .map((image) => getImageFromURL(image.file))
                .filter((item): item is Image => !!item)
        }
    }
    return undefined
}

interface ImageAndTrailImage {
    image: CreditedImage | undefined
    trailImage: TrailImage | undefined
}

const getImages = (
    result: Content,
    articleType: ArticleType,
): ImageAndTrailImage => {
    return {
        image: getMainImage(result, articleType),
        trailImage: getTrailImage(result, articleType),
    }
}

export { getImages, getCartoonImages, ImageAndTrailImage }
