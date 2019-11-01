import React, { useRef, useEffect } from 'react'
import { StyleSheet, Share } from 'react-native'
import WebView from 'react-native-webview'
import { parsePing } from 'src/helpers/webview'
import { useArticle } from 'src/hooks/use-article'
import { metrics } from 'src/theme/spacing'
import { Fader } from '../../layout/animators/fader'
import { WebviewWithArticle } from './article/webview'
import {
    Article as ArticleT,
    PictureArticle,
    Content,
    GalleryArticle,
} from 'src/common'
import { Redshift } from 'aws-sdk'

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
    article,
    onShouldShowHeaderChange,
    shouldShowHeader,
    topPadding,
}: {
    article: ArticleT | PictureArticle | GalleryArticle
    onShouldShowHeaderChange: (shouldShowHeader: boolean) => void
    shouldShowHeader: boolean
    topPadding: number
}) => {
    const [, { type }] = useArticle()
    const ref = useRef<WebView | null>(null)

    const theme = usesDarkTheme(article.type)
        ? ArticleTheme.Dark
        : ArticleTheme.Default

    const wasShowingHeader = useRef(true)
    useEffect(() => {
        if (ref.current == null) return
        if (shouldShowHeader === wasShowingHeader.current) return
        wasShowingHeader.current = shouldShowHeader
        ref.current.injectJavaScript(
            `window.shouldShowHeader = ${shouldShowHeader};`,
        )
    }, [shouldShowHeader])

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
                topPadding={topPadding}
                onMessage={event => {
                    const parsed = parsePing(event.nativeEvent.data)
                    if (parsed.type === 'share') {
                        if (article.webUrl == null) return
                        Share.share({ message: article.webUrl })
                        return
                    }
                    if (parsed.type === 'shouldShowHeaderChange') {
                        wasShowingHeader.current = parsed.shouldShowHeader
                        onShouldShowHeaderChange(parsed.shouldShowHeader)
                    }
                }}
            />
        </Fader>
    )
}

export { Article }
