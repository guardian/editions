import React, { useMemo } from 'react'
import {
    Animated,
    Dimensions,
    PanResponder,
    StyleSheet,
    View,
} from 'react-native'
import {
    createStackNavigator,
    NavigationContainer,
    NavigationInjectedProps,
    NavigationRouteConfig,
    NavigationTransitionProps,
} from 'react-navigation'
import { supportsTransparentCards } from 'src/helpers/features'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { addStaticRouter } from '../helpers/base'
import {
    addStaticRouterWithPosition,
    NavigatorWrapper,
} from '../helpers/transition'
import { sidebarWidth } from './underlay/positions'
import { screenInterpolator, topLayerTransition } from './underlay/transition'

const bottomStyles = StyleSheet.create({
    content: {
        flex: 1,
    },
    contentTablet: {
        maxWidth: sidebarWidth,
        alignSelf: 'flex-end',
    },
})
const addViewsForBottomLayer: NavigatorWrapper = (navigator, getPosition) => {
    const Navigator = addStaticRouterWithPosition(navigator, getPosition)
    const isTablet =
        Dimensions.get('window').width >= Breakpoints.tabletVertical

    /*
    on this bottom layer we wanna add a 'touchable' that goes back
    in the size and position of the visible parts of the top
    layer (eg. the issue list shows a bit of the previous issue.
    we want a touchable there).
    This gives the user the illusion that by tapping on the bit of
    the previous screen they see, they are bringing it back into focus
    */
    const backButtonStyles = topLayerTransition(new Animated.Value(1), 0)
    const Wrapper = ({ navigation }: NavigationInjectedProps) => {
        const panResponder = useMemo(
            () =>
                PanResponder.create({
                    onMoveShouldSetPanResponderCapture: () => {
                        return true
                    },
                    onStartShouldSetPanResponderCapture: () => {
                        return true
                    },
                    onPanResponderMove: (ev, gesture) => {
                        const points = [gesture.dx, gesture.dy].map(Math.abs)
                        if (Math.max(...points) > 10) {
                            navigation.pop()
                        }
                    },
                    onPanResponderRelease: () => {
                        navigation.pop()
                    },
                }),
            [],
        )

        return (
            <>
                <View
                    style={[
                        bottomStyles.content,
                        isTablet && bottomStyles.contentTablet,
                    ]}
                >
                    <Navigator navigation={navigation} />
                </View>
                <Animated.View
                    style={[backButtonStyles, { overflow: 'visible' }]}
                    {...panResponder.panHandlers}
                />
            </>
        )
    }
    return addStaticRouter(navigator, Wrapper)
}

const createUnderlayNavigator = (
    top: NavigationRouteConfig,
    bottom: {
        [name: string]: NavigationRouteConfig
    },
) => {
    let animatedValue = new Animated.Value(0)

    const navigation: { [key: string]: NavigationContainer } = {
        _: top,
    }
    for (const [key, value] of Object.entries(bottom)) {
        navigation[key] = supportsTransparentCards()
            ? addViewsForBottomLayer(value, () => animatedValue)
            : value
    }

    const transitionConfig = (transitionProps: NavigationTransitionProps) => {
        animatedValue = transitionProps.position
        return {
            containerStyle: {
                backgroundColor: color.artboardBackground,
            },
            screenInterpolator,
        }
    }

    return createStackNavigator(navigation, {
        initialRouteName: '_',
        defaultNavigationOptions: {
            gesturesEnabled: false,
        },
        headerMode: 'none',
        ...(supportsTransparentCards()
            ? {
                  mode: 'modal',
                  transparentCard: true,
                  cardOverlayEnabled: true,
                  transitionConfig,
              }
            : {}),
    })
}

export { createUnderlayNavigator }
