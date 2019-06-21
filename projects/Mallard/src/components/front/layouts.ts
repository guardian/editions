import { PageLayout, RowSize, withSlots } from './helpers'
import { SuperHeroImageItem, ImageItem, SmallItem } from './item/item'

const superHeroPage: PageLayout = withSlots([
    {
        size: RowSize.superhero,
        columns: [SuperHeroImageItem],
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

export { superHeroPage, threeStoryPage, fiveStoryPage }
