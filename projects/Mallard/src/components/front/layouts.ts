import { PageLayout, RowSize, withSlots } from './helpers'
import { SuperHeroImageItem, ImageItem, SmallItem } from './item/item'

const superHeroPage: PageLayout = withSlots([
    {
        size: RowSize.superhero,
        columns: [SuperHeroImageItem],
    },
])

const TODO_twoStoryPage: PageLayout = withSlots([
    {
        size: RowSize.half,
        columns: [ImageItem],
    },
    {
        size: RowSize.half,
        columns: [ImageItem],
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

export {
    superHeroPage,
    TODO_twoStoryPage,
    threeStoryPage,
    fourStoryPage,
    fiveStoryPage,
    sixStoryPage,
}
