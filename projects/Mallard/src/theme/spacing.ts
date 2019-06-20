import { Platform, StatusBar } from 'react-native'

export const spacing = [0, 3, 6, 12, 18, 30]

const headerHeight = spacing[5]

export const metrics = {
    horizontal: spacing[3],
    vertical: spacing[3],
    headerHeight,
    frontCardHeight: 540,
    slideCardSpacing:
        Platform.OS === 'ios'
            ? spacing[5] * 2
            : StatusBar.currentHeight || spacing[5] + spacing[5],
}
