import { IBlockElement, ElementType } from '@guardian/capi-ts'
import { BlockElement } from '../common'
import { extractImage } from './assets'

export const elementParser: (
    element: IBlockElement,
) => BlockElement = element => {
    switch (element.type) {
        case ElementType.TEXT:
            if (element.textTypeData && element.textTypeData.html) {
                return {
                    id: 'html',
                    html: element.textTypeData.html,
                }
            }
        case ElementType.IMAGE:
            const image = extractImage(element.assets)
            if (element.imageTypeData && image.file) {
                return {
                    id: 'image',
                    src: image.file, //This needs to be resized!!!
                    alt: element.imageTypeData.alt,
                    caption: element.imageTypeData.caption,
                    copyright: element.imageTypeData.copyright,
                }
            }
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
        case ElementType.PULLQUOTE:
            if (
                element.pullquoteTypeData &&
                element.pullquoteTypeData.attribution &&
                element.pullquoteTypeData.html
            ) {
                return {
                    id: 'pullquote',
                    html: element.pullquoteTypeData.html,
                    role: element.pullquoteTypeData.role,
                }
            }
    }
    return { id: 'unknown' }
}
