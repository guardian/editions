import React from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { safeInterpolation } from 'src/helpers/math'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { WithLayoutRectangle } from '../layout/ui/sizing/with-layout-rectangle'
import { Background } from './draw/background'
import { Lozenge, MiniLozenge } from './draw/lozenge'

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
}: {
    small?: boolean
    title: string
    fill: string
    stops: number
    position: Animated.AnimatedInterpolation
}) => {
    const isScrollable = stops > 1

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
                <View style={styles.root}>
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
