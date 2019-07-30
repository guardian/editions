import React, { useState, useMemo } from 'react'
import { View, StyleSheet, Dimensions, Linking, Animated } from 'react-native'
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
import { getNavigationPosition } from 'src/helpers/positions'
import { Gallery } from './types/gallery'
import { Crossword } from './types/crossword'
import { useArticle } from 'src/hooks/use-article'

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
    viewIsTransitioning: boolean
}

const ArticleController = ({
    article,
    viewIsTransitioning,
}: {
    article: CAPIArticle
    viewIsTransitioning?: boolean
}) => {
    switch (article.type) {
        case 'article':
            return (
                <Article
                    article={viewIsTransitioning ? undefined : article.elements}
                    {...article}
                />
            )

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
    headline,
    image,
    kicker,
    byline,
    standfirst,
}: {
    article?: BlockElement[]
} & ArticleHeaderProps &
    StandfirstPropTypes) => {
    const [height, setHeight] = useState(Dimensions.get('window').height)
    const html = useMemo(() => (article ? render(article) : ''), [article])
    const navigationPosition = getNavigationPosition('article')
    const [, { type }] = useArticle()
    return (
        <View style={styles.container}>
            {type === 'opinion' ? (
                <OpinionHeader
                    {...{ byline, headline, image, kicker, standfirst }}
                />
            ) : type === 'longread' ? (
                <LongReadHeader
                    {...{ byline, headline, image, kicker, standfirst }}
                />
            ) : (
                <NewsHeader
                    {...{ byline, headline, image, kicker, standfirst }}
                />
            )}
            <Animated.View
                style={[
                    { backgroundColor: color.background, flex: 1 },
                    navigationPosition && {
                        opacity: navigationPosition.position.interpolate({
                            inputRange: [0.75, 1],
                            outputRange: [0, 1],
                        }),
                    },
                ]}
            >
                <WebView
                    originWhitelist={['*']}
                    scrollEnabled={false}
                    useWebKit={false}
                    source={{ html: html }}
                    onShouldStartLoadWithRequest={event => {
                        if (event.url !== 'about:blank') {
                            Linking.openURL(event.url)
                            return false
                        }
                        return true
                    }}
                    onMessage={event => {
                        setHeight(parseInt(event.nativeEvent.data))
                    }}
                    style={{
                        flex: 1,
                        minHeight: height,
                    }}
                    // The below lines fixes crashes on Android
                    // there seems to be other approaches using opacity / overflow styles detailed here
                    // https://github.com/react-native-community/react-native-webview/issues/429
                    androidHardwareAccelerationDisabled={true}
                />
            </Animated.View>
        </View>
    )
}

export { ArticleController }
