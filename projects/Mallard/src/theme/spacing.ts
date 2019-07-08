import { Platform, StatusBar, Dimensions } from 'react-native'

export const spacing = [0, 3, 6, 12, 18, 30]

const headerHeight = spacing[5]
const basicMetrics = {
    horizontal: spacing[3],
    vertical: spacing[3],
}

export const metrics = {
    ...basicMetrics,
    headerHeight,
    frontsPageSides: basicMetrics.horizontal * 1.5,
    frontsPageHeight: 540,
    issueHeaderSplit: () => {
        const { width } = Dimensions.get('window')
        return width * 0.7
    },
    slideCardSpacing:
        Platform.OS === 'ios'
            ? spacing[5] * 2
            : StatusBar.currentHeight || spacing[5] + spacing[5],
}
