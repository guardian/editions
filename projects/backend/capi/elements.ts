import { IBlockElement, ElementType } from '@guardian/capi-ts'
import { BlockElement } from '../common'
import { getImage } from './assets'
import { renderAtomElement } from './atoms'
import { cleanupHtml } from '../utils/html'
import { IAtom } from '@guardian/capi-ts/dist/com/gu/contentatom/thrift/Atom'

export const elementParser = (
    id: string,
    atoms: { [key: string]: IAtom[] },
) => async (element: IBlockElement): Promise<BlockElement> => {
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
            const image = getImage(element.assets)
            if (element.imageTypeData && image) {
                return {
                    id: 'image',
                    src: image,
                    alt: element.imageTypeData.alt,
                    caption:
                        element.imageTypeData.caption &&
                        cleanupHtml(element.imageTypeData.caption),
                    copyright: element.imageTypeData.copyright,
                    credit: element.imageTypeData.credit,
                    role: element.imageTypeData.role,
                }
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
            if (element.pullquoteTypeData && element.pullquoteTypeData.html) {
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
