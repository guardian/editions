import React from 'react'
import {
    getNavigationPosition,
    SaveableNavigationPositions,
} from 'src/helpers/positions'
import { Animated } from 'react-native'

/*
This is part of the transition from articles to fronts
and it fades content in and out with a user chosen delay.

The build order is an int 1-X on purpose to abstract the details
of how and when to fade to this component. We will likely
wanna mess with the actual animation numbers later on to make them
more/less staggered
*/

export interface PropTypes {
    buildOrder: number
    children: Element
    position: SaveableNavigationPositions
}

const Fader = ({ buildOrder, children, position }: PropTypes) => {
    const navigationPosition = getNavigationPosition(position)
    if (buildOrder === 0) {
        buildOrder = 0.1
    }
    return (
        <Animated.View
            style={[
                navigationPosition && {
                    opacity: navigationPosition.position.interpolate({
                        inputRange: [0.4 + 0.2 / buildOrder, 0.7, 1],
                        outputRange: [0, 1, 1],
                    }),
                },
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
