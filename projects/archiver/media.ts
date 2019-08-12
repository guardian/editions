import { Front, ImageElement, CAPIArticle, Image } from './common'
import { unnest } from 'ramda'
import { getColours, getImage } from './downloader'
import { hasFailed, attempt } from '../backend/utils/try'
import { upload } from './upload'
import { ImageSize, notNull } from '../common/src'

export const getImagesFromArticle = (article: CAPIArticle): Image[] => {
    const image = article.image
    const elements = article.type !== 'crossword' ? article.elements : []
    const slideshowImages = article.slideshowImages || []
    const bylineImages =
        (article.bylineImages && [
            article.bylineImages.cutout,
            article.bylineImages.thumbnail,
        ]) ||
        []

    const images = elements
        .filter((element): element is ImageElement => element.id === 'image')
        .map(element => element.src)

    return [...images, ...slideshowImages, ...bylineImages, image].filter(
        notNull,
    )
}

export const getImagesFromFront = (front: Front): Image[] => {
    const allCards = unnest(front.collections.map(_ => _.cards))
    const articles = unnest(allCards.map(_ => Object.values(_.articles)))
    const images = unnest(articles.map(getImagesFromArticle))
    console.log(`Found ${images.length} images in ${front.displayName}.`)
    return images
}

export const getAndUploadColours = async (
    source: string,
    id: string,
    image: Image,
) => {
    const [colourPath, colours] = await getColours(source, id, image)
    if (hasFailed(colours)) {
        console.error(`Could not get colours for ${colourPath}`)
        console.error(JSON.stringify(colours))
        return colours
    }
    return attempt(upload(colourPath, colours))
}

export const getAndUploadImage = async (
    source: string,
    issue: string,
    image: Image,
    size: ImageSize,
) => {
    const [path, data] = await getImage(source, issue, image, size)
    if (hasFailed(data)) return data
    return upload(path, data)
}
