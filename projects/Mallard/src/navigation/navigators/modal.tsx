import {
    NavigationContainer,
    AnimatedValue,
    NavigationInjectedProps,
    createStackNavigator,
    StackViewTransitionConfigs,
} from 'react-navigation'

import React from 'react'

import { Animated } from 'react-native'
import { ModalForTablet } from 'src/components/layout/ui/modal-for-tablet'
import { addStaticRouter } from '../helpers/base'
import { safeInterpolation } from 'src/helpers/math'

const addStaticRouterWithModal = (
    Navigator: NavigationContainer,
    getPosition: () => AnimatedValue,
): NavigationContainer => {
    const WithModal = ({ navigation }: NavigationInjectedProps) => {
        return (
            <ModalForTablet position={getPosition()}>
                <Navigator navigation={navigation} />
            </ModalForTablet>
        )
    }
    return addStaticRouter(Navigator, WithModal)
}

const createModalNavigator = (
    parent: NavigationContainer,
    modalRoutes: {
        [key: string]: NavigationContainer
    },
) => {
    let animatedValue = new Animated.Value(0)

    const navigation: { [key: string]: NavigationContainer } = { _: parent }
    for (const [key, value] of Object.entries(modalRoutes)) {
        navigation[key] = addStaticRouterWithModal(value, () => animatedValue)
    }

    return createStackNavigator(navigation, {
        mode: 'modal',
        headerMode: 'none',
        transparentCard: true,
        cardOverlayEnabled: true,
        initialRouteName: '_',
        defaultNavigationOptions: {
            gesturesEnabled: false,
        },
        cardStyle: { opacity: 1 },
        transitionConfig: (transitionProps, prevTransitionProps) => {
            const {
                position,
                scene: { index },
            } = transitionProps

            animatedValue = position.interpolate({
                inputRange: safeInterpolation([index - 1, index, index + 1]),
                outputRange: safeInterpolation([0, 1, 0]),
            })
            return StackViewTransitionConfigs.defaultTransitionConfig(
                transitionProps,
                prevTransitionProps,
                true,
            )
        },
    })
}

export { createModalNavigator }
