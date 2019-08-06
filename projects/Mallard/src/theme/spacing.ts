import { Platform, StatusBar, Dimensions, PixelRatio } from 'react-native'
import { useState } from 'react'
import { Breakpoints } from 'src/theme/breakpoints'

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
    slideCardSpacing:
        Platform.OS === 'ios'
            ? spacing[5] * 2
            : StatusBar.currentHeight || spacing[5] + spacing[5],
}

export const useLiveMetrics = () => {
    const [dimensions, setDimensions] = useState(Dimensions.get('window'))
    Dimensions.addEventListener('change', ev => {
        setDimensions(ev.window)
    })
    return {
        gridRowSplit:
            (dimensions.width > Breakpoints.tabletVertical
                ? 200
                : dimensions.width * 0.6) * PixelRatio.getFontScale(),
    }
}
