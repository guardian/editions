import { createContext, useContext } from 'react'
import { metrics } from 'src/theme/spacing'
import { Dimensions, LayoutRectangle, Alert } from 'react-native'

export enum IssueScreenSize {
    'small',
    'tablet',
}

const BreakpointContext = createContext<[IssueScreenSize, LayoutRectangle]>([
    IssueScreenSize.small,
    { ...Dimensions.get('window'), x: 0, y: 0 },
])

const useIssueScreenSize = () => {
    const [size, layout] = useContext(BreakpointContext)
    const card =
        size === IssueScreenSize.small
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
