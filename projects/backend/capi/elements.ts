import { BlockElement } from '@guardian/content-api-models/v1/blockElement'
import { ElementType } from '@guardian/content-api-models/v1/elementType'
import { Atom } from '@guardian/content-atom-model/atom'
import { BlockElement as EditionsBlockElement } from '../common'
import { getImage } from './assets'
import { renderAtomElement } from './atoms'

const parseImageElement = (
    element: BlockElement,
): EditionsBlockElement | undefined => {
    const image = getImage(element.assets)
    if (element.imageTypeData && image) {
        return {
            id: 'image',
            src: image,
            alt: element.imageTypeData.alt,
            caption: element.imageTypeData.caption,
            copyright: element.imageTypeData.copyright,
            credit: element.imageTypeData.credit,
            displayCredit: element.imageTypeData.displayCredit,
            role: element.imageTypeData.role,
        }
    }
}

const elementParser =
    (id: string, atoms: { [key: string]: Atom[] }) =>
    async (element: BlockElement): Promise<EditionsBlockElement> => {
        switch (element.type) {
            case ElementType.TEXT:
                if (element.textTypeData && element.textTypeData.html) {
                    return {
                        id: 'html',
                        html: element.textTypeData.html,
                    }
                }
                console.warn(`Text element missing element data.`)
                break

            case ElementType.IMAGE:
                const parsedImageElement = parseImageElement(element)
                if (parsedImageElement) {
                    return parsedImageElement
                }
                console.warn(`Image element missing element data.`)
                break

            case ElementType.TWEET:
                if (
                    element.tweetTypeData &&
                    element.tweetTypeData.html &&
                    element.tweetTypeData.url
                ) {
                    return {
                        id: 'tweet',
                        html: element.tweetTypeData.html,
                        url: element.tweetTypeData.url,
                    }
                }
                console.warn(`Tweet element missing element data.`)
                break
            case ElementType.PULLQUOTE:
                if (
                    element.pullquoteTypeData &&
                    element.pullquoteTypeData.html
                ) {
                    return {
                        id: 'pullquote',
                        html: element.pullquoteTypeData.html,
                        role: element.pullquoteTypeData.role,
                        attribution: element.pullquoteTypeData.attribution,
                    }
                }
                console.warn(`Pullquote element missing element data.`)
                break
            case ElementType.CONTENTATOM:
                return renderAtomElement(element.contentAtomTypeData, atoms)
        }
        console.warn(`Failed to render element ${JSON.stringify(element)}`)
        return { id: 'unknown' }
    }

export { parseImageElement, elementParser }
