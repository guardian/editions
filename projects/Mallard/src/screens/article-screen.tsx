import React, { useState } from 'react'
import { useArticleResponse } from 'src/hooks/use-issue'
import {
    NavigationScreenProp,
    NavigationEvents,
    ScrollView,
} from 'react-navigation'
import {
    WithArticleAppearance,
    articleAppearances,
    getAppearancePillar,
} from 'src/theme/appearance'
import { ArticleController } from 'src/components/article'
import { CAPIArticle, Collection, Front, ColorFromPalette } from 'src/common'
import { Dimensions, Animated, View, Text, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { SlideCard } from 'src/components/layout/slide-card/index'
import { color } from 'src/theme/color'
import { PathToArticle } from './article-screen'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { ERR_404_MISSING_PROPS } from 'src/helpers/words'
import { Issue, Appearance } from '../../../backend/common'
import { ClipFromTop } from 'src/components/layout/clipFromTop/clipFromTop'
import { useSettings } from 'src/hooks/use-settings'
import { Button } from 'src/components/button/button'
import { getNavigationPosition } from 'src/helpers/positions'
import {
    ArticleNavigationProps,
    getArticleNavigationProps,
    ArticleRequiredNavigationProps,
} from 'src/navigation/helpers'
import { UiBodyCopy } from '../components/styled-text'
import { Navigator } from 'src/components/navigator'
import { useAlphaIn } from 'src/hooks/use-alpha-in'
import { getColor } from 'src/helpers/transform'

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
    appearance,
    viewIsTransitioning,
    onTopPositionChange,
}: {
    path: PathToArticle
    appearance: string
    viewIsTransitioning: boolean
    onTopPositionChange: (isAtTop: boolean) => void
}) => {
    const appearances = Object.keys(articleAppearances)
    const [modifiedAppearance, setAppearance] = useState(
        appearances.indexOf(appearance) || 0,
    )
    const articleResponse = useArticleResponse(path)
    const [{ isUsingProdDevtools }] = useSettings()
    const { width } = Dimensions.get('window')

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
                        icon="😭"
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
                        {/* {isUsingProdDevtools ? ( */}
                            <Button
                                onPress={() => {
                                    setAppearance(app => {
                                        if (app + 1 >= appearances.length) {
                                            return 0
                                        }
                                        return app + 1
                                    })
                                }}
                                style={{
                                    position: 'absolute',
                                    zIndex: 9999,
                                    elevation: 999,
                                    top: Dimensions.get('window').height - 600,
                                    right: metrics.horizontal,
                                    alignSelf: 'flex-end',
                                }}
                            >
                                {`${appearances[modifiedAppearance]} 🌈`}
                            </Button>
                        {/* ) : null} */}
                        <WithArticleAppearance
                            value={
                                appearances[
                                    modifiedAppearance
                                ] as ColorFromPalette
                            }
                        >
                            <ArticleController
                                article={article.article}
                                viewIsTransitioning={viewIsTransitioning}
                            />
                        </WithArticleAppearance>
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
    const { width } = Dimensions.get('window')
    const appearance = getAppearancePillar(articleNavigator.appearance)

    /*
    we don't wanna render a massive tree at once
    as the navigator is trying to push the screen bc this
    delays the tap response
     we can pass this prop to identify if we wanna render
    just the 'above the fold' content or the whole shebang
    */
    const [viewIsTransitioning, setViewIsTransitioning] = useState(true)
    const [articleIsAtTop, setArticleIsAtTop] = useState(true)
    const navigationPosition = getNavigationPosition('article')

    const { isInScroller, startingPoint } = getData(articleNavigator, path)
    const [current, setCurrent] = useState(startingPoint)

    const sliderPos = useAlphaIn(200, 0, current).interpolate({
        inputRange: [0, articleNavigator.articles.length - 1],
        outputRange: [0, 1],
    })

    return (
        <ClipFromTop
            easing={navigationPosition && navigationPosition.position}
            from={
                transitionProps && transitionProps.startAtHeightFromFrontsItem
            }
        >
            <NavigationEvents
                onDidFocus={() => {
                    requestAnimationFrame(() => {
                        setViewIsTransitioning(false)
                    })
                }}
            />
            {prefersFullScreen ? (
                <SlideCard
                    {...viewIsTransitioning}
                    enabled={false}
                    onDismiss={() => navigation.goBack()}
                >
                    <ArticleScreenBody
                        path={path}
                        appearance={appearance}
                        onTopPositionChange={() => {}}
                        {...{ viewIsTransitioning }}
                    />
                </SlideCard>
            ) : (
                <SlideCard
                    {...viewIsTransitioning}
                    enabled={articleIsAtTop}
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
                                path={item}
                                appearance={appearance}
                                onTopPositionChange={isAtTop => {
                                    setArticleIsAtTop(isAtTop)
                                }}
                                {...{ viewIsTransitioning }}
                            />
                        )}
                    />
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
