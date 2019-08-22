import React, { ReactNode, useEffect, useRef, useState } from 'react'
import { Animated, StyleSheet, View } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { Appearance, CAPIArticle, Collection, Front, Issue } from 'src/common'
import { MaxWidthWrap } from 'src/components/article/wrap/max-width'
import { AnimatedFlatListRef } from 'src/components/front/helpers/helpers'
import { ClipFromTop } from 'src/components/layout/animators/clipFromTop'
import { Fader } from 'src/components/layout/animators/fader'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { LoginOverlay } from 'src/components/login/login-overlay'
import { Slider } from 'src/components/slider'
import { getNavigationPosition } from 'src/helpers/positions'
import { getColor } from 'src/helpers/transform'
import { ERR_404_MISSING_PROPS } from 'src/helpers/words'
import { useAlphaIn } from 'src/hooks/use-alpha-in'
import { getAppearancePillar } from 'src/hooks/use-article'
import { useDimensions, useMediaQuery } from 'src/hooks/use-screen'
import { useIsPreview } from 'src/hooks/use-settings'
import {
    ArticleNavigationProps,
    ArticleRequiredNavigationProps,
    getArticleNavigationProps,
} from 'src/navigation/helpers/base'
import { routeNames } from 'src/navigation/routes'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { PathToArticle } from './article-screen'
import { ArticleScreenBody } from './article/body'
import { ArticleNavigatorInjectedProps } from 'src/navigation/navigators/article'

export interface PathToArticle {
    collection: Collection['key']
    front: Front['key']
    article: CAPIArticle['key']
    issue: Issue['key']
}

export interface ArticleTransitionProps {
    startAtHeightFromFrontsItem: number
}

export interface ArticleNavigator {
    articles: PathToArticle[]
    appearance: Appearance
    frontName: string
}

const getData = (
    navigator: ArticleNavigator,
    currentArticle: PathToArticle,
): {
    isInScroller: boolean
    startingPoint: number
} => {
    const startingPoint = navigator.articles.findIndex(
        ({ article }) => currentArticle.article === article,
    )
    if (startingPoint < 0) return { isInScroller: false, startingPoint: 0 }
    return { startingPoint, isInScroller: true }
}

const styles = StyleSheet.create({
    slider: {
        paddingVertical: metrics.vertical,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: color.background,
    },
    innerSlider: {
        width: '100%',
        flexShrink: 0,
        flexGrow: 1,
    },
    sliderBorder: {
        borderBottomColor: color.line,
    },
})

const ArticleScreenLoginOverlay = ({
    navigation,
    children,
}: {
    navigation: NavigationScreenProp<{}, ArticleNavigationProps>
    children: ReactNode
}) => (
    <LoginOverlay
        isFocused={() => navigation.isFocused()}
        onLoginPress={() => navigation.navigate(routeNames.SignIn)}
        onOpenCASLogin={() => navigation.navigate(routeNames.CasSignIn)}
        onDismiss={() => navigation.goBack()}
    >
        {children}
    </LoginOverlay>
)

const ArticleScreenWithProps = ({
    path,
    articleNavigator,
    onDismissStateChanged,
    navigation,
    prefersFullScreen,
}: ArticleRequiredNavigationProps &
    ArticleNavigatorInjectedProps & {
        navigation: NavigationScreenProp<{}, ArticleNavigationProps>
    }) => {
    const pillar = getAppearancePillar(articleNavigator.appearance)

    const [articleIsAtTop, setArticleIsAtTop] = useState(true)

    const { isInScroller, startingPoint } = getData(articleNavigator, path)
    const [current, setCurrent] = useState(startingPoint)

    const { width } = useDimensions()
    const flatListRef = useRef<AnimatedFlatListRef | undefined>()

    const sliderPos = useAlphaIn(200, {
        initialValue: 0,
        currentValue: current,
    }).interpolate({
        inputRange: [0, articleNavigator.articles.length - 1],
        outputRange: [0, 1],
    })

    useEffect(() => {
        flatListRef.current &&
            flatListRef.current._component.scrollToIndex({
                index: current,
                animated: false,
            })
    }, [width])

    const preview = useIsPreview()
    const previewNotice = preview ? `${path.collection}:${current}` : undefined

    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)

    return prefersFullScreen ? (
        <ArticleScreenLoginOverlay navigation={navigation}>
            <ArticleScreenBody
                path={path}
                width={width}
                pillar={pillar}
                onTopPositionChange={() => {}}
                previewNotice={previewNotice}
            />
        </ArticleScreenLoginOverlay>
    ) : (
        <ArticleScreenLoginOverlay navigation={navigation}>
            <Fader position="article">
                <View
                    style={[
                        styles.slider,
                        !articleIsAtTop && styles.sliderBorder,
                    ]}
                >
                    <MaxWidthWrap>
                        <View
                            style={[
                                styles.innerSlider,
                                isTablet && {
                                    marginHorizontal:
                                        metrics.fronts.sliderRadius * -0.8,
                                },
                            ]}
                        >
                            <Slider
                                small
                                title={articleNavigator.frontName}
                                fill={getColor(articleNavigator.appearance)}
                                stops={2}
                                position={sliderPos}
                            />
                        </View>
                    </MaxWidthWrap>
                </View>
            </Fader>
            <Animated.FlatList
                ref={(flatList: AnimatedFlatListRef) =>
                    (flatListRef.current = flatList)
                }
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
                onScroll={(ev: any) => {
                    setCurrent(
                        Math.floor(ev.nativeEvent.contentOffset.x / width),
                    )
                }}
                maxToRenderPerBatch={1}
                windowSize={3}
                initialNumToRender={1}
                horizontal={true}
                initialScrollIndex={startingPoint}
                pagingEnabled
                getItemLayout={(_: never, index: number) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
                keyExtractor={(item: ArticleNavigator['articles'][0]) =>
                    item.article
                }
                data={
                    isInScroller
                        ? articleNavigator.articles
                        : [path, ...articleNavigator.articles]
                }
                renderItem={({
                    item,
                }: {
                    item: ArticleNavigator['articles'][0]
                    index: number
                }) => (
                    <ArticleScreenBody
                        width={width}
                        path={item}
                        pillar={pillar}
                        onTopPositionChange={isAtTop => {
                            setArticleIsAtTop(isAtTop)
                            onDismissStateChanged && onDismissStateChanged(isAtTop)
                        }}
                        previewNotice={previewNotice}
                    />
                )}
            />
        </ArticleScreenLoginOverlay>
    )
}

export const ArticleScreen = ({
    navigation,
    onDismissStateChanged,
}: {
    navigation: NavigationScreenProp<{}, ArticleNavigationProps>
} & ArticleNavigatorInjectedProps) =>
    getArticleNavigationProps(navigation, {
        error: () => (
            <FlexErrorMessage
                title={ERR_404_MISSING_PROPS}
                style={{ backgroundColor: color.background }}
            />
        ),
        success: props => {
            return (
                <ArticleScreenWithProps
                    {...{ navigation, onDismissStateChanged }}
                    {...props}
                />
            )
        },
    })

ArticleScreen.navigationOptions = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => ({
    title: navigation.getParam('title', 'Loading'),
    gesturesEnabled: true,
    gestureResponseDistance: {
        vertical: metrics.headerHeight + metrics.slideCardSpacing,
    },
})
