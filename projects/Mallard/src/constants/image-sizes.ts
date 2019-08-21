export const imageSizes = ['phone', 'tablet', 'tabletL', 'tabletXL'] as const
export type ImageSize = typeof imageSizes[number]

const sizes: { [k in ImageSize]: number } = {
    phone: 375,
    tablet: 740,
    tabletL: 980,
    tabletXL: 1140
}

export { sizes }
