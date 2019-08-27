import { pickClosestBreakpoint, Breakpoints } from './breakpoints'
import { Dimensions } from 'react-native'
import { BreakpointList } from 'src/theme/breakpoints'
import { FontSizes } from 'src/theme/typography'

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
        bold: 'GuardianTextEgyptian-Bold',
    },
    titlepiece: {
        regular: 'GTGuardianTitlepiece-Bold',
    },
    headline: {
        light: 'GHGuardianHeadline-Light',
        regular: 'GHGuardianHeadline-Regular',
        bold: 'GHGuardianHeadline-Bold',
    },
}

type FontFamily = keyof typeof families

/*
Think of these as ems
*/

const scale = {
    icon: {
        [1]: {
            0: {
                fontSize: 20,
                lineHeight: 20,
            },
        },
    },
    sans: {
        [0.5]: {
            0: {
                fontSize: 13,
                lineHeight: 13,
            },
        },
        [0.9]: {
            0: {
                fontSize: 15,
                lineHeight: 18,
            },
        },
        1: {
            0: {
                fontSize: 17,
                lineHeight: 21,
            },
        },
    },
    text: {
        0.9: {
            0: {
                fontSize: 14,
                lineHeight: 18,
            },
        },
        1: {
            0: {
                fontSize: 16,
                lineHeight: 20,
            },

            [Breakpoints.tabletVertical]: {
                fontSize: 18,
                lineHeight: 22,
            },
        },
        1.25: {
            0: {
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
        1: {
            0: {
                fontSize: 19,
                lineHeight: 21,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 24,
                lineHeight: 27,
            },
        },
        1.25: {
            0: {
                fontSize: 24,
                lineHeight: 27,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 28,
                lineHeight: 32,
            },
        },
        1.5: {
            0: {
                fontSize: 28,
                lineHeight: 32,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 34,
                lineHeight: 38,
            },
        },
        1.75: {
            0: {
                fontSize: 34,
                lineHeight: 38,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 40,
                lineHeight: 44,
            },
        },
        2: {
            0: {
                fontSize: 40,
                lineHeight: 44,
            },
        },
    },
    titlepiece: {
        1: {
            0: {
                fontSize: 16,
                lineHeight: 18,
            },
            [Breakpoints.tabletVertical]: {
                fontSize: 18,
                lineHeight: 20,
            },
        },
        1.25: {
            0: {
                fontSize: 24,
                lineHeight: 26,
            },
        },
        1.5: {
            0: {
                fontSize: 30,
                lineHeight: 33,
            },
        },
        2: {
            0: {
                fontSize: 45,
                lineHeight: 50,
            },
        },
        2.25: {
            0: {
                fontSize: 55,
                lineHeight: 55,
            },
        },
        2.5: {
            0: {
                fontSize: 60,
                lineHeight: 66,
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
