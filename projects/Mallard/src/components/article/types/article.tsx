import React, { useMemo, useState } from 'react'
import { Dimensions, Linking, Platform, View, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { ArticleFeatures, BlockElement } from 'src/common'
import { useArticle } from 'src/hooks/use-article'
import { metrics } from 'src/theme/spacing'
import { Fader } from '../../layout/animators/fader'
import { ArticleHeader } from '../article-header'
import { ArticleHeaderProps } from '../article-header/types'
import { PropTypes as StandfirstPropTypes } from '../article-standfirst'
import { EMBED_DOMAIN, render } from '../html/render'
import { Wrap, WrapLayout } from '../wrap/wrap'
import { color } from 'src/theme/color'

const urlIsNotAnEmbed = (url: string) =>
    !(
        url.startsWith(EMBED_DOMAIN) ||
        url.startsWith('https://www.youtube.com/embed')
    )

const features: ArticleFeatures[] = [ArticleFeatures.HasDropCap]

const styles = StyleSheet.create({
    block: {
        alignItems: 'flex-start',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    webviewWrap: {
        ...StyleSheet.absoluteFillObject,
    },
    webview: {
        backgroundColor: 'transparent',
        width: '100%',
        /*
        The below line fixes crashes on Android
        https://github.com/react-native-community/react-native-webview/issues/429
        */
        opacity: 0.99,
    },
})

const ArticleWebview = ({
    article,
    wrapLayout,
}: {
    article: BlockElement[]
    wrapLayout: WrapLayout
}) => {
    const [height, setHeight] = useState(Dimensions.get('window').height)
    const [, { pillar }] = useArticle()

    const html = render(article, { pillar, features, wrapLayout })

    return (
        <>
            <Wrap>
                <View style={{ minHeight: height }}></View>
            </Wrap>

            <View style={[styles.webviewWrap]}>
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
                    style={[
                        styles.webview,
                        {
                            minHeight: height,
                        },
                    ]}
                />
            </View>
        </>
    )
}

const Article = ({
    article,
    ...headerProps
}: {
    article: BlockElement[]
} & ArticleHeaderProps &
    StandfirstPropTypes) => {
    const [wrapLayout, setWrapLayout] = useState<WrapLayout | null>(null)
    const [, { type }] = useArticle()

    return (
        <>
            <ArticleHeader {...headerProps} type={type} />
            <Fader>
                {wrapLayout && (
                    <ArticleWebview article={article} wrapLayout={wrapLayout} />
                )}

                <Wrap onWrapLayout={setWrapLayout}></Wrap>
            </Fader>
        </>
    )
}

export { Article }
