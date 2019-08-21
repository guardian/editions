import React, { useState, ReactNode, FunctionComponent } from 'react'
import { View, LayoutRectangle } from 'react-native'

const WithLayoutRectangle: FunctionComponent<{
    children: (l: LayoutRectangle) => ReactNode
    minHeight?: number
}> = ({ children, minHeight }) => {
    const [metrics, setMetrics] = useState<LayoutRectangle | null>(null)
    return (
        <View
            style={{ minHeight, flexGrow: 1 }}
            onLayout={ev => {
                setMetrics(ev.nativeEvent.layout)
            }}
        >
            {metrics && children(metrics)}
        </View>
    )
}

export { WithLayoutRectangle }
