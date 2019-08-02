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
            fontSize: 20,
            lineHeight: 20,
        },
    },
    sans: {
        [0.5]: {
            fontSize: 13,
            lineHeight: 13,
        },
        [0.9]: {
            fontSize: 15,
            lineHeight: 18,
        },
        1: {
            fontSize: 17,
            lineHeight: 21,
        },
    },
    text: {
        0.9: {
            fontSize: 14,
            lineHeight: 18,
        },
        1: {
            fontSize: 17,
            lineHeight: 21,
        },
    },
    headline: {
        1: {
            fontSize: 19,
            lineHeight: 22,
        },
        1.25: {
            fontSize: 24,
            lineHeight: 27,
        },
        1.5: {
            fontSize: 28,
            lineHeight: 32,
        },
        2: {
            fontSize: 40,
            lineHeight: 40,
        },
    },
    titlepiece: {
        1: {
            fontSize: 18,
            lineHeight: 18,
        },
        1.25: {
            fontSize: 24,
            lineHeight: 24,
        },
        1.5: {
            fontSize: 30,
            lineHeight: 30,
        },
        2: {
            fontSize: 45,
            lineHeight: 45,
        },
        2.5: {
            fontSize: 60,
            lineHeight: 60,
        },
    },
}

export const getFont = <F extends FontFamily>(
    family: F,
    level: keyof typeof scale[F],
    weight: keyof typeof families[F] = 'regular',
) => {
    const scaleForLevel = scale[family][level]
    return {
        fontFamily: families[family][weight],
        ...scaleForLevel,
    }
}
