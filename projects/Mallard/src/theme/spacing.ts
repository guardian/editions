import { Platform, StatusBar } from 'react-native'
import { Size } from 'src/helpers/sizes'

const spacing = [0, 3, 6, 12, 18, 30]

const headerHeight = spacing[5]
const basicMetrics = {
    horizontal: 14,
    vertical: 10,
}

const XY = (width: number, height: number): Size => ({ width, height })

const scrubberRadius = 18
export const metrics = {
    ...basicMetrics,
    headerHeight,
    article: {
        sides: basicMetrics.horizontal / 2,
        sidesTablet: basicMetrics.horizontal * 1.5,
        maxWidth: 540,
        maxWidthLandscape: 620,
        leftRailLandscape: 120,
        rightRail: 200,
        rightRailLandscape: 260,
    },
    fronts: {
        sides: basicMetrics.horizontal * 1.5,
        cardContainerHeightExtra: scrubberRadius * 2,
        cardSize: XY(540, 600),
        cardSizeTablet: XY(650, 650),
        cardSizeTabletShort: XY(650, 650),
        scrubberRadius,
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
