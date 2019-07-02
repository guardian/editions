import React, { useState, useRef } from 'react'

import { color } from 'src/theme/color'
import { Animated, View, PanResponder, StyleSheet } from 'react-native'
import { Lozenge } from './lozenge'
import { Background } from './background'

const scrubberRadius = 18
const stopRadius = 4

const styles = StyleSheet.create({
    root: {
        height: scrubberRadius * 2,
    },
    background: {
        marginHorizontal: scrubberRadius - stopRadius,
    },
})

export const NavigatorSkeleton = () => {
    return (
        <View style={[styles.root, styles.background]}>
            <Background
                height={scrubberRadius}
                radius={stopRadius}
                stops={0}
                fill={color.skeleton}
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
    onScrub?: (to: number) => void
    onReleaseScrub?: (to: number) => void
}) => {
    let scrubbing = useRef(false).current
    const [width, setWidth] = useState(0)
    const [panResponder] = useState(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onShouldBlockNativeResponder: () => true,
            onPanResponderGrant: (ev, gestureState) => {
                scrubbing = true
                onScrub && onScrub(gestureState.x0 - scrubberRadius)
            },
            onPanResponderMove: (ev, gestureState) => {
                onScrub && onScrub(gestureState.moveX - scrubberRadius)
            },
            onPanResponderEnd: (ev, gestureState) => {
                scrubbing = false
                onReleaseScrub &&
                    onReleaseScrub(
                        gestureState.x0 + gestureState.dx - scrubberRadius,
                    )
            },
        }),
    )

    return (
        <View
            {...(onScrub ? panResponder.panHandlers : {})}
            style={styles.root}
            onLayout={ev => {
                setWidth(ev.nativeEvent.layout.width)
            }}
        >
            <View style={styles.background}>
                <Background
                    height={scrubberRadius}
                    radius={stopRadius}
                    {...{ stops, fill }}
                />
            </View>
            <Lozenge
                position={position.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, width - scrubberRadius * 2],
                })}
                scrubbing={scrubbing}
                fill={fill}
                radius={scrubberRadius}
            >
                {title}
            </Lozenge>
        </View>
    )
}
Navigator.defaultProps = {
    fill: color.text,
    stops: 0,
}
export { Navigator }
