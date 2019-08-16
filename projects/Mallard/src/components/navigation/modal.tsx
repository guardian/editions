import React, { ReactNode } from 'react'
import { View, StyleSheet, Easing, Animated, Alert } from 'react-native'
import {
    withNavigation,
    NavigationInjectedProps,
    createStackNavigator,
    NavigationContainer,
    AnimatedValue,
} from 'react-navigation'
import { WithBreakpoints } from 'src/components/layout/ui/sizing/with-breakpoints'
import { Breakpoints } from 'src/theme/breakpoints'
import { NavigationRouteConfigMap } from 'react-navigation'

const modalStyles = StyleSheet.create({
    bg: {
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        width: '100%',
        flexGrow: 1,
        backgroundColor: 'rgba(52, 52, 52, .5)',
    },
    modal: {
        width: 400,
        height: 600,
        backgroundColor: 'red',
    },
})

const ModalForTablet = ({
    children,
    sceneIndex,
}: {
    children: ReactNode
    sceneIndex: AnimatedValue
}) => {
    return (
        <WithBreakpoints>
            {{
                [0]: () => <>{children}</>,
                [Breakpoints.tabletVertical]: () => (
                    <Animated.View
                        style={[
                            modalStyles.bg,
                            {
                                opacity: sceneIndex.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [1, 0],
                                }),
                            },
                        ]}
                    >
                        <View style={modalStyles.modal}>{children}</View>
                    </Animated.View>
                ),
            }}
        </WithBreakpoints>
    )
}

const createNestedModalNavigator = (routes: NavigationRouteConfigMap) => {
    const Navigator = createStackNavigator(routes)

    const WithModal = (withNavigation(
        ({ navigation }: NavigationInjectedProps) => {
            console.log(navigation)
            return (
                <ModalForTablet sceneIndex={new Animated.Value(0.5)}>
                    <Navigator navigation={navigation} />
                </ModalForTablet>
            )
        },
    ) as unknown) as NavigationContainer
    WithModal.router = Navigator.router
    return WithModal
}

const createModalNavigator = <T extends string>(
    topRoute: {
        [key in T]: NavigationContainer
    },
    modalRoutes: {
        [key: string]: NavigationRouteConfigMap
    },
) => {
    const navigation: { [key: string]: NavigationContainer } = { ...topRoute }

    for (const [key, value] of Object.entries(modalRoutes)) {
        navigation[key] = createNestedModalNavigator(value)
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
    })
}

export { createModalNavigator }
