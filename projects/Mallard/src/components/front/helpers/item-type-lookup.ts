import { Item } from './helpers'
import {
    SplashImageItem,
    SuperHeroImageItem,
    ImageItem,
    SplitImageItem,
    SmallItem,
    SmallItemLargeText,
    SidekickImageItem,
} from '../items/items'
import { ItemType } from 'src/common'
import { StarterItem } from '../items/image-items'

const itemTypeLookup: { [key in ItemType]: Item } = {
    [ItemType.SplashImageItemType]: SplashImageItem,
    [ItemType.SuperHeroImageItemType]: SuperHeroImageItem,
    [ItemType.ImageItemType]: ImageItem,
    [ItemType.SmallItemType]: SmallItem,
    [ItemType.StarterItemType]: StarterItem,
    [ItemType.SplitImageItemType]: SplitImageItem,
    [ItemType.SidekickImageItemType]: SidekickImageItem,
    [ItemType.SmallItemLargeTextType]: SmallItemLargeText,
}

export { itemTypeLookup }
