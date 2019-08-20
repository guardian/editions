import React from 'react'
import Svg, { Path } from 'react-native-svg'
import { toSize } from 'src/helpers/sizes'
import { color } from 'src/theme/color'
import { View } from 'react-native'

export enum BigArrowDirection {
    'top' = 90,
    'left' = 0,
    'bottom' = -90,
    'right' = 180,
}

export const BigArrow = ({
    scale = 1,
    fill = color.text,
    direction = BigArrowDirection.left,
}: {
    scale: number
    fill: string
    direction: BigArrowDirection
}) => {
    const dimensions = toSize(9 * scale, 11 * scale)
    return (
        <View
            style={{
                transform: [
                    {
                        rotate: direction + 'deg',
                    },
                ],
            }}
        >
            <Svg
                width={dimensions.width}
                height={dimensions.height}
                viewBox={`0 0 9 11`}
                fill="none"
            >
                <Path d="M0 5.5L9 0.5V10.5L0 5.5Z" fill={fill} />
            </Svg>
        </View>
    )
}
