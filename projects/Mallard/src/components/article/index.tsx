import React, { useState } from 'react'
import { View, StyleSheet, PixelRatio } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { WebView } from 'react-native-webview'
import { color } from '../../theme/color'
import { metrics } from '../../theme/spacing'
import { SlideCard } from '../layout/slide-card'
import {
    useArticleAppearance,
    articleAppearances,
} from '../../theme/appearance'
import {
    LongReadHeader,
    NewsHeader,
    PropTypes as ArticleHeaderPropTypes,
} from './article-header'
import {
    Standfirst,
    PropTypes as StandfirstPropTypes,
} from './article-standfirst'

/* 
This is the article view! For all of the articles. 
it gets everything it needs from its route
*/

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        ...articleAppearances.default.backgrounds,
    },
    block: {
        alignItems: 'flex-start',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
})

const render = article => {
    return `
    <html>
    <head></head>
    <body>
      ${article
            .filter(el => el.type === 0)
            .map(el => el.textTypeData.html)
            .join('')}
      <script>
        window.requestAnimationFrame(function() {
            window.ReactNativeWebView.postMessage(document.body.getBoundingClientRect().height)
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
    article: any[]
} & ArticleHeaderPropTypes &
    StandfirstPropTypes) => {
    const { appearance, name: appearanceName } = useArticleAppearance()
    const html = render(article)
    const [height, setHeight] = useState(500)
    return (
        <SlideCard
            headerStyle={[
                styles.header,
                appearance.backgrounds,
                appearance.text,
            ]}
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
                        source={{ html: html }}
                        onMessage={event => {
                            setHeight(
                                parseInt(event.nativeEvent.data) /
                                PixelRatio.get(),
                            )
                        }}
                        style={{ flex: 1, height: height }}
                    />
                </View>
            </View>
        </SlideCard>
    )
}

export { Article }
