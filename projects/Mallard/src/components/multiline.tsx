import React from 'react'
import { color as themeColor } from 'src/theme/color'

import Svg, { Rect } from 'react-native-svg'
import { StyleSheet, StyleProp } from 'react-native'

const pixel = StyleSheet.hairlineWidth * 2
const gap = 5

const Multiline = ({
    color,
    count,
    style,
    width,
}: {
    color: string
    count: number
    style?: StyleProp<{}>
    width?: string | number
}) => {
    const lines = []
    for (let i = 0; i < count; i++) {
        lines.push(
            <Rect
                key={i}
                y={pixel * i * gap}
                width="100%"
                height={pixel}
                fill={color}
            />,
        )
    }
    return (
        <Svg {...style} width={width} height={pixel * count * gap} fill="none">
            {lines}
        </Svg>
    )
}
Multiline.defaultProps = {
    color: themeColor.text,
    count: 4,
    width: '100%',
}

export { Multiline }
