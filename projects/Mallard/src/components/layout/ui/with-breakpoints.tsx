import React, { useState, ReactNode, FunctionComponent } from 'react'
import { View, LayoutRectangle, StyleSheet } from 'react-native'

const WithBreakpoints: FunctionComponent<{
    children: {
        0: (l: LayoutRectangle) => ReactNode
        [fromSize: number]: (l: LayoutRectangle) => ReactNode
    }
}> = ({ children }) => {
    const [maxSize, setMaxSize] = useState<keyof typeof children>(0)
    const [metrics, setMetrics] = useState<LayoutRectangle | null>(null)
    return (
        <View
            onLayout={ev => {
                let max = 0
                for (let key of Object.keys(children)) {
                    if (
                        ev.nativeEvent.layout.width >= parseInt(key) &&
                        max < parseInt(key)
                    ) {
                        max = parseInt(key)
                    }
                }
                setMetrics(ev.nativeEvent.layout)
                setMaxSize(max)
            }}
        >
            {metrics && children[maxSize](metrics)}
        </View>
    )
}

export { WithBreakpoints }
