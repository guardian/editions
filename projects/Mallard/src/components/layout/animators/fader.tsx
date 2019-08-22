import React, { useRef } from 'react'
import { Animated, Dimensions, StyleSheet, View } from 'react-native'
import { clamp } from 'src/helpers/math'
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

    return (
        <Animated.View
            ref={(view: { _component: unknown }) => {
                if (view && view._component)
                    faderRef.current = view._component as View
            }}
            onLayout={() => {
                faderRef.current &&
                    faderRef.current.measureInWindow((x, y) => {
                        buildOrder.current =
                            (y / Dimensions.get('window').height) * 6
                    })
            }}
            style={[
                {
                    opacity: position.interpolate({
                        /*
                        we wanna prevent any value except the final
                        one to be 1 because otherwise the animation will throw */
                        inputRange: [
                            clamp(0.2 + buildOrder.current / 10, 0, 1),
                            clamp(0.4 + buildOrder.current / 10, 0.4, 1),
                            1,
                        ],
                        outputRange: [0, 1, 1],
                    }),
                },
                faderStyles.wrapper,
            ]}
        >
            {children}
        </Animated.View>
    )
}

export { Fader }
