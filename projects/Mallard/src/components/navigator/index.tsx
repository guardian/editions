import React, { useState, useRef } from 'react'

import { color } from 'src/theme/color'
import { Animated, View, PanResponder, StyleSheet } from 'react-native'
import { Lozenge } from './lozenge'
import { Background } from './background'
import { WithBreakpoints } from '../layout/ui/with-breakpoints'
import { metrics } from 'src/theme/spacing'

const stopRadius = 4

const styles = StyleSheet.create({
    root: {
        height: metrics.fronts.scrubberRadius * 2,
    },
    background: {
        marginHorizontal: metrics.fronts.scrubberRadius - stopRadius,
    },
})

export const NavigatorSkeleton = () => {
    return (
        <View style={[styles.root, styles.background]}>
            <Background
                height={metrics.fronts.scrubberRadius}
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
    const [panResponder] = useState(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderTerminationRequest: () => false,
            onShouldBlockNativeResponder: () => true,
            onPanResponderGrant: (ev, gestureState) => {
                scrubbing = true
                onScrub &&
                    onScrub(gestureState.x0 - metrics.fronts.scrubberRadius)
            },
            onPanResponderMove: (ev, gestureState) => {
                onScrub &&
                    onScrub(gestureState.moveX - metrics.fronts.scrubberRadius)
            },
            onPanResponderEnd: (ev, gestureState) => {
                scrubbing = false
                onReleaseScrub &&
                    onReleaseScrub(
                        gestureState.x0 +
                            gestureState.dx -
                            metrics.fronts.scrubberRadius,
                    )
            },
        }),
    )

    const isScrollable = stops > 1
    const isScrubbable = onScrub && isScrollable

    return (
        <WithBreakpoints minHeight={metrics.fronts.scrubberRadius}>
            {{
                [0]: ({ width }) => (
                    <View
                        {...(isScrubbable ? panResponder.panHandlers : {})}
                        style={styles.root}
                    >
                        {isScrollable ? (
                            <View style={styles.background}>
                                <Background
                                    height={metrics.fronts.scrubberRadius}
                                    radius={stopRadius}
                                    {...{ stops, fill }}
                                />
                            </View>
                        ) : null}
                        <Lozenge
                            position={
                                isScrollable
                                    ? position.interpolate({
                                          inputRange: [0, 1],
                                          outputRange: [
                                              0,
                                              width -
                                                  metrics.fronts
                                                      .scrubberRadius *
                                                      2,
                                          ],
                                      })
                                    : undefined
                            }
                            scrubbing={scrubbing}
                            fill={fill}
                            radius={metrics.fronts.scrubberRadius}
                        >
                            {title}
                        </Lozenge>
                    </View>
                ),
            }}
        </WithBreakpoints>
    )
}
Navigator.defaultProps = {
    fill: color.text,
    stops: 0,
}
export { Navigator }
