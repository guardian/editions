import { getPageLayoutSizeXY } from '../../helpers/helpers'
import { PageLayoutSizes, ItemSizes } from '../../../../common'

/**
 * "starter" cards use a bigger font, so we need to reduce the size taken by
 * the image a little bit in all cases.
 */
export const getImageHeight = (
    { story, layout }: ItemSizes,
    type: 'starter' | 'default' = 'default',
) => {
    const isDefault = type === 'default'
    if (layout === PageLayoutSizes.tablet) {
        if (story.height >= 4) {
            return isDefault ? '50%' : '40%'
        }
        if (story.height >= 3) {
            return isDefault ? '66.66%' : '60%'
        }
        if (story.height >= 2) {
            return isDefault ? '50%' : '40%'
        }
        return isDefault ? '75.5%' : '60%'
    }
    if (layout === PageLayoutSizes.mobile) {
        if (story.height >= 4) {
            return isDefault ? '75.5%' : '60%'
        }
        return isDefault ? '50%' : '40%'
    }
}

export const isSmallItem = (size: ItemSizes) => {
    return size.story.width <= 1
}

export const isFullHeightItem = (size: ItemSizes) => {
    const { height: pageHeight } = getPageLayoutSizeXY(size.layout)
    return size.story.height >= pageHeight
}
export const isFullWidthItem = (size: ItemSizes) => {
    const { width } = getPageLayoutSizeXY(size.layout)
    return size.story.width >= width
}
