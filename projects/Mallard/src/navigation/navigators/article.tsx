import React, { useState, FunctionComponent } from 'react'
import { Animated, Easing, StyleSheet } from 'react-native'
import {
    createStackNavigator,
    NavigationContainer,
    NavigationInjectedProps,
    NavigationRouteConfig,
    NavigationTransitionProps,
} from 'react-navigation'
import { Button, ButtonAppearance } from 'src/components/button/button'
import { ClipFromTop } from 'src/components/layout/animators/clipFromTop'
import { Header } from 'src/components/layout/header/header'
import { supportsTransparentCards } from 'src/helpers/features'
import { getScreenPositionOfItem } from 'src/navigation/navigators/article/positions'
import { useDimensions } from 'src/hooks/use-screen'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { SlideCard } from '../../components/layout/slide-card/index'
import { addStaticRouter } from '../helpers/base'
import {
    addStaticRouterWithPosition,
    NavigatorWrapper,
} from '../helpers/transition'
import { routeNames } from '../routes'
import { articleScreenMotion, screenInterpolator } from './article/transition'
import { safeInterpolation, safeValue } from 'src/helpers/math'

type DismissStateChangedFn = (dismissable: boolean) => void
export interface ArticleNavigatorInjectedProps {
    onDismiss: () => void
}

const Dismissable = ({
    navigator,
    navigation,
}: {
    navigator: NavigationContainer
} & NavigationInjectedProps) => {
    const Navigator = (navigator as unknown) as FunctionComponent<
        ArticleNavigatorInjectedProps & NavigationInjectedProps
    >

    const onDismiss = () => navigation.goBack()

    return (
        <SlideCard onDismiss={onDismiss}>
            <Navigator navigation={navigation} onDismiss={onDismiss} />
        </SlideCard>
    )
}

const BasicCardWrapper = ({
    navigator,
    navigation,
}: {
    navigator: NavigationContainer
} & NavigationInjectedProps) => {
    const Navigator = (navigator as unknown) as FunctionComponent<
        ArticleNavigatorInjectedProps & NavigationInjectedProps
    >
    return (
        <>
            <Header
                white
                leftAction={
                    <Button
                        appearance={ButtonAppearance.skeleton}
                        icon={'\uE00A'}
                        alt="Back"
                        onPress={() => navigation.goBack(null)}
                    ></Button>
                }
                layout={'center'}
            >
                {null}
            </Header>
            <Navigator
                navigation={navigation}
                onDismiss={() => navigation.goBack()}
            />
        </>
    )
}

const wrapInBasicCard: NavigatorWrapper = Navigator => {
    const Wrapper = ({ navigation }: NavigationInjectedProps) => (
        <BasicCardWrapper navigator={Navigator} navigation={navigation} />
    )
    return addStaticRouterWithPosition(
        addStaticRouter(Navigator, Wrapper),
        () => new Animated.Value(1),
    )
}

const styles = StyleSheet.create({
    root: {
        ...StyleSheet.absoluteFillObject,
    },
    inner: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: color.background,
        height: '100%',
        flexGrow: 1,
        overflow: 'hidden',
        marginBottom: metrics.slideCardSpacing,
    },
    basicCard: { backgroundColor: color.background, overflow: 'hidden' },
})
const wrapInSlideCard: NavigatorWrapper = (navigator, getPosition) => {
    const Navigator = addStaticRouterWithPosition(navigator, getPosition)
    const Wrapper = ({ navigation }: NavigationInjectedProps) => {
        const position = getPosition()
        const originalPosition = getScreenPositionOfItem(
            navigation.getParam('path').article,
        )
        const window = useDimensions()

        const { height } = originalPosition
        const {
            opacity,
            opacityOuter,
            scaler,
            transform,
            borderRadius,
        } = articleScreenMotion({
            position,
            originalPosition,
            window,
        })

        if (navigation.getParam('prefersFullScreen', false)) {
            return (
                <Animated.View
                    style={[
                        StyleSheet.absoluteFillObject,
                        styles.basicCard,
                        {
                            transform: [
                                {
                                    translateY: position.interpolate({
                                        inputRange: safeInterpolation([0, 1]),
                                        outputRange: safeInterpolation([
                                            200,
                                            0,
                                        ]),
                                    }),
                                },
                            ],
                        },
                        {
                            opacity: position.interpolate({
                                inputRange: safeInterpolation([0, 0.5]),
                                outputRange: safeInterpolation([0, 1]),
                            }),
                        },
                    ]}
                >
                    <BasicCardWrapper
                        navigator={Navigator}
                        navigation={navigation}
                    />
                </Animated.View>
            )
        }
        return (
            <Animated.View
                style={[
                    styles.root,
                    {
                        transform,
                    },
                ]}
            >
                <ClipFromTop easing={position} from={height / scaler}>
                    <Animated.View
                        style={[
                            styles.inner,
                            {
                                opacity: opacityOuter,
                                borderRadius,
                                minHeight: safeValue(height / scaler, 1000),
                            },
                        ]}
                    >
                        <Animated.View
                            style={[
                                StyleSheet.absoluteFillObject,
                                {
                                    height:
                                        window.height -
                                        metrics.slideCardSpacing,
                                },
                                { opacity },
                            ]}
                        >
                            <Dismissable
                                navigator={Navigator}
                                navigation={navigation}
                            />
                        </Animated.View>
                    </Animated.View>
                </ClipFromTop>
            </Animated.View>
        )
    }
    return addStaticRouterWithPosition(
        addStaticRouter(navigator, Wrapper),
        getPosition,
    )
}

const createArticleNavigator = (
    front: NavigationRouteConfig,
    article: NavigationRouteConfig,
) => {
    let animatedValue = new Animated.Value(0)

    const navigation: { [key: string]: NavigationContainer } = {
        [routeNames.Issue]: addStaticRouterWithPosition(
            front,
            () => animatedValue,
        ),
        [routeNames.Article]: supportsTransparentCards()
            ? wrapInSlideCard(article, () => animatedValue)
            : wrapInBasicCard(article, () => new Animated.Value(1)),
    }

    const transitionConfig = (transitionProps: NavigationTransitionProps) => {
        animatedValue = transitionProps.position
        return {
            containerStyle: {
                backgroundColor: color.artboardBackground,
            },
            easing: Easing.elastic(1),
            screenInterpolator,
        }
    }

    return createStackNavigator(navigation, {
        initialRouteName: routeNames.Issue,
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

export { createArticleNavigator }
