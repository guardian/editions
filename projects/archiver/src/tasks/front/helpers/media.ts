import { unnest, uniq } from 'ramda'
import { hasFailed } from '../../../../../backend/utils/try'
import {
    BlockElement,
    CAPIArticle,
    Front,
    Image,
    ImageSize,
    ImageUse,
    notNull,
    TrailImage,
} from '../../../../common'
import { getImageUse } from '../../../utils/backend-client'
import { getBucket, ONE_WEEK, upload } from '../../../utils/s3'

const getImageFromElement = (element: BlockElement): Image | undefined => {
    switch (element.id) {
        case 'image':
            return element.src
        case 'media-atom':
            return element.image
    }
    return undefined
}

export const getImagesFromArticle = (
    article: CAPIArticle,
): (Image | TrailImage)[] => {
    const image = article.image
    console.log('Main media image is: ' + JSON.stringify(image))

    const trailImage = article.trailImage
    console.log('Trail image is: ' + JSON.stringify(trailImage))

    const elements = article.type !== 'crossword' ? article.elements : []

    const cardImages = [article.cardImage, article.cardImageTablet]
    console.log('Card images are: ' + JSON.stringify(cardImages))

    const bylineImages =
        (article.bylineImages && [article.bylineImages.cutout]) || []
    console.log('Byline images are: ' + JSON.stringify(bylineImages))

    const images = elements.map(getImageFromElement)
    console.log('Images are: ' + JSON.stringify(images))

    const requiredImages = [
        ...images,
        ...cardImages,
        ...bylineImages,
        image,
        trailImage,
    ].filter(notNull)
    console.log('Required images are: ' + JSON.stringify(requiredImages))

    return requiredImages
}

export const getImagesFromFront = (front: Front): (Image | TrailImage)[] => {
    console.log('Getting images for front ' + JSON.stringify(front))

    const allCards = unnest(front.collections.map((_) => _.cards))
    const articles = unnest(allCards.map((_) => Object.values(_.articles)))
    const images = unnest(articles.map(getImagesFromArticle))
    console.log(`Found ${images.length} images in ${front.displayName}.`)
    return images
}

export const getAndUploadImageUse = async (
    publishedId: string,
    image: Image,
    size: ImageSize,
    use: ImageUse,
) => {
    const [path, data] = await getImageUse(publishedId, image, size, use)
    if (hasFailed(data)) return data
    const Bucket = getBucket('proof')
    return upload(path, data, Bucket, 'image/jpeg', ONE_WEEK)
}

export const getImageUses = (image: Image | TrailImage): ImageUse[] => {
    const fallback: ImageUse = 'full-size'
    if (!('use' in image)) {
        return [fallback]
    }
    return uniq(
        [image.use.mobile, image.use.tablet, fallback].filter(
            (_) => _ !== 'not-used',
        ),
    )
}
