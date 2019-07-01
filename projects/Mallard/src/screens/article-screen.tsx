import React, { useState, useMemo } from 'react'
import { useIssue } from 'src/hooks/use-issue'
import { NavigationScreenProp, NavigationEvents } from 'react-navigation'
import {
    WithArticleAppearance,
    ArticleAppearance,
    articleAppearances,
} from 'src/theme/appearance'
import { ArticleController } from 'src/components/article'
import { CAPIArticle, Collection, Front } from 'src/common'
import { View, TouchableOpacity, Dimensions } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { UiBodyCopy } from 'src/components/styled-text'
import { SlideCard } from 'src/components/layout/slide-card/index'
import { color } from 'src/theme/color'
import { PathToArticle } from './article-screen'
import { withResponse } from 'src/helpers/response'
import { FlexErrorMessage } from 'src/components/layout/errors/flex-error-message'
import { ERR_404_REMOTE, ERR_404_MISSING_PROPS } from 'src/helpers/words'
import { Issue } from '../../../backend/common'
import { ClipFromTop } from 'src/components/layout/clipFromTop/clipFromTop'
import { FSPaths, APIPaths } from 'src/paths'
import { flattenCollections } from 'src/helpers/transform'
import { useSettings } from 'src/hooks/use-settings'
import { Button } from 'src/components/button/button'

export interface PathToArticle {
    collection: Collection['key']
    front: Front['key']
    article: CAPIArticle['key']
    issue: Issue['key']
}

export interface ArticleTransitionProps {
    startAtHeightFromFrontsItem: number
}

const useArticleResponse = ({ article, issue, front }: PathToArticle) => {
    const resp = useIssue<Front>(
        issue,
        FSPaths.front(issue, front),
        APIPaths.front(issue, front),
    )
    if (resp.state === 'success') {
        // TODO: we aren't storing the path anywhere on the article
        // which means we can't key into our collection (which is keyed by path)
        // even when we have an article

        const allArticles = flattenCollections(resp.response.collections)
            .map(({ articles }) => articles)
            .reduce((acc, val) => acc.concat(val), [])
        const articleContent = allArticles.find(({ key }) => key === article)

        if (articleContent) {
            return withResponse<CAPIArticle>({
                ...resp,
                response: articleContent,
            })
        } else {
            return withResponse<CAPIArticle>({
                ...resp,
                state: 'error',
                error: {
                    message: ERR_404_REMOTE,
                },
            })
        }
    }
    return withResponse<CAPIArticle>(resp)
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
    articlePrefill?: CAPIArticle
}) => {
    const [appearance, setAppearance] = useState(0)
    const appearances = Object.keys(articleAppearances)
    const articleResponse = useArticleResponse(path)
    const [{ isUsingProdDevtools }] = useSettings()

    /*
    we don't wanna render a massive tree at once
    as the navigator is trying to push the screen bc this
    delays the tap response
     we can pass this prop to identify if we wanna render
    just the 'above the fold' content or the whole shebang
    */
    const [viewIsTransitioning, setViewIsTransitioning] = useState(true)

    return (
        <ClipFromTop
            from={
                transitionProps && transitionProps.startAtHeightFromFrontsItem
            }
        >
            <SlideCard
                {...viewIsTransitioning}
                onDismiss={() => navigation.goBack()}
            >
                <NavigationEvents
                    onDidFocus={() => {
                        requestAnimationFrame(() => {
                            setViewIsTransitioning(false)
                        })
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
                            <ArticleController article={articlePrefill} />
                        ) : (
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
                                        top:
                                            Dimensions.get('window').height -
                                            600,
                                        right: metrics.horizontal,
                                        alignSelf: 'flex-end',
                                    }}
                                >
                                    {`${appearances[appearance]} 🌈`}
                                </Button>
                            ) : null}
                            <WithArticleAppearance
                                value={
                                    appearances[appearance] as ArticleAppearance
                                }
                            >
                                <ArticleController
                                    article={article}
                                    viewIsTransitioning={viewIsTransitioning}
                                />
                            </WithArticleAppearance>
                        </>
                    ),
                })}
            </SlideCard>
        </ClipFromTop>
    )
}

export const ArticleScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const articlePrefill = navigation.getParam('article') as
        | CAPIArticle
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
