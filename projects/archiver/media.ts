import { unnest } from 'ramda'
import { attempt, hasFailed } from '../backend/utils/try'
import {
    BlockElement,
    CAPIArticle,
    Front,
    Image,
    ImageSize,
    notNull,
    IssueCompositeKey,
} from './common'
import { getColours, getImage } from './src/downloader'
import { upload } from './src/upload'

const getImageFromElement = (element: BlockElement): Image | undefined => {
    switch (element.id) {
        case 'image':
            return element.src
        case 'media-atom':
            return element.image
    }
    return undefined
}

export const getImagesFromArticle = (article: CAPIArticle): Image[] => {
    const image = article.image
    const trailImage = article.trailImage
    const elements = article.type !== 'crossword' ? article.elements : []
    const cardImages = [article.cardImage, article.cardImageTablet]
    const bylineImages =
        (article.bylineImages && [article.bylineImages.cutout]) || []

    const images = elements.map(getImageFromElement)

    return [
        ...images,
        ...cardImages,
        ...bylineImages,
        image,
        trailImage,
    ].filter(notNull)
}

export const getImagesFromFront = (front: Front): Image[] => {
    const allCards = unnest(front.collections.map(_ => _.cards))
    const articles = unnest(allCards.map(_ => Object.values(_.articles)))
    const images = unnest(articles.map(getImagesFromArticle))
    console.log(`Found ${images.length} images in ${front.displayName}.`)
    return images
}

export const getAndUploadColours = async (
    publishedId: string,
    image: Image,
) => {
    const [colourPath, colours] = await getColours(publishedId, image)
    if (hasFailed(colours)) {
        console.error(`Could not get colours for ${colourPath}`)
        console.error(JSON.stringify(colours))
        return colours
    }
    return attempt(upload(colourPath, colours, 'application/json', 3600))
}

export const getAndUploadImage = async (
    publishedId: string,
    image: Image,
    size: ImageSize,
) => {
    const [path, data] = await getImage(publishedId, image, size)
    if (hasFailed(data)) return data
    return upload(path, data, 'image/jpeg', 3600)
}
