import React, { useState, useEffect } from 'react'
import { useJsonOrEndpoint } from 'src/hooks/use-fetch'
import { NavigationScreenProp, NavigationEvents } from 'react-navigation'
import {
    WithArticleAppearance,
    ArticleAppearance,
    articleAppearances,
} from 'src/theme/appearance'
import { Article } from 'src/components/article'
import { Article as ArticleType, Collection } from 'src/common'
import { View, TouchableOpacity, Animated, Dimensions } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { UiBodyCopy } from 'src/components/styled-text'
import { SlideCard } from 'src/components/layout/slide-card/index'
import { color } from 'src/theme/color'
import { PathToArticle } from './article-screen'
import { withResponse } from 'src/hooks/use-response'
import { FlexErrorMessage } from 'src/components/layout/errors/flex-error-message'
import { ERR_404_REMOTE, ERR_404_MISSING_PROPS } from 'src/helpers/words'
import { Issue } from '../../../backend/common'

export interface PathToArticle {
    collection: Collection['key']
    article: ArticleType['key']
    issue: Issue['key']
}

export interface ArticleTransitionProps {
    cardHeight: number
}

const useArticleResponse = ({ collection, article, issue }: PathToArticle) => {
    const resp = useJsonOrEndpoint<ArticleType>(
        issue,
        `collection/${collection}`,
    )
    if (resp.state === 'success') {
        const articleContent =
            resp.response.articles && resp.response.articles[article]
        if (articleContent) {
            return withResponse<ArticleType>({
                ...resp,
                response: articleContent,
            })
        } else {
            return withResponse<ArticleType>({
                state: 'error',
                error: {
                    message: ERR_404_REMOTE,
                },
            })
        }
    }
    return withResponse<ArticleType>(resp)
}

const ArticleScreenWithProps = ({
    path,
    articlePrefill,
    transitionProps,
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
    path: PathToArticle
    transitionProps?: ArticleTransitionProps
    articlePrefill?: ArticleType
}) => {
    const [appearance, setAppearance] = useState(0)
    const appearances = Object.keys(articleAppearances)
    const articleResponse = useArticleResponse(path)

    /* 
    we don't wanna render a massive tree at once 
    as the navigator is trying to push the screen bc this
    delays the tap response 
     we can pass this prop to identify if we wanna render 
    just the 'above the fold' content or the whole shebang
    */
    const [viewIsTransitioning, setViewIsTransitioning] = useState(true)
    const [height] = useState(
        () =>
            new Animated.Value(
                (transitionProps && transitionProps.cardHeight) || 300,
            ),
    )

    useEffect(() => {
        Animated.sequence([
            Animated.delay(150),
            Animated.timing(height, {
                toValue: Dimensions.get('window').height,
                duration: 300,
            }),
        ]).start()
    }, [])

    return (
        <SlideCard
            style={{
                height,
                flex: 0,
                overflow: 'hidden',
            }}
            onDismiss={() => navigation.goBack()}
        >
            <NavigationEvents
                onDidFocus={() => {
                    setViewIsTransitioning(false)
                }}
            />
            {articleResponse({
                error: ({ message }) => (
                    <FlexErrorMessage
                        icon="😭"
                        title={message}
                        style={{ backgroundColor: color.background }}
                    />
                ),
                pending: () =>
                    articlePrefill ? (
                        <Article {...articlePrefill} />
                    ) : (
                        <FlexErrorMessage
                            title={'loading'}
                            style={{ backgroundColor: color.background }}
                        />
                    ),
                success: ({ elements, ...article }) => (
                    <>
                        <View
                            style={{
                                backgroundColor: 'tomato',
                                position: 'absolute',
                                zIndex: 9999,
                                elevation: 999,
                                bottom: 100,
                                right: metrics.horizontal,
                                alignSelf: 'flex-end',
                                borderRadius: 999,
                            }}
                        >
                            <TouchableOpacity
                                onPress={() => {
                                    setAppearance(app => {
                                        if (app + 1 >= appearances.length) {
                                            return 0
                                        }
                                        return app + 1
                                    })
                                }}
                            >
                                <UiBodyCopy
                                    style={{
                                        backgroundColor: 'tomato',
                                        position: 'absolute',
                                        zIndex: 9999,
                                        elevation: 999,
                                        bottom: 100,
                                        right: metrics.horizontal,
                                        alignSelf: 'flex-end',
                                        borderRadius: 999,
                                    }}
                                >
                                    {`${appearances[appearance]} 🌈`}
                                </UiBodyCopy>
                            </TouchableOpacity>
                        </View>
                        <WithArticleAppearance
                            value={appearances[appearance] as ArticleAppearance}
                        >
                            <Article
                                article={
                                    viewIsTransitioning ? undefined : elements
                                }
                                {...article}
                            />
                        </WithArticleAppearance>
                    </>
                ),
            })}
        </SlideCard>
    )
}

export const ArticleScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const articlePrefill = navigation.getParam('article') as
        | ArticleType
        | undefined

    const path = navigation.getParam('path') as PathToArticle | undefined
    const transitionProps = navigation.getParam('transitionProps') as
        | ArticleTransitionProps
        | undefined

    if (!path || !path.article || !path.collection || !path.issue) {
        return (
            <SlideCard onDismiss={() => navigation.goBack()}>
                <FlexErrorMessage
                    title={ERR_404_MISSING_PROPS}
                    style={{ backgroundColor: color.background }}
                />
            </SlideCard>
        )
    }
    return (
        <ArticleScreenWithProps
            {...{ articlePrefill, path, navigation, transitionProps }}
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
