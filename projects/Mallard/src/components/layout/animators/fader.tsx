import React, { useRef } from 'react'
import {
    getNavigationPosition,
    SaveableNavigationPositions,
} from 'src/helpers/positions'
import { Animated, StyleSheet, View, Dimensions } from 'react-native'

/*
This is part of the transition from articles to fronts
and it fades content in and out with a user chosen delay.

The build order goes up/down according to screen position
*/

export interface PropTypes {
    first?: boolean
    children?: Element
    position: SaveableNavigationPositions
}

const faderStyles = StyleSheet.create({
    wrapper: { width: '100%' },
})

const clamp = (number: number, min: number, max: number) => {
    if (number > max) return max
    if (number < min) return min
    return number
}

const Fader = ({ children, position }: PropTypes) => {
    const navigationPosition = getNavigationPosition(position)
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
                navigationPosition && {
                    opacity: navigationPosition.position.interpolate({
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

const getFader = (position: PropTypes['position']) => (
    props: Omit<PropTypes, 'position'>,
) => {
    return <Fader position={position} {...props}></Fader>
}

export { Fader, getFader }
