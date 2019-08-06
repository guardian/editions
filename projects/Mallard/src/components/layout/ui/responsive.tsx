import React, { useState, ReactElement } from 'react'
import { View } from 'react-native'

const Responsive = ({
    children,
}: {
    children: {
        0: () => ReactElement
        [fromSize: number]: () => ReactElement
    }
}) => {
    const [maxSize, setMaxSize] = useState<keyof typeof children>(0)
    return (
        <View
            onLayout={ev => {
                let max = 0
                for (let key of Object.keys(children)) {
                    if (ev.nativeEvent.layout.width >= parseInt(key)) {
                        max = parseInt(key)
                    }
                }
                setMaxSize(max)
            }}
        >
            {children[maxSize]()}
        </View>
    )
}

const IPAD_VERTICAL = 800
const IPAD_LANDSCAPE = 1000

export { Responsive, IPAD_VERTICAL, IPAD_LANDSCAPE }
