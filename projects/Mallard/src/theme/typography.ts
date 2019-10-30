import { pickClosestBreakpoint, Breakpoints } from './breakpoints'
import { Dimensions } from 'react-native'
import { BreakpointList } from 'src/theme/breakpoints'

export const families = {
    icon: {
        regular: 'GuardianIcons-Regular',
    },
    sans: {
        regular: 'GuardianTextSans-Regular',
        bold: 'GuardianTextSans-Bold',
    },
    text: {
        regular: 'GuardianTextEgyptian-Reg',
        regularItalic: 'GuardianTextEgyptian-RegIt',
        bold: 'GuardianTextEgyptian-Bold',
    },
    titlepiece: {
        regular: 'GTGuardianTitlepiece-Bold',
    },
    daily: {
        regular: 'GTGuardianDaily-Regular',
    },
    headline: {
        light: 'GHGuardianHeadline-Light',
        regular: 'GHGuardianHeadline-Regular',
        medium: 'GHGuardianHeadline-Medium',
        bold: 'GHGuardianHeadline-Bold',
    },
}

export type FontFamily = keyof typeof families

/*
Think of these as ems
*/

const scale = {
    icon: {
        [1]: {
            [Breakpoints.smallPhone]: {
                fontSize: 20,
                lineHeight: 20,
            },
            [Breakpoints.phone]: {
                fontSize: 20,
                lineHeight: 20,
            },
        },
    },
    sans: {
        [0.5]: {
            [Breakpoints.smallPhone]: {
                fontSize: 11,
                lineHeight: 11,
            },
            [Breakpoints.phone]: {
                fontSize: 13,
                lineHeight: 13,
            },
        },
        [0.9]: {
            [Breakpoints.smallPhone]: {
                fontSize: 13,
                lineHeight: 16,
            },
            [Breakpoints.phone]: {
                fontSize: 15,
                lineHeight: 18,
            },
        },
        1: {
            [Breakpoints.smallPhone]: {
                fontSize: 14,
                lineHeight: 19,
            },
            [Breakpoints.phone]: {
                fontSize: 17,
                lineHeight: 21,
            },
        },
    },
    text: {
        0.9: {
            [Breakpoints.smallPhone]: {
                fontSize: 14,
                lineHeight: 18,
            },
            [Breakpoints.phone]: {
                fontSize: 14,
                lineHeight: 16,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 18,
                lineHeight: 22,
            },
        },
        1: {
            [Breakpoints.smallPhone]: {
                fontSize: 14,
                lineHeight: 18,
            },
            [Breakpoints.phone]: {
                fontSize: 18,
                lineHeight: 23,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 18,
                lineHeight: 22,
            },
        },
        1.25: {
            [Breakpoints.smallPhone]: {
                fontSize: 15,
                lineHeight: 19,
            },
            [Breakpoints.phone]: {
                fontSize: 18,
                lineHeight: 22,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 20,
                lineHeight: 24,
            },
        },
    },
    headline: {
        0.5: {
            [Breakpoints.smallPhone]: {
                fontSize: 12,
                lineHeight: 14,
            },
            [Breakpoints.phone]: {
                fontSize: 12,
                lineHeight: 14,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 16,
                lineHeight: 17,
            },
        },
        0.75: {
            [Breakpoints.smallPhone]: {
                fontSize: 18,
                lineHeight: 20,
            },
            [Breakpoints.phone]: {
                fontSize: 18,
                lineHeight: 20,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 21,
                lineHeight: 22,
            },
        },
        1: {
            [Breakpoints.smallPhone]: {
                fontSize: 15,
                lineHeight: 17,
            },
            [Breakpoints.phone]: {
                fontSize: 17,
                lineHeight: 20,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 24,
                lineHeight: 27,
            },
        },
        1.25: {
            [Breakpoints.smallPhone]: {
                fontSize: 24,
                lineHeight: 26,
            },
            [Breakpoints.phone]: {
                fontSize: 24,
                lineHeight: 26,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 28,
                lineHeight: 30,
            },
        },
        1.5: {
            [Breakpoints.smallPhone]: {
                fontSize: 21,
                lineHeight: 22,
            },
            [Breakpoints.phone]: {
                fontSize: 24,
                lineHeight: 26,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 36,
                lineHeight: 38,
            },
        },
        1.6: {
            [Breakpoints.smallPhone]: {
                fontSize: 21,
                lineHeight: 22,
            },
            [Breakpoints.phone]: {
                fontSize: 30,
                lineHeight: 32,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 36,
                lineHeight: 38,
            },
        },
        1.75: {
            [Breakpoints.smallPhone]: {
                fontSize: 30,
                lineHeight: 32,
            },
            [Breakpoints.phone]: {
                fontSize: 32,
                lineHeight: 34,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 40,
                lineHeight: 44,
            },
        },
        2: {
            [Breakpoints.smallPhone]: {
                fontSize: 40,
                lineHeight: 44,
            },
            [Breakpoints.phone]: {
                fontSize: 40,
                lineHeight: 44,
            },
        },
    },
    titlepiece: {
        1: {
            [Breakpoints.smallPhone]: {
                fontSize: 16,
                lineHeight: 18,
            },
            [Breakpoints.phone]: {
                fontSize: 16,
                lineHeight: 18,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 18,
                lineHeight: 20,
            },
        },
        1.25: {
            [Breakpoints.smallPhone]: {
                fontSize: 20,
                lineHeight: 22,
            },
            [Breakpoints.phone]: {
                fontSize: 24,
                lineHeight: 26,
            },
        },
        1.5: {
            [Breakpoints.smallPhone]: {
                fontSize: 25,
                lineHeight: 28,
            },
            [Breakpoints.phone]: {
                fontSize: 30,
                lineHeight: 33,
            },
        },
        2: {
            [Breakpoints.smallPhone]: {
                fontSize: 38,
                lineHeight: 43,
            },
            [Breakpoints.phone]: {
                fontSize: 45,
                lineHeight: 50,
            },
        },
        2.25: {
            [Breakpoints.smallPhone]: {
                fontSize: 38,
                lineHeight: 42,
            },
            [Breakpoints.phone]: {
                fontSize: 50,
                lineHeight: 55,
            },
        },
        2.5: {
            [Breakpoints.smallPhone]: {
                fontSize: 50,
                lineHeight: 56,
            },
            [Breakpoints.phone]: {
                fontSize: 60,
                lineHeight: 58,
            },
        },
    },
    daily: {
        1: {
            [Breakpoints.phone]: {
                fontSize: 20,
                lineHeight: 25,
            },
        },
    },
}

export type FontSizes<F extends FontFamily> = keyof typeof scale[F]
export type FontWeights<F extends FontFamily> = keyof typeof families[F]

export const getUnscaledFont = <F extends FontFamily>(
    family: F,
    level: FontSizes<F>,
) => {
    return (scale[family][level] as unknown) as BreakpointList<{
        fontSize: number
        lineHeight: number
    }>
}

export const applyScale = (
    unscaledFont: ReturnType<typeof getUnscaledFont>,
) => {
    return pickClosestBreakpoint(
        unscaledFont,
        Dimensions.get('window').width * 1,
    )
}

export const getFont = <F extends FontFamily>(
    family: F,
    level: FontSizes<F>,
    weight: FontWeights<F> = 'regular',
) => {
    const fontAtLevel = getUnscaledFont(family, level)
    return {
        fontFamily: families[family][weight],
        ...applyScale(fontAtLevel),
    }
}
