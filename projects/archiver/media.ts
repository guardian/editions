import { Front, ImageElement, CAPIArticle, Image } from './common'
import { unnest } from 'ramda'
import { getImage, getColours } from './downloader'
import { hasFailed, attempt } from '../backend/utils/try'
import { upload } from './upload'
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
    return unnest(articles.map(getImagesFromArticle))
}

export const uploadImage = async (id: string, image: Image) => {
    const allSizes = await getImage(id, image)

    const [colourPath, colours] = await getColours(id, image)
    if (hasFailed(colours)) {
        console.error(`Could not get colours for ${colourPath}`)
        console.error(JSON.stringify(colours))
        return colours
    }
    const colourUpload = attempt(upload('data', colourPath, colours))

    return Promise.all([
        ...allSizes.map(([path, file]) => {
            if (hasFailed(file)) {
                console.error(`Could not fetch ${path}`)
                console.log(JSON.stringify(file))
                return file
            }

            return attempt(upload('media', path, file))
        }),
        colourUpload,
    ])
}
