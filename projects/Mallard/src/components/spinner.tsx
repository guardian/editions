import React, { useState, useEffect } from 'react'
import { Text, View, Animated, Easing } from 'react-native'
import { ariaHidden } from 'src/helpers/a11y'
import { color } from 'src/theme/color'

const Ball = ({
    color,
    jump,
    order,
}: {
    color: string
    order: number
    jump: Animated.Value
}) => {
    return (
        <Animated.View
            style={[
                { width: 22, height: 22, margin: 2, borderRadius: 100 },
                { backgroundColor: color },
                {
                    transform: [
                        {
                            translateY: jump.interpolate({
                                inputRange: [0, 1],
                                outputRange: [-5, 5],
                            }),
                        },
                    ],
                },
            ]}
        ></Animated.View>
    )
}

const animateJumps = (value: Animated.Value, delay = 0) => {
    const duration = 400
    const useNativeDriver = true
    return Animated.sequence([
        Animated.delay(200 * delay),
        Animated.loop(
            Animated.sequence([
                Animated.timing(value, {
                    toValue: 1,
                    duration,
                    useNativeDriver,
                }),
                Animated.timing(value, {
                    toValue: 0,
                    duration,
                    useNativeDriver,
                }),
                Animated.timing(value, {
                    toValue: 1,
                    duration,
                    useNativeDriver,
                }),
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
    }, [])
    return (
        <View accessibilityLabel={'Loading content'}>
            <View {...ariaHidden} style={{ flexDirection: 'row' }}>
                <Ball
                    order={1}
                    jump={jumps[0]}
                    color={color.palette.news.main}
                ></Ball>
                <Ball
                    order={2}
                    jump={jumps[1]}
                    color={color.palette.opinion.main}
                ></Ball>
                <Ball
                    order={3}
                    jump={jumps[2]}
                    color={color.palette.sport.main}
                ></Ball>
                <Ball
                    order={4}
                    jump={jumps[3]}
                    color={color.palette.culture.main}
                ></Ball>
                <Ball
                    order={5}
                    jump={jumps[4]}
                    color={color.palette.lifestyle.main}
                ></Ball>
            </View>
        </View>
    )
}

export { Spinner }
