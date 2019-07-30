export enum CollectionCardAppearance {
    splashPage = 'splash',
    superHeroPage = 'super',
    twoStoryPage = 'two',
    threeStoryPage = 'three',
    fourStoryPage = 'four',
    fiveStoryPage = 'five',
    sixStoryPage = 'six',
}

export type CollectionCardLayout = (number | CollectionCardAppearance)[]

export interface CollectionCardLayouts {
    [countOfArticles: number]: CollectionCardLayout
}
export interface CollectionCardLayoutsForFront {
    default: CollectionCardLayouts
    [frontName: string]: CollectionCardLayouts
}
interface CollectionCardAppearanceInfo {
    fits: 1 | 2 | 3 | 4 | 5 | 6
}
export const collectionCardAppearanceInfo: {
    [key in CollectionCardAppearance]: CollectionCardAppearanceInfo
} = {
    splash: { fits: 1 },
    super: { fits: 1 },
    two: { fits: 1 },
    three: { fits: 1 },
    four: { fits: 1 },
    five: { fits: 1 },
    six: { fits: 1 },
}

export const defaultAppearances: {
    [key in 1 | 2 | 3 | 4 | 5 | 6]: CollectionCardAppearance
} = {
    1: CollectionCardAppearance.superHeroPage,
    2: CollectionCardAppearance.twoStoryPage,
    3: CollectionCardAppearance.threeStoryPage,
    4: CollectionCardAppearance.fourStoryPage,
    5: CollectionCardAppearance.fiveStoryPage,
    6: CollectionCardAppearance.sixStoryPage,
}

export const cardLayouts: CollectionCardLayoutsForFront = {
    Crosswords: {
        0: [],
        1: [2],
    },
    default: {
        0: [],
        1: [CollectionCardAppearance.splashPage],
        2: [1, 1],
        3: [1, 2],
        4: [1, 3],
        5: [1, 4],
        6: [1, 5],
        7: [1, 2, 4],
        8: [1, 3, 4],
        9: [1, 3, 5],
        10: [1, 4, 5],
        11: [1, 2, 3, 5],
        12: [1, 2, 4, 5],
        13: [1, 3, 4, 5],
        14: [1, 3, 4, 6],
        15: [1, 2, 3, 4, 5],
        16: [1, 2, 3, 4, 6],
        17: [1, 2, 3, 5, 6],
        18: [1, 2, 4, 5, 6],
        19: [1, 3, 4, 5, 6],
        20: [1, 3, 4, 1, 5, 6],
        21: [1, 2, 3, 4, 5, 6],
        22: [1, 3, 4, 3, 5, 6],
        23: [1, 3, 4, 5, 4, 6],
        24: [1, 3, 5, 4, 5, 6],
        25: [1, 5, 4, 5, 4, 6],
    },
}
