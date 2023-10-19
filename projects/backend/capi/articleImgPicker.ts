import { Content } from '@guardian/content-api-models/v1/content'
import {
    ArticleType,
    CreditedImage,
    ImageRole,
    imageRoles,
    TrailImage,
} from '../../Apps/common/src'
import { oc } from 'ts-optchain'
import { getCreditedImage, getImage } from './assets'
import { ContentType } from '@guardian/content-api-models/v1/contentType'
import { ElementType } from '@guardian/content-api-models/v1/elementType'

/**
 * This function exploits the 'role' field that is passed to the backend when generating image urls
 * to add some image quality overrides in certain scenarios. Any content with displayhint or articleType 'immersive'
 * gets its images bumped to 'immersive' quality. The same happens to 'picture' content
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

    // we populate the body with the cartoon, so we don't want it to render in main media
    if (maybeMainElement && maybeMainElement.type === ElementType.CARTOON) {
        return undefined
    }

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

interface ImageAndTrailImage {
    image: CreditedImage | undefined
    trailImage: TrailImage | undefined
}

const getImages = (
    result: Content,
    articleType: ArticleType,
): ImageAndTrailImage => {
    const images = {
        image: getMainImage(result, articleType),
        trailImage: getTrailImage(result, articleType),
    }
    return images
}

export { getImages, ImageAndTrailImage }
