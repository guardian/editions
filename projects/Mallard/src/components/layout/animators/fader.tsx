import React from 'react'
import {
    getNavigationPosition,
    NavigationPosition,
    SaveableNavigationPositions,
} from 'src/helpers/positions'
import { Animated } from 'react-native'

const animationStyles = (
    navigationPosition: NavigationPosition | undefined,
    delay: number = 1,
) =>
    navigationPosition && {
        opacity: navigationPosition.position.interpolate({
            inputRange: [0.4 + 0.2 / delay, 0.7, 1],
            outputRange: [0, 1, 1],
        }),
    }

export interface PropTypes {
    delay: number
    children: Element
    position: SaveableNavigationPositions
}

const Fader = ({ delay, children, position }: PropTypes) => {
    const navigationPosition = getNavigationPosition(position)
    return (
        <Animated.View
            style={[
                animationStyles(navigationPosition, delay),
                { width: '100%' },
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
