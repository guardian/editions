import React, { useRef } from 'react'
import { Animated, StyleSheet, View, Dimensions } from 'react-native'
import {
    createStackNavigator,
    NavigationContainer,
    NavigationInjectedProps,
    NavigationRouteConfig,
    NavigationTransitionProps,
} from 'react-navigation'
import { supportsTransparentCards } from 'src/helpers/features'
import { color } from 'src/theme/color'
import { SlideCard } from '../../components/layout/slide-card/index'
import { addStaticRouter } from '../helpers/base'
import {
    addStaticRouterWithPosition,
    NavigatorWrapper,
} from '../helpers/transition'
import { screenInterpolator, getScaleForArticle } from './article/transition'
import { routeNames } from '../routes'
import { getScreenPositionOfItem } from 'src/helpers/positions'
import { metrics } from 'src/theme/spacing'
import { ClipFromTop } from 'src/components/layout/animators/clipFromTop'

const overlayStyles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: color.artboardBackground,
        zIndex: 999999,
    },
})

const addStaticRouterWithOverlay: NavigatorWrapper = (
    navigator,
    getPosition,
) => {
    const Navigator = addStaticRouterWithPosition(navigator, getPosition)
    const Wrapper = ({ navigation }: NavigationInjectedProps) => {
        const position = getPosition()
        const viewRef = useRef<{ _component: View }>(null)
        //const isClosing = position.__getValue() === 1
        const isClosing = false

        /*
        we are assuming our final article
        will cover the entire screen here
        */
        const { width: windowWidth, height: windowHeight } = Dimensions.get(
            'window',
        )
        const { x, y, width, height } = getScreenPositionOfItem(
            navigation.getParam('path').article,
        )

        /*
        subtly blend the actual article page
        and its card so it's a bit less jarring
        */
        const opacity = position.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1],
        })

        const opacityOuter = position.interpolate({
            inputRange: [0, 0.1, 1],
            outputRange: [0, 1, 1],
        })

        /*
        we need to scale the article's X to
        whatever its card width is
        */
        const scaler = getScaleForArticle(width)

        const scale = isClosing
            ? position.interpolate({
                  inputRange: [0, 0.1, 1],
                  outputRange: [scaler, scaler, 1],
              })
            : position.interpolate({
                  inputRange: [0, 1],
                  outputRange: [scaler, 1],
              })

        /*
        yScaleDiff calculates how many pixels we need to offset
        our y translate to account for the scale
        */
        const distanceFromVCenter = y - windowHeight / 2
        const d = (windowHeight / 2) * scaler + distanceFromVCenter
        const translateY = position.interpolate({
            inputRange: [0, 1],
            outputRange: [d, metrics.slideCardSpacing],
        })

        /*
        If the card is half width we
        need to move it to its side at the start
        */
        const distanceFromCentre = width / 2 + x - windowWidth / 2
        const translateX = position.interpolate({
            inputRange: [0, 1],
            outputRange: [distanceFromCentre, 0],
        })

        return (
            <Animated.View
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        transform: [{ translateX }, { translateY }, { scale }],
                    },
                ]}
            >
                <ClipFromTop easing={position} from={height / scaler}>
                    <Animated.View
                        style={[
                            StyleSheet.absoluteFillObject,
                            {
                                opacity: opacityOuter,
                                backgroundColor: color.background,
                                borderRadius: position.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, metrics.radius],
                                }),
                            },
                            {
                                minHeight: height / scaler,
                                height: '100%',
                                flexGrow: 1,
                                overflow: 'hidden',
                            },
                            {
                                marginBottom: metrics.slideCardSpacing,
                            },
                        ]}
                    >
                        <Animated.View
                            style={[
                                StyleSheet.absoluteFillObject,
                                {
                                    height: windowHeight,
                                },
                                { opacity },
                            ]}
                        >
                            <SlideCard
                                enabled={false}
                                onDismiss={() => {
                                    navigation.goBack()
                                }}
                            >
                                <Navigator navigation={navigation} />
                            </SlideCard>
                        </Animated.View>
                    </Animated.View>
                </ClipFromTop>
            </Animated.View>
        )
    }
    return addStaticRouter(navigator, Wrapper)
}

const createArticleNavigator = (
    front: NavigationRouteConfig,
    article: {
        [name: string]: NavigationRouteConfig
    },
) => {
    let animatedValue = new Animated.Value(0)

    const navigation: { [key: string]: NavigationContainer } = {
        [routeNames.Issue]: addStaticRouterWithPosition(
            front,
            () => animatedValue,
        ),
    }
    for (const [key, value] of Object.entries(article)) {
        navigation[key] = addStaticRouterWithOverlay(value, () => animatedValue)
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
        initialRouteName: routeNames.Issue,
        defaultNavigationOptions: {
            gesturesEnabled: true,
        },
        ...(supportsTransparentCards()
            ? {
                  mode: 'modal',
                  headerMode: 'none',
                  transparentCard: true,
                  cardOverlayEnabled: true,
                  transitionConfig,
              }
            : {}),
    })
}

export { createArticleNavigator }
