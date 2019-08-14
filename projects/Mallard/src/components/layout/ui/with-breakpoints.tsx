import React, { useState, ReactNode, FunctionComponent } from 'react'
import { View, LayoutRectangle } from 'react-native'
import { getClosestBreakpoint, BreakpointList } from 'src/theme/breakpoints'
import { UiBodyCopy } from 'src/components/styled-text'

const WithBreakpoints: FunctionComponent<{
    children: BreakpointList<(l: LayoutRectangle) => ReactNode>
}> = ({ children }) => {
    const [maxSize, setMaxSize] = useState<keyof typeof children>(0)
    const [metrics, setMetrics] = useState<LayoutRectangle | null>(null)
    return (
        <View
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
