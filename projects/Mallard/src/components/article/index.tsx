import React, { useState, useMemo } from 'react'
import { View, StyleSheet, Dimensions, Linking, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { ArticleHeader } from './article-header'
import { ArticleHeaderProps } from './article-header/types'
import { PropTypes as StandfirstPropTypes } from './article-standfirst'
import { BlockElement, ArticleFeatures } from 'src/common'
import { render, EMBED_DOMAIN } from './html/render'
import { CAPIArticle } from 'src/common'
import { Gallery } from './types/gallery'
import { Crossword } from './types/crossword'
import { useArticle } from 'src/hooks/use-article'
import { Fader } from '../layout/animators/fader'
import { Wrap, WrapLayout } from './wrap/wrap'

/*
This is the article view! For all of the articles.
it gets everything it needs from its route
*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.background,
    },
    block: {
        alignItems: 'flex-start',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
})

export interface ArticleControllerPropTypes {
    article: CAPIArticle
}

const ArticleController = ({ article }: { article: CAPIArticle }) => {
    switch (article.type) {
        case 'article':
            return <Article article={article.elements} {...article} />

        case 'gallery':
            return <Gallery gallery={article} />

        case 'crossword':
            return <Crossword crosswordArticle={article} />

        default:
            const message: never = article
            return (
                <FlexErrorMessage
                    title={message}
                    style={{ backgroundColor: color.background }}
                />
            )
    }
}

const urlIsNotAnEmbed = (url: string) =>
    !(
        url.startsWith(EMBED_DOMAIN) ||
        url.startsWith('https://www.youtube.com/embed')
    )

const features: ArticleFeatures[] = [ArticleFeatures.HasDropCap]

const Article = ({
    article,
    ...headerProps
}: {
    article: BlockElement[]
} & ArticleHeaderProps &
    StandfirstPropTypes) => {
    const [height, setHeight] = useState(Dimensions.get('window').height)
    const [wrapLayout, setWrapLayout] = useState<WrapLayout | null>(null)
    const [, { pillar, type }] = useArticle()
    const layoutWidth = (wrapLayout && wrapLayout.width) || -1

    const html = useMemo(
        () =>
            wrapLayout ? render(article, { pillar, features, wrapLayout }) : '',
        [article, pillar, ...features, layoutWidth],
    )

    return (
        <View style={styles.container}>
            <Fader />
            <ArticleHeader {...headerProps} type={type} />

            <Wrap onWrapLayout={setWrapLayout}>
                <View style={{ minHeight: height }}></View>
                {wrapLayout && (
                    <View
                        style={{
                            position: 'absolute',
                            left: -metrics.article.sides,
                            width: wrapLayout.width + metrics.article.sides * 2,
                            top: 0,
                            bottom: 0,
                            zIndex: 99999999,
                        }}
                    >
                        <WebView
                            originWhitelist={['*']}
                            scrollEnabled={false}
                            useWebKit={false}
                            source={{ html: html }}
                            onShouldStartLoadWithRequest={event => {
                                if (
                                    Platform.select({
                                        ios: event.navigationType === 'click',
                                        android: urlIsNotAnEmbed(event.url), // android doesn't have 'click' types so check for our embed types
                                    })
                                ) {
                                    Linking.openURL(event.url)
                                    return false
                                }
                                return true
                            }}
                            onMessage={event => {
                                if (parseInt(event.nativeEvent.data) > height) {
                                    setHeight(parseInt(event.nativeEvent.data))
                                }
                            }}
                            style={{
                                minHeight: height,
                                backgroundColor: 'transparent',
                                width: '100%',
                                /*
                                The below line fixes crashes on Android
                                https://github.com/react-native-community/react-native-webview/issues/429
                                */
                                opacity: 0.99,
                            }}
                        />
                    </View>
                )}
            </Wrap>
        </View>
    )
}

export { ArticleController }
