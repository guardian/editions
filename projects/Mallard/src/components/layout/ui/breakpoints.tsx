import React, { useState, ReactElement } from 'react'
import { View, LayoutRectangle, StyleSheet } from 'react-native'

const Breakpoints = ({
    children,
}: {
    children: {
        0: (l: LayoutRectangle) => ReactElement
        [fromSize: number]: (l: LayoutRectangle) => ReactElement
    }
}) => {
    const [maxSize, setMaxSize] = useState<keyof typeof children>(0)
    const [metrics, setMetrics] = useState<LayoutRectangle | null>(null)
    return (
        <View
            onLayout={ev => {
                let max = 0
                for (let key of Object.keys(children)) {
                    if (ev.nativeEvent.layout.width >= parseInt(key)) {
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

const IPAD_VERTICAL = 700
const IPAD_LANDSCAPE = 1000

export { Breakpoints, IPAD_VERTICAL, IPAD_LANDSCAPE }
