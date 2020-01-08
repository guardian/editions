import { getPageLayoutSizeXY } from '../../helpers/helpers'
import { PageLayoutSizes, ItemSizes } from '../../../../common'

export const getImageHeight = ({ story, layout }: ItemSizes) => {
    if (layout === PageLayoutSizes.tablet) {
        if (story.height >= 4) {
            return '50%'
        }
        if (story.height >= 3) {
            return '66.66%'
        }
        if (story.height >= 2) {
            return '50%'
        }
        return '75.5%'
    }
    if (layout === PageLayoutSizes.mobile) {
        if (story.height >= 4) {
            return '75.5%'
        }
        return '50%'
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
