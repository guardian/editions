import { IBlockElement, ElementType } from '@guardian/capi-ts'
import { BlockElement } from '../common'
import { getImage } from './assets'
import { renderAtom } from './atoms'
import { attempt, hasFailed } from '../utils/try'
import { cleanupHtml } from '../utils/html'

export const elementParser = (id: string) => async (
    element: IBlockElement,
): Promise<BlockElement> => {
    switch (element.type) {
        case ElementType.TEXT:
            if (element.textTypeData && element.textTypeData.html) {
                return {
                    id: 'html',
                    html: element.textTypeData.html,
                }
            }
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
        case ElementType.CONTENTATOM:
            if (
                element.contentAtomTypeData &&
                element.contentAtomTypeData.atomId &&
                element.contentAtomTypeData.atomType
            ) {
                const rendered = await attempt(
                    renderAtom(
                        element.contentAtomTypeData.atomType,
                        element.contentAtomTypeData.atomId,
                    ),
                )
                if (hasFailed(rendered)) {
                    console.warn(
                        `${element.contentAtomTypeData.atomType} atom ${element.contentAtomTypeData.atomId} removed in ${id}!`,
                    )
                    return { id: 'unknown' }
                }
                return {
                    id: '⚛︎',
                    atomType: element.contentAtomTypeData.atomType,
                    ...rendered,
                }
            }
    }
    return { id: 'unknown' }
}
