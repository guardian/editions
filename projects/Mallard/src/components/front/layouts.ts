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
    ...[top, left, width, height]: [number, number, number, number]
): ItemFit => ({
    top,
    left,
    width,
    height,
})

const splashPage: PageLayout = {
    size: PageLayoutSizes.mobile,
    items: [
        {
            item: SplashImageItem,
            fits: toFit(0, 0, 2, 6),
        },
    ],
}

const superHeroPage: PageLayout = {
    size: PageLayoutSizes.mobile,
    items: [
        {
            item: SuperHeroImageItem,
            fits: toFit(0, 0, 2, 6),
        },
    ],
}

const twoStoryPage: PageLayout = {
    size: PageLayoutSizes.mobile,
    items: [
        {
            item: ImageItem,
            fits: toFit(0, 0, 2, 4),
        },
        {
            item: SplitImageItem,
            fits: toFit(4, 0, 2, 2),
        },
    ],
}

const threeStoryPage: PageLayout = {
    size: PageLayoutSizes.mobile,
    items: [
        {
            item: ImageItem,
            fits: toFit(0, 0, 2, 4),
        },
        {
            item: SmallItem,
            fits: toFit(4, 0, 1, 2),
        },
        {
            item: SmallItem,
            fits: toFit(4, 1, 1, 2),
        },
    ],
}

const fourStoryPage: PageLayout = {
    size: PageLayoutSizes.mobile,
    items: [
        {
            item: ImageItem,
            fits: toFit(0, 0, 1, 3),
        },
        {
            item: ImageItem,
            fits: toFit(0, 1, 1, 3),
        },
        {
            item: ImageItem,
            fits: toFit(3, 0, 1, 3),
        },
        {
            item: ImageItem,
            fits: toFit(3, 1, 1, 3),
        },
    ],
}

const fiveStoryPage: PageLayout = {
    size: PageLayoutSizes.mobile,
    items: [
        {
            item: ImageItem,
            fits: toFit(0, 0, 1, 3),
        },
        {
            item: ImageItem,
            fits: toFit(0, 1, 1, 3),
        },
        {
            item: SmallItem,
            fits: toFit(3, 0, 2, 1),
        },
        {
            item: SmallItem,
            fits: toFit(4, 0, 2, 1),
        },
        {
            item: SmallItem,
            fits: toFit(5, 0, 2, 1),
        },
    ],
}

const sixStoryPage: PageLayout = {
    size: PageLayoutSizes.mobile,
    items: [
        {
            item: SmallItem,
            fits: toFit(0, 0, 2, 1),
        },
        {
            item: SmallItem,
            fits: toFit(1, 0, 2, 1),
        },
        {
            item: SmallItem,
            fits: toFit(2, 0, 2, 1),
        },
        {
            item: SmallItem,
            fits: toFit(3, 0, 2, 1),
        },
        {
            item: SmallItem,
            fits: toFit(4, 0, 2, 1),
        },
        {
            item: SmallItem,
            fits: toFit(5, 0, 2, 1),
        },
    ],
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
