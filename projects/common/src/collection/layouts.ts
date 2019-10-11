import { PageLayout, PageLayoutSizes, ItemType } from './layout-model'
import { toRectangle } from '../helpers/sizes'
import { FrontCardAppearance } from './card-layouts'

const splashPage: PageLayout = {
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: ItemType.SplashImageItemType,
                fits: toRectangle(0, 0, 6, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: ItemType.SplashImageItemType,
                fits: toRectangle(0, 0, 4, 3),
            },
        ],
    },
}

const superHeroPage: PageLayout = {
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: ItemType.SuperHeroImageItemType,
                fits: toRectangle(0, 0, 6, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: ItemType.SuperHeroImageItemType,
                fits: toRectangle(0, 0, 4, 3),
            },
        ],
    },
}

const twoStoryPage = (KeyItem = ItemType.ImageItemType): PageLayout => ({
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: KeyItem,
                fits: toRectangle(0, 0, 4, 2),
            },
            {
                item: ItemType.SplitImageItemType,
                fits: toRectangle(0, 4, 2, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: KeyItem,
                fits: toRectangle(0, 0, 3, 3),
            },
            {
                item: ItemType.SplitImageItemType,
                fits: toRectangle(0, 3, 1, 3),
            },
        ],
    },
})

const threeStoryPage = (KeyItem = ItemType.ImageItemType): PageLayout => ({
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: KeyItem,
                fits: toRectangle(0, 0, 4, 2),
            },
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(0, 4, 2, 1),
            },
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(1, 4, 2, 1),
            },
        ],
    },

    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: KeyItem,
                fits: toRectangle(0, 0, 4, 2),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(2, 0, 2, 1),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(2, 2, 2, 1),
            },
        ],
    },
})

const threeStoryPageBigPhoto = (
    KeyItem = ItemType.ImageItemType,
): PageLayout => ({
    ...threeStoryPage(KeyItem),
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: KeyItem,
                fits: toRectangle(0, 0, 3, 3),
            },
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(0, 3, 1, 1),
            },
            {
                item: ItemType.SplitImageItemType,
                fits: toRectangle(1, 3, 1, 2),
            },
        ],
    },
})

const fourStoryPage: PageLayout = {
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(0, 0, 3, 1),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(1, 0, 3, 1),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(0, 3, 3, 1),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(1, 3, 3, 1),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(0, 0, 3, 2),
            },
            {
                item: ItemType.SplitImageItemType,
                fits: toRectangle(0, 3, 1, 2),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(2, 0, 2, 1),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(2, 2, 2, 1),
            },
        ],
    },
}

const fiveStoryPage: PageLayout = {
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(0, 0, 3, 1),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(1, 0, 3, 1),
            },
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(0, 3, 1, 2),
            },
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(0, 4, 1, 2),
            },
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(0, 5, 1, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(0, 0, 3, 2),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(2, 0, 2, 1),
            },
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(0, 3, 1, 1),
            },
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(1, 3, 1, 1),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(2, 2, 2, 1),
            },
        ],
    },
}

const sixStoryPage: PageLayout = {
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(0, 0, 1, 2),
            },
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(0, 1, 1, 2),
            },
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(0, 2, 1, 2),
            },
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(0, 3, 1, 2),
            },
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(0, 4, 1, 2),
            },
            {
                item: ItemType.SmallItemType,
                fits: toRectangle(0, 5, 1, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: ItemType.SmallItemLargeTextType,
                fits: toRectangle(0, 0, 1, 2),
            },
            {
                item: ItemType.SmallItemLargeTextType,
                fits: toRectangle(0, 1, 1, 2),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(2, 0, 2, 1),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(2, 2, 2, 1),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(0, 2, 2, 1),
            },
            {
                item: ItemType.ImageItemType,
                fits: toRectangle(1, 2, 2, 1),
            },
        ],
    },
}

const layouts: { [key in FrontCardAppearance]: PageLayout } = {
    [FrontCardAppearance.splashPage]: splashPage,
    [FrontCardAppearance.superHeroPage]: superHeroPage,
    [FrontCardAppearance.twoStoryPage]: twoStoryPage(),
    [FrontCardAppearance.twoStoryPageWithSidekick]: twoStoryPage(
        ItemType.SidekickImageItemType,
    ),
    [FrontCardAppearance.threeStoryPage]: threeStoryPage(),
    [FrontCardAppearance.threeStoryPageWithSidekick]: threeStoryPageBigPhoto(
        ItemType.SidekickImageItemType,
    ),
    [FrontCardAppearance.fourStoryPage]: fourStoryPage,
    [FrontCardAppearance.fiveStoryPage]: fiveStoryPage,
    [FrontCardAppearance.sixStoryPage]: sixStoryPage,
}

export { layouts }
