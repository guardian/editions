import { Rectangle } from '../helpers/sizes'

export enum ItemType {
    SplashImageItemType,
    SuperHeroImageItemType,
    ImageItemType,
    SmallItemType,
    SplitImageItemType,
    SidekickImageItemType,
    SmallItemLargeTextType,
}
export interface ItemSizes {
    story: Rectangle
    layout: PageLayoutSizes
}
export enum PageLayoutSizes {
    mobile,
    tablet,
}
export type PageLayout = {
    [key in PageLayoutSizes]: {
        size: key
        items: {
            item: ItemType
            fits: Rectangle
        }[]
    }
}
