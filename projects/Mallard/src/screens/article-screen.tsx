import React, { useState } from 'react'
import { useArticleResponse } from 'src/hooks/use-issue'
import {
    NavigationScreenProp,
    NavigationEvents,
    ScrollView,
} from 'react-navigation'
import { WithArticleAppearance, articleAppearances } from 'src/theme/appearance'
import { ArticleController } from 'src/components/article'
import { CAPIArticle, Collection, Front, ColorFromPalette } from 'src/common'
import { Dimensions, Animated, View, Text } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { SlideCard } from 'src/components/layout/slide-card/index'
import { color } from 'src/theme/color'
import { PathToArticle } from './article-screen'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { ERR_404_MISSING_PROPS } from 'src/helpers/words'
import { Issue } from '../../../backend/common'
import { ClipFromTop } from 'src/components/layout/clipFromTop/clipFromTop'
import { useSettings } from 'src/hooks/use-settings'
import { Button } from 'src/components/button/button'
import { getNavigationPosition } from 'src/helpers/positions'
import { ArticleNavigationProps } from 'src/navigation/helpers'

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
}
const ArticleScreenBody = ({
    path,
    viewIsTransitioning,
    onTopPositionChange,
}: {
    path: PathToArticle
    viewIsTransitioning: boolean
    onTopPositionChange: (isAtTop: boolean) => void
}) => {
    const [appearance, setAppearance] = useState(0)
    const appearances = Object.keys(articleAppearances)
    const articleResponse = useArticleResponse(path)
    const [{ isUsingProdDevtools }] = useSettings()
    const { width } = Dimensions.get('window')

    return (
        <ScrollView
            onTouchStart={() => {
                //onTopPositionChange(true)
            }}
            scrollEventThrottle={8}
            onScroll={ev => {
                onTopPositionChange(ev.nativeEvent.contentOffset.y < 10)
            }}
            style={{ width }}
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
                        {isUsingProdDevtools ? (
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
                                {`${appearances[appearance]} 🌈`}
                            </Button>
                        ) : null}
                        <WithArticleAppearance
                            value={appearances[appearance] as ColorFromPalette}
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
    navigator,
    transitionProps,
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
    path: PathToArticle
    navigator: ArticleNavigator
    transitionProps?: ArticleTransitionProps
}) => {
    const { width } = Dimensions.get('window')

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

    const { isInScroller, startingPoint } = getData(navigator, path)

    return (
        <ClipFromTop
            easing={
                (navigationPosition && navigationPosition.position) || undefined
            }
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
            <SlideCard
                {...viewIsTransitioning}
                enabled={articleIsAtTop}
                onDismiss={() => navigation.goBack()}
                interpolator={
                    navigationPosition && navigationPosition.raw.position
                }
            >
                <Animated.FlatList
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={1}
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
                            ? navigator.articles
                            : [path, ...navigator.articles]
                    }
                    renderItem={({
                        item,
                    }: {
                        item: ArticleNavigator['articles'][0]
                        index: number
                    }) => (
                        <ArticleScreenBody
                            path={item}
                            onTopPositionChange={isAtTop => {
                                setArticleIsAtTop(isAtTop)
                            }}
                            {...{ viewIsTransitioning }}
                        />
                    )}
                />
            </SlideCard>
        </ClipFromTop>
    )
}

export const ArticleScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}, ArticleNavigationProps>
}) => {
    const path = navigation.getParam('path')
    const navigator: ArticleNavigator = navigation.getParam(
        'articleNavigator',
        {
            articles: [],
        },
    )

    const transitionProps = navigation.getParam('transitionProps') as
        | ArticleTransitionProps
        | undefined

    if (!path || !path.article || !path.collection || !path.issue) {
        return (
            <SlideCard enabled={true} onDismiss={() => navigation.goBack()}>
                <FlexErrorMessage
                    title={ERR_404_MISSING_PROPS}
                    style={{ backgroundColor: color.background }}
                />
            </SlideCard>
        )
    }
    return (
        <ArticleScreenWithProps
            {...{
                path,
                navigation,
                navigator,
                transitionProps,
            }}
        />
    )
}

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
