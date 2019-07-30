import { PageLayout, RowSize, withSlots } from './helpers'
import {
    SplashImageItem,
    SuperHeroImageItem,
    ImageItem,
    SplitImageItem,
    SmallItem,
} from './item/item'
import { CollectionCardAppearance } from 'src/common'

const splashPage: PageLayout = withSlots([
    {
        size: RowSize.superhero,
        columns: [SplashImageItem],
    },
])

const superHeroPage: PageLayout = withSlots([
    {
        size: RowSize.superhero,
        columns: [SuperHeroImageItem],
    },
])

const twoStoryPage: PageLayout = withSlots([
    {
        size: RowSize.hero,
        columns: [ImageItem],
    },
    {
        size: RowSize.third,
        columns: [SplitImageItem],
    },
])

const threeStoryPage: PageLayout = withSlots([
    {
        size: RowSize.hero,
        columns: [ImageItem],
    },
    {
        size: RowSize.third,
        columns: [SmallItem, SmallItem],
    },
])

const fourStoryPage: PageLayout = withSlots([
    {
        size: RowSize.half,
        columns: [ImageItem, ImageItem],
    },
    {
        size: RowSize.half,
        columns: [ImageItem, ImageItem],
    },
])

const fiveStoryPage: PageLayout = withSlots([
    {
        size: RowSize.half,
        columns: [ImageItem, ImageItem],
    },
    {
        size: RowSize.row,
        columns: [SmallItem],
    },
    {
        size: RowSize.row,
        columns: [SmallItem],
    },
    {
        size: RowSize.row,
        columns: [SmallItem],
    },
])

const sixStoryPage: PageLayout = withSlots([
    {
        size: RowSize.row,
        columns: [SmallItem],
    },
    {
        size: RowSize.row,
        columns: [SmallItem],
    },
    {
        size: RowSize.row,
        columns: [SmallItem],
    },
    {
        size: RowSize.row,
        columns: [SmallItem],
    },
    {
        size: RowSize.row,
        columns: [SmallItem],
    },
    {
        size: RowSize.row,
        columns: [SmallItem],
    },
])

const layouts: { [key in CollectionCardAppearance]: PageLayout } = {
    [CollectionCardAppearance.splashPage]: splashPage,
    [CollectionCardAppearance.superHeroPage]: superHeroPage,
    [CollectionCardAppearance.twoStoryPage]: twoStoryPage,
    [CollectionCardAppearance.threeStoryPage]: threeStoryPage,
    [CollectionCardAppearance.fourStoryPage]: fourStoryPage,
    [CollectionCardAppearance.fiveStoryPage]: fiveStoryPage,
    [CollectionCardAppearance.sixStoryPage]: sixStoryPage,
}

export { layouts }
