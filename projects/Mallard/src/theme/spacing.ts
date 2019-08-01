import { Platform, StatusBar, Dimensions } from 'react-native'

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
    frontsPageHeight: 540,
    gridRowSplit: () => {
        const { width } = Dimensions.get('window')
        return width * 0.6
    },
    slideCardSpacing:
        Platform.OS === 'ios'
            ? spacing[5] * 2
            : StatusBar.currentHeight || spacing[5] + spacing[5],
}
