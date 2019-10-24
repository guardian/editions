import React from 'react'
import {
    Animated,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
} from 'react-native'
import {
    createStackNavigator,
    NavigationContainer,
    NavigationInjectedProps,
    NavigationRouteConfig,
    NavigationTransitionProps,
} from 'react-navigation'
import { ariaHidden } from 'src/helpers/a11y'
import { supportsTransparentCards } from 'src/helpers/features'
import { safeInterpolation } from 'src/helpers/math'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { addStaticRouter } from '../helpers/base'
import {
    addStaticRouterWithPosition,
    NavigatorWrapper,
} from '../helpers/transition'
import { sidebarWidth } from './underlay/positions'
import { screenInterpolator, topLayerTransition } from './underlay/transition'

const overlayStyles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: color.artboardBackground,
        zIndex: 999999,
    },
})

const addViewsForTopLayer: NavigatorWrapper = (navigator, getPosition) => {
    const Navigator = addStaticRouterWithPosition(navigator, getPosition)
    const Wrapper = ({ navigation }: NavigationInjectedProps) => {
        const posi = getPosition()
        return (
            <>
                <Animated.View
                    {...ariaHidden}
                    pointerEvents="none"
                    style={[
                        overlayStyles.root,
                        {
                            opacity: posi.interpolate({
                                inputRange: safeInterpolation([0, 1]),
                                outputRange: safeInterpolation([0, 0.33]),
                            }),
                        },
                    ]}
                />
                <Navigator navigation={navigation} />
            </>
        )
    }
    return addStaticRouter(navigator, Wrapper)
}

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
                <TouchableWithoutFeedback
                    onPressIn={() => {
                        navigation.goBack()
                    }}
                >
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFillObject,
                            backButtonStyles,
                        ]}
                    />
                </TouchableWithoutFeedback>
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
        _: supportsTransparentCards()
            ? addViewsForTopLayer(top, () => animatedValue)
            : top,
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
