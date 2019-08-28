import { CAPIArticle } from '../index'

type PossibleCardlengths = 1 | 2 | 3 | 4 | 5 | 6

export enum FrontCardAppearance {
    splashPage = 'splash',
    superHeroPage = 'super',
    twoStoryPage = 'two',
    visualTwoStoryPage = 'two-visual',
    threeStoryPage = 'three',
    visualThreeStoryPage = 'three-visual',
    fourStoryPage = 'four',
    fiveStoryPage = 'five',
    sixStoryPage = 'six',
}

export type FrontCardAppearanceShort = PossibleCardlengths | FrontCardAppearance

export type FrontCardList = FrontCardAppearanceShort[]

export interface FrontCardsForArticleCount {
    [countOfArticles: number]: FrontCardList
}
export interface FrontCardAppearanceInfo {
    fits: PossibleCardlengths
}

const frontCardAppearanceInfo: {
    [key in FrontCardAppearance]: FrontCardAppearanceInfo
} = {
    [FrontCardAppearance.splashPage]: { fits: 1 },
    [FrontCardAppearance.superHeroPage]: { fits: 1 },
    [FrontCardAppearance.twoStoryPage]: { fits: 2 },
    [FrontCardAppearance.visualTwoStoryPage]: { fits: 2 },
    [FrontCardAppearance.threeStoryPage]: { fits: 3 },
    [FrontCardAppearance.visualThreeStoryPage]: { fits: 3 },
    [FrontCardAppearance.fourStoryPage]: { fits: 4 },
    [FrontCardAppearance.fiveStoryPage]: { fits: 5 },
    [FrontCardAppearance.sixStoryPage]: { fits: 6 },
}

export const defaultCardAppearances: {
    [key in PossibleCardlengths]: FrontCardAppearance
} = {
    1: FrontCardAppearance.superHeroPage,
    2: FrontCardAppearance.twoStoryPage,
    3: FrontCardAppearance.threeStoryPage,
    4: FrontCardAppearance.fourStoryPage,
    5: FrontCardAppearance.fiveStoryPage,
    6: FrontCardAppearance.sixStoryPage,
}

export const getCardAppearanceInfoAndOverrides = (
    card: FrontCardAppearanceShort,
    articles: CAPIArticle[],
): FrontCardAppearanceInfo & { appearance: FrontCardAppearance } => {
    if (typeof card === 'number') {
        return {
            appearance: defaultCardAppearances[card],
            ...frontCardAppearanceInfo[defaultCardAppearances[card]],
        }
    }
    if (card === FrontCardAppearance.splashPage) {
        //TODO: implement correct logic using data from fronts
        if (articles[0].byline === 'Ben Longden') {
            card = FrontCardAppearance.superHeroPage
        }
    }
    return {
        appearance: card,
        ...frontCardAppearanceInfo[card],
    }
}

const defaultLayout = (
    cover: FrontCardAppearanceShort = 1,
    visual = false,
): FrontCardsForArticleCount => {
    const [twoStories, threeStories] = visual
        ? [2 as FrontCardAppearanceShort, 3 as FrontCardAppearanceShort]
        : [
              FrontCardAppearance.visualTwoStoryPage,
              FrontCardAppearance.visualThreeStoryPage,
          ]

    return {
        0: [],
        1: [cover],
        2: [cover, 1],
        3: [cover, twoStories],
        4: [cover, threeStories],
        5: [cover, 4],
        6: [cover, 5],
        7: [cover, twoStories, 4],
        8: [cover, threeStories, 4],
        9: [cover, threeStories, 5],
        10: [cover, 4, 5],
        11: [cover, twoStories, 3, 5],
        12: [cover, twoStories, 4, 5],
        13: [cover, threeStories, 4, 5],
        14: [cover, threeStories, 4, 6],
        15: [cover, twoStories, 3, 4, 5],
        16: [cover, twoStories, 3, 4, 6],
        17: [cover, twoStories, 3, 5, 6],
        18: [cover, twoStories, 4, 5, 6],
        19: [cover, twoStories, 4, 5, 6],
        20: [cover, twoStories, 4, 1, 5, 6],
        21: [cover, twoStories, 3, 4, 5, 6],
        22: [cover, threeStories, 4, 3, 5, 6],
        23: [cover, threeStories, 4, 5, 4, 6],
        24: [cover, threeStories, 5, 4, 5, 6],
        25: [cover, 5, 4, 5, 4, 6],
    }
}

const thirdPageCoverLayout = (
    cover: FrontCardAppearanceShort = 1,
    visual = false,
): FrontCardsForArticleCount => {
    const [twoStories, threeStories] = visual
        ? [2 as FrontCardAppearanceShort, 3 as FrontCardAppearanceShort]
        : [
              FrontCardAppearance.visualTwoStoryPage,
              FrontCardAppearance.visualThreeStoryPage,
          ]

    return {
        0: [],
        1: [cover],
        2: [cover, 1],
        3: [cover, twoStories],
        4: [cover, threeStories],
        5: [cover, 4],
        6: [cover, 5],
        7: [cover, twoStories, cover, 3],
        8: [cover, threeStories, cover, 3],
        9: [cover, threeStories, cover, 4],
        10: [cover, 4, cover, 4],
        11: [cover, twoStories, cover, 2, 5],
        12: [cover, twoStories, cover, 3, 5],
        13: [cover, 3, cover, 3, 5],
        14: [cover, 3, cover, 3, 6],
        15: [cover, twoStories, cover, 2, 4, 5],
        16: [cover, twoStories, cover, 2, 4, 6],
        17: [cover, twoStories, cover, 2, 5, 6],
        18: [cover, twoStories, cover, 3, 5, 6],
        19: [cover, threeStories, cover, 3, 5, 6],
        20: [cover, threeStories, cover, 3, 1, 5, 6],
        21: [cover, twoStories, cover, 2, 4, 5, 6],
        22: [cover, threeStories, cover, 3, 3, 5, 6],
        23: [cover, threeStories, cover, 3, 5, 4, 6],
        24: [cover, threeStories, cover, 4, 4, 5, 6],
        25: [cover, 5, cover, 3, 5, 4, 6],
    }
}

export const getCardsForFront = (
    frontName: string,
): FrontCardsForArticleCount => {
    switch (frontName) {
        case 'Crosswords':
            return {
                0: [],
                1: [2],
            }
        case 'Lifestyle':
        case 'Culture':
            return thirdPageCoverLayout(FrontCardAppearance.splashPage, true)
        case 'Food':
        case 'Review':
            return defaultLayout(FrontCardAppearance.splashPage, true)
        case 'Sport':
            return defaultLayout(1, true)
        default:
            return defaultLayout(1)
    }
}
