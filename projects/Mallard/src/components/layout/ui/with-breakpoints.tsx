import React, { useState, ReactNode, FunctionComponent } from 'react'
import { View, LayoutRectangle } from 'react-native'
import { getClosestBreakpoint, BreakpointList } from 'src/theme/breakpoints'

const WithBreakpoints: FunctionComponent<{
    children: BreakpointList<(l: LayoutRectangle) => ReactNode>
    minHeight?: number
}> = ({ children, minHeight = 0 }) => {
    const [maxSize, setMaxSize] = useState<keyof typeof children>(0)
    const [metrics, setMetrics] = useState<LayoutRectangle | null>(null)
    return (
        <View
            style={{ minHeight }}
            onLayout={ev => {
                setMetrics(ev.nativeEvent.layout)
                setMaxSize(
                    getClosestBreakpoint(
                        (Object.keys(children) as unknown[]) as number[],
                        ev.nativeEvent.layout.width,
                    ),
                )
            }}
        >
            {metrics && children[maxSize](metrics)}
        </View>
    )
}

export { WithBreakpoints }
