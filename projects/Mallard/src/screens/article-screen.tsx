import React, { useState } from 'react'
import { useEndpointResponse } from '../hooks/use-fetch'
import { NavigationScreenProp, NavigationEvents } from 'react-navigation'
import {
    WithArticleAppearance,
    ArticleAppearance,
    articleAppearances,
} from '../theme/appearance'
import { Article } from '../components/article'
import { Article as ArticleType, FrontArticle } from '../common'
import { View, TouchableOpacity, Text, Button } from 'react-native'
import { metrics } from '../theme/spacing'
import { UiBodyCopy } from '../components/styled-text'
import { FlexCenter } from '../components/layout/flex-center'
import { SlideCard } from '../components/layout/slide-card/index'
import { color } from '../theme/color'

const useArticleResponse = (path: string) =>
    useEndpointResponse<ArticleType>(
        `content/${path}`,
        article => article.title != null,
    )

export const ArticleScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const frontArticle = navigation.getParam('article') as
        | FrontArticle
        | undefined

    const path = navigation.getParam('path')
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
                        kicker={(frontArticle && frontArticle.kicker) || ''}
                        headline={(frontArticle && frontArticle.headline) || ''}
                        byline={(frontArticle && frontArticle.byline) || ''}
                        standfirst=""
                    />
                ),
                success: ({
                    standfirst,
                    title,
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
                                    (frontArticle && frontArticle.kicker) || ''
                                }
                                headline={
                                    (frontArticle && frontArticle.headline) ||
                                    title
                                }
                                byline={
                                    (frontArticle && frontArticle.byline) ||
                                    byline
                                }
                                standfirst={standfirst}
                                image={
                                    imageURL ||
                                    (frontArticle && frontArticle.image)
                                }
                            />
                        </WithArticleAppearance>
                    </>
                ),
            })}
        </SlideCard>
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
