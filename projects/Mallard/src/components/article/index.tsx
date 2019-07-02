import React, { useState, useMemo } from 'react'
import { View, StyleSheet, Dimensions, Linking, Animated } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { WebView } from 'react-native-webview'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { FlexErrorMessage } from 'src/components/layout/ui/errors/flex-error-message'
import { useArticleAppearance } from 'src/theme/appearance'
import {
    LongReadHeader,
    NewsHeader,
    PropTypes as ArticleHeaderPropTypes,
} from './article-header'
import {
    Standfirst,
    PropTypes as StandfirstPropTypes,
} from './article-standfirst'
import { BlockElement } from 'src/common'
import { render } from './html/render'
import { CAPIArticle } from '../../../../common/src'

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
    transitionPosition,
}: {
    article: CAPIArticle
    viewIsTransitioning?: boolean
    transitionPosition: Animated.AnimatedInterpolation
}) => {
    switch (article.type) {
        case 'article':
            return (
                <Article
                    article={viewIsTransitioning ? undefined : article.elements}
                    {...article}
                    {...{ transitionPosition }}
                />
            )

        case 'gallery':
            return (
                <FlexErrorMessage
                    icon="😭"
                    title={"We don't support the rendering of galleries yet."}
                    style={{ backgroundColor: color.background }}
                />
            )

        case 'crossword':
            return (
                <FlexErrorMessage
                    icon="😭"
                    title={"We don't support the rendering of crosswords yet."}
                    style={{ backgroundColor: color.background }}
                />
            )

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
    transitionPosition,
    article,
    headline,
    image,
    kicker,
    byline,
    standfirst,
}: {
    transitionPosition?: Animated.AnimatedInterpolation
    article?: BlockElement[]
} & ArticleHeaderPropTypes &
    StandfirstPropTypes) => {
    const { name: appearanceName } = useArticleAppearance()
    const [height, setHeight] = useState(Dimensions.get('window').height)
    const html = useMemo(() => (article ? render(article) : ''), [article])

    return (
        <View style={styles.container}>
            {appearanceName === 'longread' ? (
                <LongReadHeader {...{ headline, image, kicker }} />
            ) : (
                <NewsHeader {...{ headline, image, kicker }} />
            )}
            <Standfirst
                {...{ byline, standfirst }}
                style={[
                    { backgroundColor: color.background, flex: 1 },
                    transitionPosition && {
                        opacity: transitionPosition.interpolate({
                            inputRange: [0.6, 1],
                            outputRange: [0, 1],
                        }),
                    },
                ]}
            />

            <Animated.View
                style={[
                    { backgroundColor: color.background, flex: 1 },
                    transitionPosition && {
                        opacity: transitionPosition.interpolate({
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
                    style={{ flex: 1, minHeight: height }}
                />
            </Animated.View>
        </View>
    )
}

export { ArticleController }
