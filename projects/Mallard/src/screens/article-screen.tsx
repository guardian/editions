import React, { useState } from 'react'
import { useArticleResponse } from 'src/hooks/use-issue'
import {
    NavigationScreenProp,
    NavigationEvents,
    ScrollView,
} from 'react-navigation'
import { ArticleController } from 'src/components/article'
import {
    CAPIArticle,
    Collection,
    Front,
    articlePillars,
    Appearance,
    articleTypes,
    Issue,
    PillarFromPalette,
} from 'src/common'
import { Dimensions, Animated, Text, View, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { SlideCard } from 'src/components/layout/slide-card/index'
import { color } from 'src/theme/color'
import { PathToArticle } from './article-screen'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { ERR_404_MISSING_PROPS } from 'src/helpers/words'
import { ClipFromTop } from 'src/components/layout/animators/clipFromTop'
import { useSettings } from 'src/hooks/use-settings'
import { Button } from 'src/components/button/button'
import { getNavigationPosition } from 'src/helpers/positions'
import {
    ArticleNavigationProps,
    getArticleNavigationProps,
    ArticleRequiredNavigationProps,
} from 'src/navigation/helpers'
import { Navigator } from 'src/components/navigator'
import { useAlphaIn } from 'src/hooks/use-alpha-in'
import { getColor } from 'src/helpers/transform'
import { WithArticle, getAppearancePillar } from 'src/hooks/use-article'
import { LoginOverlay } from 'src/components/login/login-overlay'
import { routeNames } from 'src/navigation/routes'
import { WithBreakpoints } from 'src/components/layout/ui/sizing/with-breakpoints'
import { useDimensions } from 'src/hooks/use-screen'
import { UiBodyCopy } from 'src/components/styled-text'
import { isPreview } from 'src/helpers/settings/defaults'

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

const styles = StyleSheet.create({
    flex: { flexGrow: 1 },
})

const ArticleScreenBody = ({
    path,
    onTopPositionChange,
    pillar,
    width,
    previewNotice,
}: {
    path: PathToArticle
    onTopPositionChange: (isAtTop: boolean) => void
    pillar: PillarFromPalette
    width: number
    previewNotice?: string
}) => {
    const [modifiedPillar, setPillar] = useState(
        articlePillars.indexOf(pillar) || 0,
    )
    const [modifiedType, setType] = useState(0)
    const articleResponse = useArticleResponse(path)
    const [{ isUsingProdDevtools }] = useSettings()

    return (
        <ScrollView
            scrollEventThrottle={8}
            onScroll={ev => {
                onTopPositionChange(ev.nativeEvent.contentOffset.y < 10)
            }}
            style={{ width }}
            contentContainerStyle={styles.flex}
        >
            {articleResponse({
                error: ({ message }) => (
                    <FlexErrorMessage
                        title={message}
                        style={{ backgroundColor: color.background }}
                    />
                ),
                pending: () => (
                    <FlexErrorMessage
                        title={'loading'}
                        style={{ backgroundColor: color.background }}
                    />
                ),
                success: article => (
                    <>
                        {previewNotice && (
                            <UiBodyCopy>{previewNotice}</UiBodyCopy>
                        )}
                        {isUsingProdDevtools ? (
                            <>
                                <Button
                                    onPress={() => {
                                        setPillar(app => {
                                            if (
                                                app + 1 >=
                                                articlePillars.length
                                            ) {
                                                return 0
                                            }
                                            return app + 1
                                        })
                                    }}
                                    style={{
                                        position: 'absolute',
                                        zIndex: 9999,
                                        elevation: 999,
                                        top:
                                            Dimensions.get('window').height -
                                            600,
                                        right: metrics.horizontal,
                                        alignSelf: 'flex-end',
                                    }}
                                >
                                    {`${articlePillars[modifiedPillar]} 🌈`}
                                </Button>
                                <Button
                                    onPress={() => {
                                        setType(app => {
                                            if (
                                                app + 1 >=
                                                articleTypes.length
                                            ) {
                                                return 0
                                            }
                                            return app + 1
                                        })
                                    }}
                                    style={{
                                        position: 'absolute',
                                        zIndex: 9999,
                                        elevation: 999,
                                        top:
                                            Dimensions.get('window').height -
                                            560,
                                        right: metrics.horizontal,
                                        alignSelf: 'flex-end',
                                    }}
                                >
                                    {`${articleTypes[modifiedType]} 🌈`}
                                </Button>
                            </>
                        ) : null}
                        <WithArticle
                            type={articleTypes[modifiedType]}
                            pillar={articlePillars[modifiedPillar]}
                        >
                            <ArticleController article={article.article} />
                        </WithArticle>
                    </>
                ),
            })}
        </ScrollView>
    )
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

const ArticleScreenWithProps = ({
    path,
    articleNavigator,
    transitionProps,
    navigation,
    prefersFullScreen,
}: ArticleRequiredNavigationProps & {
    navigation: NavigationScreenProp<{}, ArticleNavigationProps>
}) => {
    const pillar = getAppearancePillar(articleNavigator.appearance)

    const [articleIsAtTop, setArticleIsAtTop] = useState(true)
    const navigationPosition = getNavigationPosition('article')

    const { isInScroller, startingPoint } = getData(articleNavigator, path)
    const [current, setCurrent] = useState(startingPoint)

    const { width } = useDimensions()

    const sliderPos = useAlphaIn(200, {
        initialValue: 0,
        currentValue: current,
    }).interpolate({
        inputRange: [0, articleNavigator.articles.length - 1],
        outputRange: [0, 1],
    })

    const preview = isPreview(useSettings()[0])
    const previewNotice = preview ? `${path.collection}:${current}` : undefined

    return (
        <ClipFromTop
            easing={navigationPosition && navigationPosition.position}
            from={
                transitionProps && transitionProps.startAtHeightFromFrontsItem
            }
        >
            {prefersFullScreen ? (
                <SlideCard
                    enabled={false}
                    onDismiss={() => navigation.goBack()}
                >
                    <LoginOverlay
                        isFocused={() => navigation.isFocused()}
                        onLoginPress={() =>
                            navigation.navigate(routeNames.SignIn)
                        }
                        onOpenCASLogin={() =>
                            navigation.navigate(routeNames.CasSignIn)
                        }
                        onDismiss={() => navigation.goBack()}
                    >
                        <WithBreakpoints>
                            {{
                                0: ({ width }) => (
                                    <ArticleScreenBody
                                        path={path}
                                        width={width}
                                        pillar={pillar}
                                        onTopPositionChange={() => {}}
                                        previewNotice={previewNotice}
                                    />
                                ),
                            }}
                        </WithBreakpoints>
                    </LoginOverlay>
                </SlideCard>
            ) : (
                <SlideCard
                    enabled={articleIsAtTop}
                    onDismiss={() => navigation.goBack()}
                >
                    <LoginOverlay
                        isFocused={() => navigation.isFocused()}
                        onLoginPress={() =>
                            navigation.navigate(routeNames.SignIn)
                        }
                        onOpenCASLogin={() =>
                            navigation.navigate(routeNames.CasSignIn)
                        }
                        onDismiss={() => navigation.goBack()}
                    >
                        <View
                            style={{
                                padding: metrics.vertical,
                                justifyContent: 'center',
                                alignItems: 'stretch',
                            }}
                        >
                            <Navigator
                                title={articleNavigator.frontName.slice(0, 1)}
                                fill={getColor(articleNavigator.appearance)}
                                stops={2}
                                position={sliderPos}
                            />
                        </View>
                        <Animated.FlatList
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            scrollEventThrottle={1}
                            onScroll={(ev: any) => {
                                setCurrent(
                                    Math.floor(
                                        ev.nativeEvent.contentOffset.x / width,
                                    ),
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
                            keyExtractor={(
                                item: ArticleNavigator['articles'][0],
                            ) => item.article}
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
                                    }}
                                    previewNotice={previewNotice}
                                />
                            )}
                        />
                    </LoginOverlay>
                </SlideCard>
            )}
        </ClipFromTop>
    )
}

export const ArticleScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}, ArticleNavigationProps>
}) =>
    getArticleNavigationProps(navigation, {
        error: () => (
            <SlideCard enabled={true} onDismiss={() => navigation.goBack()}>
                <FlexErrorMessage
                    title={ERR_404_MISSING_PROPS}
                    style={{ backgroundColor: color.background }}
                />
            </SlideCard>
        ),
        success: props => (
            <ArticleScreenWithProps {...{ navigation }} {...props} />
        ),
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
