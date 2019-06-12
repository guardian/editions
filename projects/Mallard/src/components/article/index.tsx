import React, { useState, useMemo } from 'react'
import { View, StyleSheet, Dimensions, Linking } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
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
import { BlockElement } from '../../common'
import { render } from './html/render'

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

const Article = withNavigation(
    ({
        navigation,
        article,
        headline,
        image,
        kicker,
        byline,
        standfirst,
    }: {
        article?: BlockElement[]
    } & ArticleHeaderPropTypes &
        StandfirstPropTypes &
        NavigationInjectedProps) => {
        const { appearance, name: appearanceName } = useArticleAppearance()
        const [height, setHeight] = useState(Dimensions.get('window').height)
        const html = useMemo(() => (article ? render(article) : ''), [article])

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

                    <View
                        style={{ backgroundColor: color.background, flex: 1 }}
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
                    </View>
                </View>
            </SlideCard>
        )
    },
)

export { Article }
