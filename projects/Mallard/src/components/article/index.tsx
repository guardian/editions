import React, { useState } from 'react'
import { View, StyleSheet, PixelRatio } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { WebView } from 'react-native-webview'
import { color } from '../../theme/color'
import { metrics } from '../../theme/spacing'
import { SlideCard } from '../layout/slide-card'
import { useArticleAppearance } from '../../theme/appearance'
import {
    LongReadHeader,
    NewsHeader,
    PropTypes as ArticleHeaderPropTypes,
} from './article-header'
import {
    Standfirst,
    PropTypes as StandfirstPropTypes,
} from './article-standfirst'
import { BlockElement, HTMLElement } from '../../common'

/*
This is the article view! For all of the articles.
it gets everything it needs from its route
*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    block: {
        alignItems: 'flex-start',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
})

const render = (article: BlockElement[]) => {
    return `
    <html>
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body>
      ${article
          .filter(el => el.id === 'html')
          .map(el => (el as HTMLElement).html)
          .join('')}
      <script>
        window.requestAnimationFrame(function() {
            window.ReactNativeWebView.postMessage(document.documentElement.scrollHeight)
        })
      </script>
    </body>
    </html>
    `
}

const Article = ({
    navigation,
    article,
    headline,
    image,
    kicker,
    byline,
    standfirst,
}: {
    navigation: NavigationScreenProp<{}>
    article?: BlockElement[]
} & ArticleHeaderPropTypes &
    StandfirstPropTypes) => {
    const { appearance, name: appearanceName } = useArticleAppearance()
    const [height, setHeight] = useState(500)
    const html = article ? render(article) : ''
    return (
        <SlideCard
            headerStyle={[appearance.backgrounds, appearance.text]}
            fadesHeaderIn={appearanceName === 'longread'}
            backgroundColor={appearance.backgrounds.backgroundColor}
            onDismiss={() => {
                navigation.goBack()
            }}
        >
            <View style={styles.container}>
                {appearanceName === 'longread' ? (
                    <LongReadHeader {...{ headline, image, kicker }} />
                ) : (
                    <NewsHeader {...{ headline, image, kicker }} />
                )}
                <Standfirst {...{ byline, standfirst }} />

                <View style={{ backgroundColor: color.background, flex: 1 }}>
                    <WebView
                        originWhitelist={['*']}
                        scrollEnabled={false}
                        source={{ html: html }}
                        onMessage={event => {
                            setHeight(parseInt(event.nativeEvent.data))
                        }}
                        style={{ flex: 1, minHeight: height }}
                    />
                </View>
            </View>
        </SlideCard>
    )
}

export { Article }
