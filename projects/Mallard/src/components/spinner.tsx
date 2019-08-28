import React, { useState, useEffect } from 'react'
import { View, Animated, StyleSheet } from 'react-native'
import { ariaHidden } from 'src/helpers/a11y'
import { color } from 'src/theme/color'
import { safeInterpolation } from 'src/helpers/math'

const styles = StyleSheet.create({
    ball: {
        width: 22,
        height: 22,
        margin: 2,
        borderRadius: 100,
    },
    container: { flexDirection: 'row', padding: 5 },
})

const pillars = [
    color.palette.news.main,
    color.palette.opinion.main,
    color.palette.sport.main,
    color.palette.culture.main,
    color.palette.lifestyle.main,
]

const Ball = ({ color, jump }: { color: string; jump: Animated.Value }) => {
    return (
        <Animated.View
            style={[
                styles.ball,
                { backgroundColor: color },
                {
                    transform: [
                        {
                            translateY: jump.interpolate({
                                inputRange: safeInterpolation([0, 1]),
                                outputRange: safeInterpolation([-5, 5]),
                            }),
                        },
                    ],
                },
            ]}
        ></Animated.View>
    )
}

const animateJumps = (value: Animated.Value, delay = 0) => {
    const makeTimingConfig = (toValue: number) => ({
        toValue,
        duration: 400,
        useNativeDriver: true,
    })

    return Animated.sequence([
        Animated.delay(200 * delay),
        Animated.loop(
            Animated.sequence([
                Animated.timing(value, makeTimingConfig(1)),
                Animated.timing(value, makeTimingConfig(0)),
                Animated.timing(value, makeTimingConfig(0)),
            ]),
        ),
    ])
}

const Spinner = () => {
    const [jumps] = useState(() => [
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
        new Animated.Value(0),
    ])
    useEffect(() => {
        Animated.parallel(jumps.map((j, i) => animateJumps(j, i))).start()
    }, [jumps])
    return (
        <View accessibilityLabel={'Loading content'}>
            <View {...ariaHidden} style={styles.container}>
                {pillars.map((color, index) => (
                    <Ball key={index} jump={jumps[index]} color={color}></Ball>
                ))}
            </View>
        </View>
    )
}

export { Spinner }
