import React, { useState } from 'react'
import { useEndpoint } from '../hooks/use-fetch'
import { NavigationScreenProp, NavigationEvents } from 'react-navigation'
import {
    WithArticleAppearance,
    ArticleAppearance,
    articleAppearances,
} from '../theme/appearance'
import { Article } from '../components/article'
import { Collection, Article as ArticleType } from '../common'
import { View, TouchableOpacity, Text } from 'react-native'
import { metrics } from '../theme/spacing'
import { UiBodyCopy } from '../components/styled-text'
import { FlexCenter } from '../components/layout/flex-center'
import { SlideCard } from '../components/layout/slide-card/index'
import { color } from '../theme/color'
import { PathToArticle } from './article-screen'
import { withResponse } from 'src/hooks/use-response'

export interface PathToArticle {
    collection: Collection['key']
    article: ArticleType['key']
}

const useArticleResponse = ({ collection, article }: PathToArticle) => {
    const resp = useEndpoint<Collection>(`collection/${collection}`)
    if (resp.state === 'success') {
        const articleContent =
            resp.response.articles && resp.response.articles[article]
        if (articleContent) {
            console.log(articleContent)
            return withResponse<ArticleType>({
                ...resp,
                response: articleContent,
            })
        } else {
            return withResponse<ArticleType>({
                state: 'error',
                error: {
                    message: 'not found',
                },
            })
        }
    }
    return withResponse<ArticleType>(resp)
}

const ArticleScreenWithProps = ({
    path,
    articlePrefill,
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
    path: PathToArticle
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

    return (
        <SlideCard onDismiss={() => navigation.goBack()}>
            <NavigationEvents
                onDidFocus={() => {
                    setViewIsTransitioning(false)
                }}
            />
            {articleResponse({
                error: ({ message }) => (
                    <FlexCenter style={{ backgroundColor: color.background }}>
                        <Text style={{ fontSize: 40 }}>😭</Text>
                        <UiBodyCopy weight="bold">{message}</UiBodyCopy>
                    </FlexCenter>
                ),
                pending: () => (
                    <Article
                        kicker={(articlePrefill && articlePrefill.kicker) || ''}
                        headline={
                            (articlePrefill && articlePrefill.headline) || ''
                        }
                        byline={(articlePrefill && articlePrefill.byline) || ''}
                        standfirst=""
                    />
                ),
                success: ({
                    standfirst,
                    headline,
                    byline,
                    imageURL,
                    elements,
                }) => (
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
                                kicker={
                                    (articlePrefill && articlePrefill.kicker) ||
                                    ''
                                }
                                headline={
                                    (articlePrefill &&
                                        articlePrefill.headline) ||
                                    headline
                                }
                                byline={
                                    (articlePrefill && articlePrefill.byline) ||
                                    byline
                                }
                                standfirst={standfirst}
                                image={
                                    imageURL ||
                                    (articlePrefill && articlePrefill.image)
                                }
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

    if (!path || !path.article || !path.collection) {
        return (
            <FlexCenter style={{ backgroundColor: color.background }}>
                <Text>{JSON.stringify(path)}</Text>
            </FlexCenter>
        )
    }
    return <ArticleScreenWithProps {...{ articlePrefill, path, navigation }} />
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
