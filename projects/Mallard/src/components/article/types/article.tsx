import React, { useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import WebView from 'react-native-webview'
import { parsePing } from 'src/helpers/webview'
import { useArticle } from 'src/hooks/use-article'
import { OnTopPositionChangeFn } from 'src/screens/article/helpers'
import { metrics } from 'src/theme/spacing'
import { Article as ArticleT, PictureArticle } from '../../../../../common/src'
import { Fader } from '../../layout/animators/fader'
import { Wrap, WrapLayout } from '../wrap/wrap'
import { WebviewWithArticle } from './article/webview'

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
        flex: 1,
        overflow: 'hidden',
        /*
        The below line fixes crashes on Android
        https://github.com/react-native-community/react-native-webview/issues/429
        */
        opacity: 0.99,
    },
})

export enum ArticleTheme {
    Default = 'default',
    Dark = 'dark',
}

const Article = ({
    onTopPositionChange,
    article,
    theme = ArticleTheme.Default,
}: {
    article: ArticleT | PictureArticle
    onTopPositionChange: OnTopPositionChangeFn
    theme?: ArticleTheme
}) => {
    const [wrapLayout, setWrapLayout] = useState<WrapLayout | null>(null)
    const [, { type }] = useArticle()
    const ref = useRef<WebView | null>(null)
    return (
        <Fader>
            {wrapLayout && (
                <WebviewWithArticle
                    type={type}
                    article={article}
                    theme={theme}
                    scrollEnabled={true}
                    useWebKit={false}
                    style={[styles.webview]}
                    wrapLayout={wrapLayout}
                    _ref={r => {
                        ref.current = r
                    }}
                    onMessage={event => {
                        const { isAtTop } = parsePing(event.nativeEvent.data)
                        if (ref.current) {
                            // webViewRef is missing from the type definition
                            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                            // @ts-ignore
                            ref.current.webViewRef.current.measure(
                                (
                                    fx: number,
                                    fy: number,
                                    width: number,
                                    height: number,
                                    px: number,
                                ) => {
                                    if (px === 0) {
                                        onTopPositionChange(isAtTop)
                                    }
                                },
                            )
                        }
                    }}
                />
            )}
            <Wrap onWrapLayout={setWrapLayout}></Wrap>
        </Fader>
    )
}

export { Article }
