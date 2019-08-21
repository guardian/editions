import React, { useState, ReactNode, FunctionComponent } from 'react'
import { View, LayoutRectangle } from 'react-native'
import { areEqualShallow } from 'src/helpers/features'

const WithLayoutRectangle: FunctionComponent<{
    children: (l: LayoutRectangle) => ReactNode
    minHeight?: number
}> = ({ children, minHeight }) => {
    const [metrics, setMetrics] = useState<LayoutRectangle | null>(null)
    return (
        <View
            style={{ minHeight }}
            onLayout={ev => {
                setMetrics(metrics => {
                    if (
                        ev.nativeEvent &&
                        (!metrics ||
                            !areEqualShallow(ev.nativeEvent.layout, metrics))
                    ) {
                        return ev.nativeEvent.layout
                    }
                    return null
                })
            }}
        >
            {metrics && children(metrics)}
        </View>
    )
}

export { WithLayoutRectangle }
