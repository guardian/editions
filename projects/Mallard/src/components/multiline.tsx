import React from 'react'
import { color as themeColor } from '../theme/color'

import Svg, { Rect } from 'react-native-svg'
import { StyleSheet } from 'react-native'

const pixel = StyleSheet.hairlineWidth * 2

const Multiline = ({ color }: { color: string }) => (
    <Svg width="100%" height={pixel * 11} fill="none">
        <Rect y={pixel * 9} width="100%" height={pixel} fill={color} />
        <Rect y={pixel * 6} width="100%" height={pixel} fill={color} />
        <Rect y={pixel * 3} width="100%" height={pixel} fill={color} />
        <Rect width="100%" height={pixel} fill={color} />
    </Svg>
)
Multiline.defaultProps = {
    color: themeColor.text,
}

export { Multiline }
