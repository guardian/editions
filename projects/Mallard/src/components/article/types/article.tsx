import React, { useMemo, useState } from 'react'
import {
    Dimensions,
    Linking,
    Platform,
    View,
    StyleSheet,
    Animated,
} from 'react-native'
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
import { useNetInfo } from '@react-native-community/netinfo'
import { safeInterpolation } from 'src/helpers/math'

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
        bottom: 100,
        backgroundColor: 'yellow',
        flexGrow: 1,
        height: 500,
    },
    webview: {
        backgroundColor: 'transparent',
        width: '100%',
        height: '100%',
        /*
        The below line fixes crashes on Android
        https://github.com/react-native-community/react-native-webview/issues/429
        */
        opacity: 0.99,
    },
})

const AniWebview = Animated.createAnimatedComponent(WebView)

const ArticleWebview = ({
    article,
    wrapLayout,
}: {
    article: BlockElement[]
    wrapLayout: WrapLayout
}) => {
    const { isConnected } = useNetInfo()
    const [height, setHeight] = useState(Dimensions.get('window').height)
    const [, { pillar }] = useArticle()

    const html = useMemo(
        () =>
            render(article, {
                pillar,
                features,
                wrapLayout,
                showMedia: isConnected,
            }),
        [article, pillar, wrapLayout, isConnected],
    )
    const [scrollX] = useState(() => new Animated.Value(1))
    console.log(scrollX)
    return (
        <View style={{ height: 300 }}>
            <Animated.View
                style={{
                    backgroundColor: 'red',
                    height: 200,
                    width: '100%',
                    transform: [
                        {
                            translateY: scrollX.interpolate({
                                inputRange: safeInterpolation([-1, 1]),
                                outputRange: safeInterpolation([1, -1]),
                            }),
                        },
                    ],
                }}
            />
            <View style={[styles.webviewWrap]}>
                <AniWebview
                    originWhitelist={['*']}
                    scrollEnabled={true}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: {
                                        y: scrollX,
                                    },
                                },
                            },
                        ],
                        /* webview doesnt support the native driver just yet :() */
                        { useNativeDriver: false },
                    )}
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
                    style={[styles.webview]}
                />
            </View>
        </View>
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
