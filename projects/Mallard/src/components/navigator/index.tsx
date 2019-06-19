import React, { useState, useMemo } from 'react'

import { color } from 'src/theme/color'
import { Animated, View, PanResponder } from 'react-native'
import { Scrubber } from './scrubber'
import { Background } from './background'

const scrubberRadius = 18
const stopRadius = 4

export const NavigatorSkeleton = () => {
    return (
        <View
            style={{
                height: scrubberRadius * 2,
            }}
        >
            <Background
                height={scrubberRadius}
                radius={stopRadius}
                stops={0}
                fill={color.dimText}
            />
        </View>
    )
}

const Navigator = ({
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
    const [panResponder] = useState(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onShouldBlockNativeResponder: () => true,
            onPanResponderGrant: (ev, gestureState) => {
                setScrubbing(true)
                onScrub(gestureState.x0 - scrubberRadius)
            },
            onPanResponderMove: (ev, gestureState) => {
                onScrub(gestureState.moveX - scrubberRadius)
            },
            onPanResponderEnd: (ev, gestureState) => {
                setScrubbing(false)
                onReleaseScrub(
                    gestureState.x0 + gestureState.dx - scrubberRadius,
                )
            },
        }),
    )
    const interpolatedPosition = position.interpolate({
        inputRange: [0, 1],
        outputRange: [0, width - scrubberRadius * 2],
    })

    return (
        <View
            {...panResponder.panHandlers}
            style={{
                backgroundColor: 'transparent',
            }}
            onLayout={ev => {
                setWidth(ev.nativeEvent.layout.width)
            }}
        >
            <Background
                height={scrubberRadius}
                radius={stopRadius}
                {...{ stops, fill }}
            />
            <Scrubber
                position={interpolatedPosition}
                scrubbing={scrubbing}
                fill={fill}
                radius={scrubberRadius}
            >
                {title}
            </Scrubber>
        </View>
    )
}
Navigator.defaultProps = {
    fill: color.text,
    stops: 0,
}
export { Navigator }
