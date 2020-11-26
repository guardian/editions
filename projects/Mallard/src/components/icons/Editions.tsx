import React from 'react'
import Svg, { Circle, Rect } from 'react-native-svg'
import { color } from 'src/theme/color'

const Editions = ({
    height = 42,
    width = 42,
    darkVersion = false,
}: {
    height?: number
    width?: number
    darkVersion?: boolean
}) => {
    const circleColors = {
        topLeft: darkVersion ? color.artboardBackground : '#FFBAC8',
        topRight: darkVersion ? color.artboardBackground : 'white',
        bottomLeft: darkVersion ? color.artboardBackground : '#90DCFF',
        bottomRight: darkVersion ? color.artboardBackground : '#FF7F0F',
        border: darkVersion ? color.artboardBackground : 'white',
    }
    return (
        <Svg width={width} height={height} fill="none">
            <Rect
                x="0.5"
                y="0.5"
                width="41"
                height="41"
                rx="20.5"
                stroke={circleColors.border}
            />
            <Circle cx="29" cy="14" r="7" fill={circleColors.topLeft} />
            <Circle cx="14" cy="14" r="7" fill={circleColors.topRight} />
            <Circle cx="29" cy="29" r="7" fill={circleColors.bottomLeft} />
            <Circle cx="14" cy="29" r="7" fill={circleColors.bottomRight} />
        </Svg>
    )
}

export { Editions }
