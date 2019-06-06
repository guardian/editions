import React, { useState, useEffect, useMemo } from 'react'

import Svg, { Circle, Line } from 'react-native-svg'
import { color } from '../../theme/color'
import { Animated, View, PanResponder } from 'react-native'
import { signPostRadius, radius } from './helpers'
import { Scrubber } from './scrubber'

const Stops = ({ fill, stops }: { fill: string; stops: number }) => {
    const Stop = ({ fill, ...props }: { fill: string; [key: string]: any }) => {
        return <Circle r={radius} cy={signPostRadius} fill={fill} {...props} />
    }
    const stopElements = [
        <Line
            x1="0"
            y1={signPostRadius}
            x2="100%"
            y2={signPostRadius}
            stroke={fill}
        />,
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
    const [scrubbing, setScrubbing] = useState(false)
    const [panResponder] = useState(() =>
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onPanResponderStart: (evt, gestureState) => {
                onScrub(gestureState.x0 - signPostRadius)
                setScrubbing(true)
            },
            onPanResponderMove: (evt, gestureState) => {
                onScrub(gestureState.moveX - signPostRadius)
            },
            onPanResponderEnd: (evt, gestureState) => {
                setScrubbing(false)
                onReleaseScrub(
                    gestureState.x0 + gestureState.dx - signPostRadius,
                )
            },
        }),
    )
    const scaledPosition = useMemo(
        () =>
            position.interpolate({
                inputRange: [0, 1],
                outputRange: [0, width - signPostRadius * 2],
            }),
        [width],
    )
    return (
        <View
            {...panResponder.panHandlers}
            onLayout={ev => {
                setWidth(ev.nativeEvent.layout.width)
            }}
        >
            <Svg
                width="100%"
                height={signPostRadius * 2}
                style={{ overflow: 'visible', position: 'absolute' }}
            >
                <Stops stops={stops} fill={fill} />
            </Svg>
            <Scrubber
                position={scaledPosition}
                scrubbing={scrubbing}
                style={{
                    transform: [
                        {
                            translateX: scaledPosition,
                        },
                    ],
                }}
                fill={fill}
            >
                {title}
            </Scrubber>
        </View>
    )
}
NavigatorStrip.defaultProps = {
    fill: color.text,
    stops: 3,
}
export { NavigatorStrip }
