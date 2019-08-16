import React, { useState, useMemo } from 'react'
import { View, StyleSheet, Dimensions, Linking } from 'react-native'
import { WebView } from 'react-native-webview'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { LongReadHeader, NewsHeader, OpinionHeader } from './article-header'
import { ArticleHeaderProps } from './article-header/types'
import { PropTypes as StandfirstPropTypes } from './article-standfirst'
import { BlockElement } from 'src/common'
import { render } from './html/render'
import { CAPIArticle } from 'src/common'
import { Gallery } from './types/gallery'
import { Crossword } from './types/crossword'
import { useArticle } from 'src/hooks/use-article'
import { Fader } from '../layout/animators/fader'
import { ReviewHeader } from './article-header/review-header'
import { Wrap } from './wrap/wrap'

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

const Article = ({
    article,
    ...headerProps
}: {
    article?: BlockElement[]
} & ArticleHeaderProps &
    StandfirstPropTypes) => {
    const [height, setHeight] = useState(Dimensions.get('window').height)
    const html = useMemo(() => (article ? render(article) : ''), [article])
    const [, { type }] = useArticle()
    return (
        <View style={styles.container}>
            <Fader first position={'article'} />
            {type === 'opinion' ? (
                <OpinionHeader {...headerProps} />
            ) : type === 'review' ? (
                <ReviewHeader {...headerProps} />
            ) : type === 'longread' ? (
                <LongReadHeader {...headerProps} />
            ) : (
                <NewsHeader {...headerProps} />
            )}
            <Wrap>
                <Fader position={'article'}>
                    <WebView
                        originWhitelist={['*']}
                        scrollEnabled={false}
                        useWebKit={false}
                        source={{ html: html }}
                        onShouldStartLoadWithRequest={event => {
                            if (
                                event.url.startsWith(
                                    'https://embed.theguardian.com',
                                ) ||
                                event.url.startsWith('https://www.youtube.com')
                            ) {
                                return false
                            } else if (event.url !== 'about:blank') {
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
                            marginHorizontal: metrics.article.sides * -1,
                            /*
                                The below line fixes crashes on Android
                                https://github.com/react-native-community/react-native-webview/issues/429
                                */
                            opacity: 0.99,
                        }}
                    />
                </Fader>
            </Wrap>
        </View>
    )
}

export { ArticleController }
