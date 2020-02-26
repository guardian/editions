type PossibleCardlengths = 1 | 2 | 3 | 4 | 5 | 6

export enum FrontCardAppearance {
    splashPage = 'splash',
    superHeroPage = 'super',
    twoStoryPage = 'two',
    twoStoryPageWithSidekick = 'two-plus-sidekick',
    twoStoryStarter = 'two-starter',
    threeStoryPage = 'three',
    threeStoryPageWithSidekick = 'three-plus-sidekick',
    threeStoryStarter = 'three-starter',
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
    [FrontCardAppearance.twoStoryPageWithSidekick]: { fits: 2 },
    [FrontCardAppearance.twoStoryStarter]: { fits: 2 },
    [FrontCardAppearance.threeStoryPage]: { fits: 3 },
    [FrontCardAppearance.threeStoryPageWithSidekick]: { fits: 3 },
    [FrontCardAppearance.threeStoryStarter]: { fits: 3 },
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
): FrontCardAppearanceInfo & { appearance: FrontCardAppearance } => {
    if (typeof card === 'number') {
        return {
            appearance: defaultCardAppearances[card],
            ...frontCardAppearanceInfo[defaultCardAppearances[card]],
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
    const [twoStories, threeStories]: [
        FrontCardAppearanceShort,
        FrontCardAppearanceShort,
    ] = visual
        ? [
              FrontCardAppearance.twoStoryPageWithSidekick,
              FrontCardAppearance.threeStoryPageWithSidekick,
          ]
        : [2, 3]

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
    const [twoStories, threeStories]: [
        FrontCardAppearanceShort,
        FrontCardAppearanceShort,
    ] = visual
        ? [
              FrontCardAppearance.twoStoryPageWithSidekick,
              FrontCardAppearance.threeStoryPageWithSidekick,
          ]
        : [2, 3]

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

/**
 * Denser layout than the default, that allows 2 or 3 articles on front card
 * (aka. front page) of a collection. The way the list is constructed is by
 * progressively increasing density, but avoiding repeating densities. (Ex. we
 * want to avoid 2 successive card with 4 articles each, to prevent a monotonous
 * layout.) Finally, we add a new card if we can't fit an additional article
 * anymore without getting a crowded and monotonous layout.
 *
 * We also make sure to progresively increase the number of the first card, but
 * never decrease it. This is because it'd otherwise be confusing for the
 * production/editioral team, where you might get better result adding 1 more
 * article in the collection, instead of breaking down a collection in smaller
 * ones.
 */
const denseLayout = (): FrontCardsForArticleCount => {
    // Delete this once the client-side changes are running in the released
    // non-beta version of the app.
    if (process.env.EDITIONS_DENSE_LAYOUT !== 'enabled') return defaultLayout(1)
    return {
        0: [],
        1: [1],

        // We do not want to switch to 2 articles on front page right away. Prod
        // team can decide to add more articles if they need a denser layout.
        2: [1, 1],
        3: [1, 2],
        4: [2, 2],
        // Growing up to 2 articles on front page to distribute density.
        5: [3, 2],
        6: [2, 4],
        7: [2, 5],

        8: [3, 5],
        // We want to avoid [3, 6], so breakdown into more cards at this point.
        // 4-article cards have more pictures than 3x ones so let's swap them.
        9: [3, 2, 4],
        10: [3, 2, 5],
        11: [3, 3, 5],
        // Growing up to 3 articles on front page to avoid additional cards yet.
        12: [3, 4, 5],
        13: [3, 4, 6],
        14: [3, 5, 6],

        // Need more breathing room, let's add a card.
        15: [3, 4, 3, 5],
        16: [3, 4, 4, 5],
        17: [3, 4, 5, 5],
        18: [3, 4, 5, 6],
        19: [3, 5, 5, 6],

        // Alternate densities to avoid monotonous layouts for these very high
        // article-count collections.
        20: [3, 4, 3, 4, 6],
        21: [3, 4, 3, 5, 6],
        22: [3, 4, 4, 4, 6],
        23: [3, 5, 4, 5, 6],

        24: [3, 4, 3, 5, 3, 6],
        25: [3, 4, 3, 4, 5, 6],
    }
}

export const getCardsForFront = (
    frontName: string,
): FrontCardsForArticleCount => {
    switch (frontName) {
        case 'National':
            return denseLayout()
        case 'World':
            return denseLayout()
        case 'Financial':
            return denseLayout()
        case 'Crosswords':
            return {
                0: [],
                1: [2],
            }

        case 'Life':
        case 'Culture':
            return thirdPageCoverLayout(FrontCardAppearance.splashPage, true)
        case 'Food':
        case 'Review':
        case 'Travel':
        case 'Books':
            return defaultLayout(FrontCardAppearance.splashPage, true)
        case 'Sport':
            return defaultLayout(1, true)
        default:
            return defaultLayout(1)
    }
}
