import React, { useMemo } from 'react'

import Svg, { Circle, Line } from 'react-native-svg'
import { View } from 'react-native'
import { WithBreakpoints } from '../layout/ui/sizing/with-breakpoints'
import { WithLayoutRectangle } from 'src/components/layout/ui/sizing/with-layout-rectangle'

const Stop = ({
    fill,
    height,
    radius,
    ...props
}: {
    fill: string
    [key: string]: any
}) => {
    return <Circle r={radius} cy={height} fill={fill} {...props} />
}

const translate = (cx: number, radius: number) => radius * 2 * (1 - cx) - radius

const Background = ({
    fill,
    stops,
    height,
    radius,
}: {
    fill: string
    stops: number
    height: number
    radius: number
}) => {
    const stopElements = (width: number) => {
        let elements = [
            <Stop
                key={-2}
                style={{ transform: { translateX: radius } }}
                cx={0}
                {...{ fill, height, radius }}
            />,
            <Stop
                key={-1}
                style={{ transform: { translateX: radius * -1 } }}
                cx={width}
                {...{ fill, height, radius }}
            />,
        ]
        for (let i = 1; i < stops - 1; i++) {
            const cx = i / (stops - 1)
            const translateX = translate(cx, radius)
            elements.push(
                <Stop
                    key={i}
                    cx={width * cx}
                    style={{ transform: { translateX } }}
                    {...{ fill, height, radius }}
                />,
            )
        }
        return elements
    }
    return (
        <WithLayoutRectangle>
            {({ width }) => (
                <Svg
                    width={width}
                    height={height * 2}
                    style={{
                        overflow: 'visible',
                        position: 'absolute',
                    }}
                >
                    <Line
                        x1="0"
                        y1={height}
                        x2={width}
                        y2={height}
                        stroke={fill}
                    />
                    {stopElements(width)}
                </Svg>
            )}
        </WithLayoutRectangle>
    )
}

export { Background }
