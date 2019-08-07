import { Platform, StatusBar, Dimensions, PixelRatio } from 'react-native'

export const spacing = [0, 3, 6, 12, 18, 30]

const headerHeight = spacing[5]
const basicMetrics = {
    horizontal: 14,
    vertical: 10,
}

export const metrics = {
    ...basicMetrics,
    headerHeight,
    frontsPageSides: basicMetrics.horizontal * 1.5,
    articleSides: basicMetrics.horizontal / 2,
    fronts: {
        cardHeight: 540,
        cardMaxWidth: 540,
        blockHeight: 600,
    },
    gridRowSplit: {
        narrow: (width: number) => width * 0.6,
        wide: 200,
    },
    slideCardSpacing:
        Platform.OS === 'ios'
            ? spacing[5] * 2
            : StatusBar.currentHeight || spacing[5] + spacing[5],
}
