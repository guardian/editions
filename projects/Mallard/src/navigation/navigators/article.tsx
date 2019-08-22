import React, { useState } from 'react'
import { Animated, StyleSheet } from 'react-native'
import {
    createStackNavigator,
    NavigationContainer,
    NavigationInjectedProps,
    NavigationRouteConfig,
    NavigationTransitionProps,
} from 'react-navigation'
import { Button } from 'src/components/button/button'
import { ClipFromTop } from 'src/components/layout/animators/clipFromTop'
import { Header } from 'src/components/layout/header/header'
import { supportsTransparentCards } from 'src/helpers/features'
import { getScreenPositionOfItem } from 'src/helpers/positions'
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
import { toPosition } from 'src/helpers/sizes'

type DismissStateChangedFn = (dismissable: boolean) => void
export interface ArticleNavigatorInjectedProps {
    onDismissStateChanged?: DismissStateChangedFn
}

const Dismissable = ({
    navigator,
    navigation,
}: {
    navigator: NavigationContainer
} & NavigationInjectedProps) => {
    const Navigator = navigator as any & ArticleNavigatorInjectedProps
    const [dismissable, setDismissable] = useState(true)
    return (
        <SlideCard
            enabled={dismissable}
            onDismiss={() => {
                navigation.goBack()
            }}
        >
            <Navigator
                onDismissStateChanged={setDismissable}
                navigation={navigation}
            />
        </SlideCard>
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
})

const wrapInBasicCard: NavigatorWrapper = Navigator => {
    const Wrapper = ({ navigation }: NavigationInjectedProps) => {
        return (
            <>
                <Header
                    leftAction={
                        <Button
                            icon={'\uE00A'}
                            alt="Back"
                            onPress={() => navigation.goBack(null)}
                        ></Button>
                    }
                    layout={'center'}
                >
                    {null}
                </Header>
                <Navigator navigation={navigation} />
            </>
        )
    }
    return addStaticRouterWithPosition(
        addStaticRouter(Navigator, Wrapper),
        () => new Animated.Value(1),
    )
}

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
        } = articleScreenMotion({
            position,
            originalPosition,
            window,
        })

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
                                borderRadius: position.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0, metrics.radius],
                                }),
                                minHeight: height / scaler,
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
    let animatedValue = new Animated.Value(1)

    const navigation: { [key: string]: NavigationContainer } = {
        [routeNames.Issue]: addStaticRouterWithPosition(
            front,
            () => animatedValue,
        ),
        [routeNames.Article]: supportsTransparentCards()
            ? wrapInSlideCard(article, () => animatedValue)
            : wrapInBasicCard(article, () => animatedValue),
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
