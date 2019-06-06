import React from 'react'

import Svg, { Circle, Line } from 'react-native-svg'

const Background = ({
    fill,
    stops,
    height,
    stopRadius,
}: {
    fill: string
    stops: number
    height: number
    stopRadius: number
}) => {
    const Stop = ({ fill, ...props }: { fill: string; [key: string]: any }) => {
        return <Circle r={stopRadius} cy={height} fill={fill} {...props} />
    }
    const stopElements = []
    for (let i = 1; i < stops - 1; i++) {
        stopElements.push(
            <Stop cx={`${(i / (stops - 1)) * 100}%`} fill={fill} />,
        )
    }
    return (
        <Svg
            width="100%"
            height={height * 2}
            style={{ overflow: 'visible', position: 'absolute' }}
        >
            <Line x1="0" y1={height} x2="100%" y2={height} stroke={fill} />
            <Stop cx={stopRadius} fill={fill} />
            <Stop cx={'100%'} translateX={stopRadius * -1} fill={fill} />
            {stopElements}
        </Svg>
    )
}

export { Background }
