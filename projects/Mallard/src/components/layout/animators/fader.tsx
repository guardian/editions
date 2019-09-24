import React, { useRef } from 'react'
import { Animated, Dimensions, StyleSheet, View, Image } from 'react-native'
import { clamp, safeInterpolation } from 'src/helpers/math'
import { useNavigatorPosition } from 'src/navigation/helpers/transition'

/*
This is part of the transition from articles to fronts
and it fades content in and out with a user chosen delay.

The build order goes up/down according to screen position
*/

export interface PropTypes {
    first?: boolean
    children?: Element
}

const faderStyles = StyleSheet.create({
    wrapper: { width: '100%' },
})

const Fader = ({ children }: PropTypes) => {
    const position = useNavigatorPosition()
    const buildOrder = useRef(0)
    const faderRef = useRef<View>()
    const { height } = Dimensions.get('window')
    return (
        <View style={{ backgroundColor: 'white' }}>
            {children}
            <Animated.View
                style={[
                    {
                        ...StyleSheet.absoluteFillObject,
                        height: height * 2,
                        top: -height,
                        transform: [
                            {
                                translateY: position.interpolate({
                                    inputRange: safeInterpolation([0, 0.4, 1]),
                                    outputRange: safeInterpolation([
                                        0,
                                        0,
                                        height * 2,
                                    ]),
                                }),
                            },
                        ],
                    },
                    faderStyles.wrapper,
                ]}
            >
                <Image
                    resizeMode="stretch"
                    style={[
                        StyleSheet.absoluteFillObject,
                        { width: '100%', height: '100%' },
                    ]}
                    source={require('./fade.png')}
                ></Image>
            </Animated.View>
        </View>
    )
}

export { Fader }
