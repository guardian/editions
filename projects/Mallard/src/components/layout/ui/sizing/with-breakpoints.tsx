import React, { ReactNode, FunctionComponent } from 'react'
import { ScaledSize } from 'react-native'
import { getClosestBreakpoint, BreakpointList } from 'src/theme/breakpoints'
import { useDimensions } from 'src/hooks/use-screen'

const WithBreakpoints: FunctionComponent<{
    children: BreakpointList<(d: ScaledSize) => ReactNode>
}> = ({ children }) => {
    const { width, ...dimensions } = useDimensions()
    const maxSize = getClosestBreakpoint(
        (Object.keys(children) as unknown[]) as number[],
        width,
    )
    return <>{children[maxSize]({ width, ...dimensions })}</>
}

export { WithBreakpoints }
