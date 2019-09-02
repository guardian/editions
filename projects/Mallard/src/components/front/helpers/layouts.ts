import { PageLayout, PageLayoutSizes } from './helpers'
import {
    SplashImageItem,
    SuperHeroImageItem,
    ImageItem,
    SplitImageItem,
    SmallItem,
    SmallItemLargeText,
    SidekickImageItem,
} from '../items/items'
import { FrontCardAppearance } from 'src/common'
import { toRectangle } from 'src/helpers/sizes'

const splashPage: PageLayout = {
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: SplashImageItem,
                fits: toRectangle(0, 0, 6, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: SplashImageItem,
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
                item: SuperHeroImageItem,
                fits: toRectangle(0, 0, 6, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: SuperHeroImageItem,
                fits: toRectangle(0, 0, 4, 3),
            },
        ],
    },
}

const twoStoryPage = (KeyItem = ImageItem): PageLayout => ({
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: KeyItem,
                fits: toRectangle(0, 0, 4, 2),
            },
            {
                item: SplitImageItem,
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
                item: SplitImageItem,
                fits: toRectangle(0, 3, 1, 3),
            },
        ],
    },
})

const threeStoryPage = (KeyItem = ImageItem): PageLayout => ({
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: KeyItem,
                fits: toRectangle(0, 0, 4, 2),
            },
            {
                item: SmallItem,
                fits: toRectangle(0, 4, 2, 1),
            },
            {
                item: SmallItem,
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
                item: ImageItem,
                fits: toRectangle(2, 0, 2, 1),
            },
            {
                item: ImageItem,
                fits: toRectangle(2, 2, 2, 1),
            },
        ],
    },
})

const threeStoryPageBigPhoto = (KeyItem = ImageItem): PageLayout => ({
    ...threeStoryPage(KeyItem),
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: KeyItem,
                fits: toRectangle(0, 0, 3, 3),
            },
            {
                item: SmallItem,
                fits: toRectangle(0, 3, 1, 1),
            },
            {
                item: SplitImageItem,
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
                item: ImageItem,
                fits: toRectangle(0, 0, 3, 1),
            },
            {
                item: ImageItem,
                fits: toRectangle(1, 0, 3, 1),
            },
            {
                item: ImageItem,
                fits: toRectangle(0, 3, 3, 1),
            },
            {
                item: ImageItem,
                fits: toRectangle(1, 3, 3, 1),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: ImageItem,
                fits: toRectangle(0, 0, 3, 2),
            },
            {
                item: SplitImageItem,
                fits: toRectangle(0, 3, 1, 2),
            },
            {
                item: ImageItem,
                fits: toRectangle(2, 0, 2, 1),
            },
            {
                item: ImageItem,
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
                item: ImageItem,
                fits: toRectangle(0, 0, 3, 1),
            },
            {
                item: ImageItem,
                fits: toRectangle(1, 0, 3, 1),
            },
            {
                item: SmallItem,
                fits: toRectangle(0, 3, 1, 2),
            },
            {
                item: SmallItem,
                fits: toRectangle(0, 4, 1, 2),
            },
            {
                item: SmallItem,
                fits: toRectangle(0, 5, 1, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: ImageItem,
                fits: toRectangle(0, 0, 3, 2),
            },
            {
                item: ImageItem,
                fits: toRectangle(2, 0, 2, 1),
            },
            {
                item: ImageItem,
                fits: toRectangle(2, 2, 2, 1),
            },
            {
                item: SmallItem,
                fits: toRectangle(0, 3, 1, 1),
            },
            {
                item: SmallItem,
                fits: toRectangle(1, 3, 1, 1),
            },
        ],
    },
}

const sixStoryPage: PageLayout = {
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: SmallItem,
                fits: toRectangle(0, 0, 1, 2),
            },
            {
                item: SmallItem,
                fits: toRectangle(0, 1, 1, 2),
            },
            {
                item: SmallItem,
                fits: toRectangle(0, 2, 1, 2),
            },
            {
                item: SmallItem,
                fits: toRectangle(0, 3, 1, 2),
            },
            {
                item: SmallItem,
                fits: toRectangle(0, 4, 1, 2),
            },
            {
                item: SmallItem,
                fits: toRectangle(0, 5, 1, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: SmallItemLargeText,
                fits: toRectangle(0, 0, 1, 2),
            },
            {
                item: SmallItemLargeText,
                fits: toRectangle(0, 1, 1, 2),
            },
            {
                item: ImageItem,
                fits: toRectangle(2, 0, 2, 1),
            },
            {
                item: ImageItem,
                fits: toRectangle(2, 2, 2, 1),
            },
            {
                item: ImageItem,
                fits: toRectangle(0, 2, 2, 1),
            },
            {
                item: ImageItem,
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
        SidekickImageItem,
    ),
    [FrontCardAppearance.threeStoryPage]: threeStoryPage(),
    [FrontCardAppearance.threeStoryPageWithSidekick]: threeStoryPageBigPhoto(
        SidekickImageItem,
    ),
    [FrontCardAppearance.fourStoryPage]: fourStoryPage,
    [FrontCardAppearance.fiveStoryPage]: fiveStoryPage,
    [FrontCardAppearance.sixStoryPage]: sixStoryPage,
}

export { layouts }
