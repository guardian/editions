import React, { useState } from 'react'

import Svg, { Circle, Text, Line, G, Rect } from 'react-native-svg'
import { color } from '../theme/color'
import { Animated, View, Dimensions } from 'react-native'

const radius = 4
const signPostRadius = 18

const Stop = ({ fill, ...props }: { fill: string; [key: string]: any }) => {
    return <Circle r={radius} cy={signPostRadius} fill={fill} {...props} />
}

const AnimatedG = Animated.createAnimatedComponent(G)

const Signpost = ({
    fill,
    title,
    position,
}: {
    fill: string
    title: string
    position: Animated.AnimatedInterpolation
}) => {
    const [textWidth, setTextWidth] = useState(1)
    return (
        <>
            <AnimatedG
                style={[
                    {
                        opacity: position.interpolate({
                            inputRange: [0, 20],
                            outputRange: [0, 1],
                        }),
                        transform: [
                            {
                                translateX: position,
                            },
                        ],
                    },
                ]}
            >
                <Circle
                    cy={signPostRadius}
                    cx={signPostRadius}
                    fill={fill}
                    r={signPostRadius}
                />
                <Text
                    fill={color.textOverDarkBackground}
                    fontSize="22"
                    textAnchor="middle"
                    fontFamily="GTGuardianTitlepiece-Bold"
                    x={signPostRadius}
                    y={signPostRadius * 1.4}
                >
                    {title[0]}
                </Text>
            </AnimatedG>
            <AnimatedG
                style={[
                    {
                        opacity: position.interpolate({
                            inputRange: [0, 20],
                            outputRange: [1, 0],
                        }),
                        transform: [
                            {
                                scaleX: position.interpolate({
                                    inputRange: [0, 20],
                                    outputRange: [1, 0.5],
                                    extrapolate: 'clamp',
                                }),
                                translateX: position,
                            },
                        ],
                    },
                ]}
            >
                <Rect
                    x={0}
                    y={0}
                    width={textWidth + signPostRadius * 2}
                    height={signPostRadius * 2}
                    fill={fill}
                    rx={signPostRadius}
                />
                <Text
                    onLayout={ev => {
                        setTextWidth(ev.nativeEvent.layout.width)
                    }}
                    fill={color.textOverDarkBackground}
                    fontSize="22"
                    fontFamily="GTGuardianTitlepiece-Bold"
                    x={signPostRadius * 0.9}
                    y={signPostRadius * 1.4}
                >
                    {title}
                </Text>
            </AnimatedG>
        </>
    )
}

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

    const [width, setWidth] = useState(0)

    return (
        <View
            onLayout={ev => {
                setWidth(ev.nativeEvent.layout.width)
            }}
            style={{ opacity: width !== 0 ? 1 : 0 }}
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
                    position={position.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, width - signPostRadius * 2],
                    })}
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
