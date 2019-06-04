import React from 'react'
import { color as themeColor } from '../theme/color'

import Svg, { Rect } from 'react-native-svg'
import { StyleSheet } from 'react-native'

const pixel = StyleSheet.hairlineWidth * 2
const gap = pixel * 6

const Multiline = ({ color, count }: { color: string; count: number }) => {
    const lines = []
    for (let i = 0; i < count; i++) {
        lines.push(
            <Rect
                y={pixel * i * gap}
                width="100%"
                height={pixel}
                fill={color}
            />,
        )
    }
    return (
        <Svg width="100%" height={pixel * count * gap} fill="none">
            {lines}
        </Svg>
    )
}
Multiline.defaultProps = {
    color: themeColor.text,
    count: 4,
}

export { Multiline }
