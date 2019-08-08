import React, { useRef, useLayoutEffect } from 'react'
import {
    getNavigationPosition,
    SaveableNavigationPositions,
} from 'src/helpers/positions'
import { Animated, StyleSheet } from 'react-native'

/*
This is part of the transition from articles to fronts
and it fades content in and out with a user chosen delay.

The build order is calculated at render time and it seems
to work but it is UGLY
*/

export interface PropTypes {
    first?: boolean
    children: Element
    position: SaveableNavigationPositions
}

const faderStyles = StyleSheet.create({
    wrapper: { width: '100%' },
})

let globalBuildOrder = 1

const Fader = ({ children, position, first }: PropTypes) => {
    const navigationPosition = getNavigationPosition(position)
    const buildOrder = useRef(globalBuildOrder)
    useLayoutEffect(() => {
        if (first) {
            globalBuildOrder = 0
            buildOrder.current = 0
        }
    }, [first])
    useLayoutEffect(() => {
        globalBuildOrder++
        buildOrder.current = globalBuildOrder
    }, [])
    useLayoutEffect(() => {
        if (globalBuildOrder > 5) globalBuildOrder = 5
    }, [globalBuildOrder])

    // for <Fader first/> we just wanna reset the count and not actually fade anything
    if (!children) {
        return null
    }

    return (
        <Animated.View
            style={[
                navigationPosition && {
                    opacity: navigationPosition.position.interpolate({
                        inputRange: [
                            0.2 + buildOrder.current / 10,
                            0.4 + buildOrder.current / 10,
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
