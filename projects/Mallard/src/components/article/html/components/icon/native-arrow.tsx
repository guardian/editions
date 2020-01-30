import React from 'react'
import Svg, { G, Path } from 'react-native-svg'
import { Direction } from '../../../../../../../Apps/common/src'

export const NativeArrow = ({
    fill,
    direction,
}: {
    fill: string
    direction: Direction
}) => (
    <Svg
        width={11}
        height={9}
        viewBox="0 0 11 9"
        fill="none"
        rotate={direction}
    >
        <G opacity="0.5">
            <Path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M5.5 0L10.5 9H0.5L5.5 0Z"
                fill={fill}
            />
        </G>
    </Svg>
)
