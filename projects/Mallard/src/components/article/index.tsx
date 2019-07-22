import React, { useState, useMemo } from 'react'
import { View, StyleSheet, Dimensions, Linking, Animated } from 'react-native'
import { WebView } from 'react-native-webview'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { useArticleAppearance } from 'src/theme/appearance'
import { LongReadHeader, NewsHeader } from './article-header/article-header'
import { ArticleHeaderProps } from './article-header/types'
import {
    ArticleStandfirst,
    PropTypes as StandfirstPropTypes,
} from './article-standfirst/article-standfirst'
import { BlockElement } from 'src/common'
import { render } from './html/render'
import { CAPIArticle } from 'src/common'
import { getNavigationPosition } from 'src/helpers/positions'
import { Gallery } from './types/gallery'
import { Crossword } from './types/crossword'

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
                    icon="😭"
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
    const { name: appearanceName } = useArticleAppearance()
    const [height, setHeight] = useState(Dimensions.get('window').height)
    const html = useMemo(() => (article ? render(article) : ''), [article])
    const navigationPosition = getNavigationPosition('article')

    return (
        <View style={styles.container}>
            <NewsHeader {...{ headline, image, kicker }} />
            <ArticleStandfirst
                {...{ byline, standfirst }}
                style={[
                    navigationPosition && {
                        opacity: navigationPosition.position.interpolate({
                            inputRange: [0.6, 1],
                            outputRange: [0, 1],
                        }),
                    },
                ]}
            />

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
