import { PageLayout, RowSize, withSlots } from './helpers'
import {
    SplashImageItem,
    SuperHeroImageItem,
    ImageItem,
    SplitImageItem,
    SmallItem,
} from './item/item'
import { FrontCardAppearance } from 'src/common'

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

const layouts: { [key in FrontCardAppearance]: PageLayout } = {
    [FrontCardAppearance.splashPage]: splashPage,
    [FrontCardAppearance.superHeroPage]: superHeroPage,
    [FrontCardAppearance.twoStoryPage]: twoStoryPage,
    [FrontCardAppearance.threeStoryPage]: threeStoryPage,
    [FrontCardAppearance.fourStoryPage]: fourStoryPage,
    [FrontCardAppearance.fiveStoryPage]: fiveStoryPage,
    [FrontCardAppearance.sixStoryPage]: sixStoryPage,
}

export { layouts }
