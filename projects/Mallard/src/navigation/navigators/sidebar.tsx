import React from 'react'
import {
    Animated,
    Dimensions,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    Platform,
} from 'react-native'
import { NavigationContainer, NavigationInjectedProps } from 'react-navigation'
import { createStackNavigator } from 'react-navigation-stack'
const createNativeStackNavigator = require('react-native-screens/createNativeStackNavigator')
    .default
import { ariaHidden } from 'src/helpers/a11y'
import {
    supportsTransparentCards,
    supportsAnimation,
} from 'src/helpers/features'
import { safeInterpolation } from 'src/helpers/math'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { addStaticRouter } from '../helpers/base'
import {
    addStaticRouterWithPosition,
    NavigatorWrapper,
} from '../helpers/transition'
import { sidebarWidth } from './sidebar/positions'
import { screenInterpolator, mainLayerTransition } from './sidebar/transition'

const USE_SIDEBAR_ANIMATION =
    supportsTransparentCards() ||
    /* Android API Level 29; would need to test further on lower versions */
    (Platform.OS === 'android' && Platform.Version >= 29)

const overlayStyles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: color.artboardBackground,
        zIndex: 999999,
    },
})

const addViewsForMainLayer: NavigatorWrapper = (navigator, getPosition) => {
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
const addViewsForSidebarLayer: NavigatorWrapper = (navigator, getPosition) => {
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
    const backButtonStyles = mainLayerTransition()

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
                    <View
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

export const createSidebarNavigator = (
    mainRoute: any,
    sidebarRoute: {
        [name: string]: any
    },
) => {
    let animatedValue = new Animated.Value(0)

    const navigation: { [key: string]: NavigationContainer } = {
        _: USE_SIDEBAR_ANIMATION
            ? addViewsForMainLayer(mainRoute, () => animatedValue)
            : mainRoute,
    }
    for (const [key, value] of Object.entries(sidebarRoute)) {
        if (!supportsAnimation()) {
            navigation[key] = value
        } else {
            navigation[key] = USE_SIDEBAR_ANIMATION
                ? addViewsForSidebarLayer(value, () => animatedValue)
                : value
        }
    }

    // -iOS12 only use Native navigator
    if (!supportsAnimation()) {
        return createNativeStackNavigator(navigation, {
            initialRouteName: '_',
            defaultNavigationOptions: {
                gesturesEnabled: false,
            },
            headerMode: 'none',
            mode: 'card',
        })
    }

    const transitionConfig = (transitionProps: any) => {
        animatedValue = transitionProps.position
        return {
            containerStyle: {
                backgroundColor: color.artboardBackground,
            },
            screenInterpolator,
        }
    }

    const { width } = Dimensions.get('window')
    const isTablet = width >= Breakpoints.tabletVertical

    return createStackNavigator(navigation, {
        initialRouteName: '_',
        defaultNavigationOptions: {
            gesturesEnabled: false,
        },
        headerMode: 'none',
        ...(USE_SIDEBAR_ANIMATION
            ? {
                  mode: 'modal',
                  transparentCard: isTablet,
                  cardOverlayEnabled: isTablet,
                  transitionConfig,
              }
            : {}),
    })
}
