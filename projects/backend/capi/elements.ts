import { IBlockElement, ElementType } from '@guardian/capi-ts'
import { BlockElement } from '../common'

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
    }
    return { id: 'unknown' }
}
