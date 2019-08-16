import React, { ReactNode } from 'react'
import { View, StyleSheet, Easing, Animated, Alert } from 'react-native'
import {
    withNavigation,
    NavigationInjectedProps,
    createStackNavigator,
    NavigationContainer,
    AnimatedValue,
    StackViewTransitionConfigs,
} from 'react-navigation'
import { WithBreakpoints } from 'src/components/layout/ui/sizing/with-breakpoints'
import { Breakpoints } from 'src/theme/breakpoints'
import { NavigationRouteConfigMap } from 'react-navigation'
import { NavigationTransitionProps } from 'react-navigation'
import { StackNavigatorConfig } from 'react-navigation'

const modalStyles = StyleSheet.create({
    root: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        flexGrow: 1,
    },
    bg: {
        backgroundColor: 'rgba(52, 52, 52, .5)',
        transform: [{ scaleY: 10 }],
        zIndex: 0,
        ...StyleSheet.absoluteFillObject,
    },
    modal: {
        width: 400,
        height: 600,
        backgroundColor: 'red',
        zIndex: 1,
    },
})

const ModalForTablet = ({
    children,
    position,
}: {
    children: ReactNode
    position: AnimatedValue
}) => {
    return (
        <WithBreakpoints>
            {{
                [0]: () => <>{children}</>,
                [Breakpoints.tabletVertical]: () => (
                    <View style={[modalStyles.root]}>
                        <View style={modalStyles.modal}>{children}</View>
                        <Animated.View
                            style={[
                                modalStyles.bg,
                                {
                                    opacity: position.interpolate({
                                        inputRange: [0, 0.9, 1],
                                        outputRange: [0, 0, 1],
                                    }),
                                },
                            ]}
                        />
                    </View>
                ),
            }}
        </WithBreakpoints>
    )
}

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

const createModalNavigator = <T extends string>(
    topRoute: {
        [key in T]: NavigationContainer
    },
    modalRoutes: {
        [key: string]: NavigationContainer
    },
) => {
    let animatedValue = new Animated.Value(0)

    const navigation: { [key: string]: NavigationContainer } = { ...topRoute }
    for (const [key, value] of Object.entries(modalRoutes)) {
        navigation[key] = wrapNavigatorWithModal(value, () => animatedValue)
    }

    return createStackNavigator(navigation, {
        mode: 'modal',
        headerMode: 'none',
        transparentCard: true,
        cardOverlayEnabled: true,
        initialRouteName: Object.keys(topRoute)[0],
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
