import React, { useState } from 'react'

import Svg, { Circle, Text, Line, G } from 'react-native-svg'
import { color } from '../theme/color'
import { Animated, View, Dimensions } from 'react-native'

const radius = 4
const signPostRadius = 20

const Stop = ({ fill, ...props }: { fill: string; [key: string]: any }) => {
    return <Circle r={radius} cy={signPostRadius} fill={fill} {...props} />
}

const AnimatedG = Animated.createAnimatedComponent(G)

const Signpost = ({
    fill,
    title,
    ...props
}: {
    fill: string
    title: string
    [key: string]: any
}) => (
    <AnimatedG {...props}>
        <Circle
            cy={signPostRadius}
            cx={signPostRadius}
            fill={fill}
            r={signPostRadius}
            opacity={0.2}
        />
        <Text
            fill={color.textOverDarkBackground}
            fontSize="30"
            textAnchor="middle"
            fontFamily="GTGuardianTitlepiece-Bold"
            x={signPostRadius}
            y={signPostRadius * 1.5}
        >
            {title[0]}
        </Text>
    </AnimatedG>
)

const NavigatorStrip = ({
    title,
    fill,
    stops,
    position,
}: {
    title: string
    fill: string
    stops: number
    position: Animated.AnimatedInterpolation
}) => {
    const stopElements = []
    for (let i = 1; i < stops - 1; i++) {
        stopElements.push(
            <Stop cx={`${(i / (stops - 1)) * 100}%`} fill={fill} />,
        )
    }

    const [width, setWidth] = useState(Dimensions.get('window').width)

    return (
        <View
            onLayout={ev => {
                setWidth(ev.nativeEvent.layout.width)
            }}
            style={{ overflow: 'visible' }}
        >
            <Svg
                width="100%"
                height={signPostRadius * 2}
                style={{ overflow: 'visible' }}
            >
                <Line
                    x1="0"
                    y1={signPostRadius}
                    x2="100%"
                    y2={signPostRadius}
                    stroke={fill}
                />
                {stopElements}
                <Stop cx={radius} fill={fill} />
                <Stop cx={'100%'} translateX={radius * -1} fill={fill} />
                <Signpost
                    style={[
                        {
                            transform: [
                                {
                                    translateX: position.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [
                                            0,
                                            width - signPostRadius * 2,
                                        ],
                                    }),
                                },
                            ],
                        },
                    ]}
                    title={title}
                    fill={fill}
                />
            </Svg>
        </View>
    )
}
NavigatorStrip.defaultProps = {
    fill: color.text,
    stops: 3,
}
export { NavigatorStrip }
