const families = {
    sans: 'GuardianTextSans-Regular',
    text: 'GuardianTextEgyptian-Reg',
}

type FontFamily = keyof typeof families

/*
Think of these as ems
*/

const scale = {
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
        1: {
            fontSize: 17,
            lineHeight: 21,
        },
    },
}

export const getFont = <F extends FontFamily>(
    family: F,
    level: keyof typeof scale[F],
) => {
    const scaleForLevel = scale[family][level]
    return {
        fontFamily: families[family],
        ...scaleForLevel,
    }
}
