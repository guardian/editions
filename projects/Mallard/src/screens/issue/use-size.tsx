import { createContext, useContext } from 'react'
import { metrics } from 'src/theme/spacing'
import { Dimensions, LayoutRectangle } from 'react-native'
import { PageLayoutSizes } from 'src/common'

const BreakpointContext = createContext<[PageLayoutSizes, LayoutRectangle]>([
    PageLayoutSizes.mobile,
    { ...Dimensions.get('window'), x: 0, y: 0 },
])

const useIssueScreenSize = () => {
    const [size, layout] = useContext(BreakpointContext)
    const card =
        size === PageLayoutSizes.mobile
            ? metrics.fronts.cardSize
            : layout.height > 980
            ? metrics.fronts.cardSizeTablet
            : metrics.fronts.cardSizeTabletShort
    const container = {
        height: metrics.fronts.cardContainerHeightExtra + card.height,
        width: layout.width,
    }

    if (layout.width < card.width) {
        card.width = layout.width
    }

    return { size, card, container, layout }
}

const WithIssueScreenSize = BreakpointContext.Provider
export { useIssueScreenSize, WithIssueScreenSize }
