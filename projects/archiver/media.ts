import { Front, ImageElement, CAPIArticle, Image } from './common'
import { unnest } from 'ramda'
import { getColours, getImage } from './downloader'
import { hasFailed, attempt } from '../backend/utils/try'
import { upload } from './upload'
import { ImageSize, mediaPath } from '../common/src'
import { PassThrough } from 'stream'
import fetch, { Response } from 'node-fetch'

export const getImagesFromArticle = (article: CAPIArticle): Image[] => {
    const image = article.image ? [article.image] : []
    const elements = article.type === 'article' ? article.elements : []
    const images = elements
        .filter((element): element is ImageElement => element.id === 'image')
        .map(element => element.src)

    return [...images, ...image]
}

export const getImagesFromFront = (front: Front): Image[] => {
    const allCards = unnest(front.collections.map(_ => _.cards))
    const articles = unnest(allCards.map(_ => Object.values(_.articles)))
    const images = unnest(articles.map(getImagesFromArticle))
    console.log(`Found ${images.length} images in ${front.displayName}.`)
    return images
}

export const getAndUploadColours = async (id: string, image: Image) => {
    const [colourPath, colours] = await getColours(id, image)
    if (hasFailed(colours)) {
        console.error(`Could not get colours for ${colourPath}`)
        console.error(JSON.stringify(colours))
        return colours
    }
    return attempt(upload(colourPath, colours))
}

export const getAndUploadImage = async (
    issue: string,
    image: Image,
    size: ImageSize,
) => {
    const [path, data] = await getImage(issue, image, size)
    return upload(path, data)
}
