import { Platform, StatusBar, Dimensions } from 'react-native'

const spacing = [0, 3, 6, 12, 18, 30]

const headerHeight = spacing[5]
const basicMetrics = {
    horizontal: 14,
    vertical: 10,
}

export const metrics = {
    ...basicMetrics,
    headerHeight,
    frontsPageSides: basicMetrics.horizontal * 1.5,
    frontsPageHeight: 540,
    article: {
        sides: basicMetrics.horizontal / 2,
        sidesLandscape: basicMetrics.horizontal * 1.5,
        maxWidth: 540,
        maxWidthLandscape: 640,
        leftRailLandscape: 100,
    },
    gridRowSplit: () => {
        const { width } = Dimensions.get('window')
        return width * 0.6
    },
    slideCardSpacing:
        Platform.OS === 'ios'
            ? spacing[5] * 2
            : StatusBar.currentHeight || spacing[5] + spacing[5],
}
