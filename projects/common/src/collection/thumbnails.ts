import { ItemType, ImageUse } from '..'
import { Size } from '../helpers/sizes'
import { PageLayoutSizes } from './layout-model'

export const getImageUse = (
    itemType: ItemType,
    cardSize: Size,
    layoutSize: PageLayoutSizes,
): ImageUse => {
    switch (itemType) {
        case ItemType.SplashImageItemType:
        case ItemType.SuperHeroImageItemType:
        case ItemType.SidekickImageItemType:
            return 'full-size'
        case ItemType.SmallItemType:
        case ItemType.SmallItemLargeTextType:
            return 'not-used'
        case ItemType.SplitImageItemType:
            return 'thumb'
        case ItemType.StarterItemType:

        case ItemType.ImageItemType:
            if (cardSize.width === 1) {
                return 'thumb'
            }
            if (layoutSize === PageLayoutSizes.tablet && cardSize.width === 2) {
                return 'thumb-large'
            }
            return 'full-size'
    }
}
