import React, { useState, useRef } from 'react'

import { color } from 'src/theme/color'
import { Animated, View, PanResponder, StyleSheet } from 'react-native'
import { Lozenge, MiniLozenge } from './draw/lozenge'
import { Background } from './draw/background'
import { metrics } from 'src/theme/spacing'
import { WithLayoutRectangle } from '../layout/ui/sizing/with-layout-rectangle'
import { safeInterpolation } from 'src/helpers/math'

const stopRadius = 4

const styles = StyleSheet.create({
    root: {
        height: metrics.fronts.sliderRadius * 2,
    },
    background: {
        marginHorizontal: metrics.fronts.sliderRadius - stopRadius,
    },
})

export const SliderSkeleton = () => {
    return (
        <View style={[styles.root, styles.background]}>
            <Background
                height={metrics.fronts.sliderRadius}
                radius={stopRadius}
                stops={0}
                fill={color.skeleton}
            />
        </View>
    )
}

const Slider = ({
    small = false,
    fill = color.text,
    stops = 0,
    title,
    position,
    onScrub,
    onReleaseScrub,
}: {
    small?: boolean
    title: string
    fill: string
    stops: number
    position: Animated.AnimatedInterpolation
    onScrub?: (to: number) => void
    onReleaseScrub?: (to: number) => void
}) => {
    let scrubbing = useRef(false).current
    const [panResponder] = useState(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onShouldBlockNativeResponder: () => true,
            onPanResponderGrant: (ev, gestureState) => {
                scrubbing = true
                onScrub &&
                    onScrub(gestureState.x0 - metrics.fronts.sliderRadius)
            },
            onPanResponderMove: (ev, gestureState) => {
                onScrub &&
                    onScrub(gestureState.moveX - metrics.fronts.sliderRadius)
            },
            onPanResponderEnd: (ev, gestureState) => {
                scrubbing = false
                onReleaseScrub &&
                    onReleaseScrub(
                        gestureState.x0 +
                            gestureState.dx -
                            metrics.fronts.sliderRadius,
                    )
            },
        }),
    )

    const isScrollable = stops > 1
    const isScrubbable = onScrub && isScrollable

    const lozengePosition = (width: number) =>
        isScrollable
            ? position.interpolate({
                  inputRange: safeInterpolation([0, 1]),
                  outputRange: safeInterpolation([
                      0,
                      width - metrics.fronts.sliderRadius * 2,
                  ]),
              })
            : undefined

    return (
        <WithLayoutRectangle
            fallback={<SliderSkeleton />}
            minHeight={metrics.fronts.sliderRadius}
        >
            {({ width }) => (
                <View
                    {...(isScrubbable ? panResponder.panHandlers : {})}
                    style={styles.root}
                >
                    {isScrollable ? (
                        <View style={styles.background}>
                            <Background
                                height={metrics.fronts.sliderRadius}
                                radius={stopRadius}
                                {...{ stops, fill }}
                            />
                        </View>
                    ) : null}
                    {small ? (
                        <MiniLozenge
                            position={lozengePosition(width)}
                            fill={fill}
                        >
                            {title}
                        </MiniLozenge>
                    ) : (
                        <Lozenge position={lozengePosition(width)} fill={fill}>
                            {title}
                        </Lozenge>
                    )}
                </View>
            )}
        </WithLayoutRectangle>
    )
}
export { Slider }
