import { PageLayout, PageLayoutSizes, ItemFit } from './helpers'
import {
    SplashImageItem,
    SuperHeroImageItem,
    ImageItem,
    SplitImageItem,
    SmallItem,
} from './item/item'
import { FrontCardAppearance } from 'src/common'

const toFit = (
    ...[left, top, height, width]: [number, number, number, number]
): ItemFit => ({
    top,
    left,
    width,
    height,
})

const splashPage: PageLayout = {
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: SplashImageItem,
                fits: toFit(0, 0, 6, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: SplashImageItem,
                fits: toFit(0, 0, 4, 3),
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
                fits: toFit(0, 0, 6, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: SuperHeroImageItem,
                fits: toFit(0, 0, 4, 3),
            },
        ],
    },
}

const twoStoryPage: PageLayout = {
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: ImageItem,
                fits: toFit(0, 0, 4, 2),
            },
            {
                item: SplitImageItem,
                fits: toFit(0, 4, 2, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: ImageItem,
                fits: toFit(0, 0, 3, 4),
            },
            {
                item: SplitImageItem,
                fits: toFit(0, 3, 1, 3),
            },
        ],
    },
}

const threeStoryPage: PageLayout = {
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: ImageItem,
                fits: toFit(0, 0, 4, 2),
            },
            {
                item: SmallItem,
                fits: toFit(0, 4, 2, 1),
            },
            {
                item: SmallItem,
                fits: toFit(1, 4, 2, 1),
            },
        ],
    },

    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: ImageItem,
                fits: toFit(0, 0, 4, 2),
            },
            {
                item: ImageItem,
                fits: toFit(2, 0, 2, 1),
            },
            {
                item: ImageItem,
                fits: toFit(2, 2, 2, 1),
            },
        ],
    },
}

const fourStoryPage: PageLayout = {
    [PageLayoutSizes.mobile]: {
        size: PageLayoutSizes.mobile,
        items: [
            {
                item: ImageItem,
                fits: toFit(0, 0, 3, 1),
            },
            {
                item: ImageItem,
                fits: toFit(1, 0, 3, 1),
            },
            {
                item: ImageItem,
                fits: toFit(0, 3, 3, 1),
            },
            {
                item: ImageItem,
                fits: toFit(1, 3, 3, 1),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: ImageItem,
                fits: toFit(1, 0, 3, 2),
            },
            {
                item: SplitImageItem,
                fits: toFit(1, 3, 1, 2),
            },
            {
                item: ImageItem,
                fits: toFit(0, 0, 2, 1),
            },
            {
                item: ImageItem,
                fits: toFit(0, 2, 2, 1),
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
                fits: toFit(0, 0, 3, 1),
            },
            {
                item: ImageItem,
                fits: toFit(1, 0, 3, 1),
            },
            {
                item: SmallItem,
                fits: toFit(0, 3, 1, 2),
            },
            {
                item: SmallItem,
                fits: toFit(0, 4, 1, 2),
            },
            {
                item: SmallItem,
                fits: toFit(0, 5, 1, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: ImageItem,
                fits: toFit(0, 0, 3, 2),
            },
            {
                item: ImageItem,
                fits: toFit(2, 0, 2, 1),
            },
            {
                item: ImageItem,
                fits: toFit(2, 2, 2, 1),
            },
            {
                item: SmallItem,
                fits: toFit(0, 3, 1, 1),
            },
            {
                item: SmallItem,
                fits: toFit(1, 3, 1, 1),
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
                fits: toFit(0, 0, 1, 2),
            },
            {
                item: SmallItem,
                fits: toFit(0, 1, 1, 2),
            },
            {
                item: SmallItem,
                fits: toFit(0, 2, 1, 2),
            },
            {
                item: SmallItem,
                fits: toFit(0, 3, 1, 2),
            },
            {
                item: SmallItem,
                fits: toFit(0, 4, 1, 2),
            },
            {
                item: SmallItem,
                fits: toFit(0, 5, 1, 2),
            },
        ],
    },
    [PageLayoutSizes.tablet]: {
        size: PageLayoutSizes.tablet,
        items: [
            {
                item: SmallItem,
                fits: toFit(0, 0, 1, 2),
            },
            {
                item: SmallItem,
                fits: toFit(0, 1, 1, 2),
            },
            {
                item: ImageItem,
                fits: toFit(2, 0, 2, 1),
            },
            {
                item: ImageItem,
                fits: toFit(2, 2, 2, 1),
            },
            {
                item: ImageItem,
                fits: toFit(0, 2, 2, 1),
            },
            {
                item: ImageItem,
                fits: toFit(1, 2, 2, 1),
            },
        ],
    },
}

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
