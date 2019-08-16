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

const wrapNavigatorWithModal = (
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
    WithModal.router = Navigator.router

    return (WithModal as unknown) as NavigationContainer
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
        navigation[key] = wrapNavigatorWithModal(value, () => animatedValue)
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
        transitionConfig: (transitionProps, prevTransitionProps) => {
            const {
                position,
                scene: { index },
            } = transitionProps

            animatedValue = position.interpolate({
                inputRange: [index - 1, index, index + 1],
                outputRange: [0, 1, 0],
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
