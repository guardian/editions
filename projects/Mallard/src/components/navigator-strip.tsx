import React, { useState, useEffect } from 'react'

import Svg, { Circle, Text, Line, G, Rect } from 'react-native-svg'
import { color } from '../theme/color'
import { Animated, View, PanResponder } from 'react-native'

const radius = 4
const signPostRadius = 18
const AnimatedG = Animated.createAnimatedComponent(G)

const Stop = ({ fill, ...props }: { fill: string; [key: string]: any }) => {
    return <Circle r={radius} cy={signPostRadius} fill={fill} {...props} />
}

const Stops = ({ fill, stops }: { fill: string; stops: number }) => {
    const stopElements = [
        <Stop cx={radius} fill={fill} />,
        <Stop cx={'100%'} translateX={radius * -1} fill={fill} />,
    ]
    for (let i = 1; i < stops - 1; i++) {
        stopElements.push(
            <Stop cx={`${(i / (stops - 1)) * 100}%`} fill={fill} />,
        )
    }
    return <>{stopElements}</>
}

const Signpost = ({
    fill,
    title,
    position,
    containerWidth,
}: {
    fill: string
    title: string
    position: Animated.AnimatedInterpolation
    containerWidth: number
}) => {
    const [textWidth, setTextWidth] = useState(0)
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
                        opacity: textWidth
                            ? position.interpolate({
                                  inputRange: [0, 20],
                                  outputRange: [1, 0],
                              })
                            : 0,
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
                        const { width } = ev.nativeEvent.layout
                        if (width < containerWidth) {
                            setTextWidth(width)
                        }
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
    onScrub,
    onReleaseScrub,
}: {
    title: string
    fill: string
    stops: number
    position: Animated.AnimatedInterpolation
    onScrub: (to: number) => void
    onReleaseScrub: (to: number) => void
}) => {
    const [width, setWidth] = useState(0)
    const [panResponder] = useState(() =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onPanResponderStart: (evt, gestureState) => {
                onScrub(gestureState.x0 - signPostRadius)
            },
            onPanResponderMove: (evt, gestureState) => {
                onScrub(gestureState.moveX - signPostRadius)
            },
            onPanResponderEnd: (evt, gestureState) => {
                onReleaseScrub(
                    gestureState.x0 + gestureState.dx - signPostRadius,
                )
            },
        }),
    )
    return (
        <View
            onLayout={ev => {
                setWidth(ev.nativeEvent.layout.width)
            }}
            {...panResponder.panHandlers}
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
                <Stops stops={stops} fill={fill} />
                <Signpost
                    position={position.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, width - signPostRadius * 2],
                    })}
                    containerWidth={width}
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
