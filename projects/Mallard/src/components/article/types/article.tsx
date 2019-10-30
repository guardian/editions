import React, { useRef } from 'react'
import { StyleSheet, Share, Platform } from 'react-native'
import WebView from 'react-native-webview'
import { parsePing } from 'src/helpers/webview'
import { useArticle } from 'src/hooks/use-article'
import { OnTopPositionChangeFn } from 'src/screens/article/helpers'
import { metrics } from 'src/theme/spacing'
import { Fader } from '../../layout/animators/fader'
import { WebviewWithArticle } from './article/webview'
import {
    Article as ArticleT,
    PictureArticle,
    Content,
    GalleryArticle,
} from 'src/common'

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

const usesDarkTheme = (type: Content['type']) =>
    ['picture', 'gallery'].includes(type)

const Article = ({
    onTopPositionChange,
    article,
}: {
    article: ArticleT | PictureArticle | GalleryArticle
    onTopPositionChange: OnTopPositionChangeFn
}) => {
    const [, { type }] = useArticle()
    const ref = useRef<WebView | null>(null)

    const theme = usesDarkTheme(article.type)
        ? ArticleTheme.Dark
        : ArticleTheme.Default

    return (
        <Fader>
            <WebviewWithArticle
                type={type}
                article={article}
                theme={theme}
                scrollEnabled={true}
                useWebKit={false}
                style={[styles.webview]}
                _ref={r => {
                    ref.current = r
                }}
                onMessage={event => {
                    const parsed = parsePing(event.nativeEvent.data)
                    if (parsed.type === 'share') {
                        if (article.webUrl == null) return
                        Share.share({ message: article.webUrl })
                        return
                    }
                    const { isAtTop } = parsed
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
        </Fader>
    )
}

export { Article }
