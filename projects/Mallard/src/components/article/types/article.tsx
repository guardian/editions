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

export type HeaderControlProps = {
    /**
     * Called when the user scrolled up or down sufficiently that we want to
     * auto-hide the article header (slider, navbar...), or show it again.
     */
    onShouldShowHeaderChange: (shouldShowHeader: boolean) => void
    /**
     * Whether the header is shown right now.
     */
    shouldShowHeader: boolean
    /**
     * A padding, in points/pixel, which should added at the very top of the
     * article so that it accomodates the header that will be shown with
     * absolute positionning on top of it.
     */
    topPadding: number
}

/**
 * This takes care of updating the value of `shouldShowHeader` *within* the web
 * view. Since the API is imperative, we cannot pass this as a "prop" to the
 * JavaScript inside the webview. So instead we pass it imperatively when the
 * value changes. We try to minimize communication for perf. so we don't need to
 * do anything if the value changed because the webview itself communicated us a
 * change in the first place; it has the right value already.
 */
const useUpdateShowHeader = (
    webviewRef: React.MutableRefObject<WebView | null>,
    shouldShowHeader: boolean,
) => {
    const wasShowingHeader = useRef(true)
    useEffect(() => {
        if (webviewRef.current == null) return
        if (shouldShowHeader === wasShowingHeader.current) return
        wasShowingHeader.current = shouldShowHeader
        webviewRef.current.injectJavaScript(
            `window.shouldShowHeader = ${shouldShowHeader};`,
        )
    }, [shouldShowHeader])
    return wasShowingHeader
}

const Article = ({
    article,
    onShouldShowHeaderChange,
    shouldShowHeader,
    topPadding,
}: {
    article: ArticleT | PictureArticle | GalleryArticle
} & HeaderControlProps) => {
    const [, { type }] = useArticle()
    const ref = useRef<WebView | null>(null)

    const theme = usesDarkTheme(article.type)
        ? ArticleTheme.Dark
        : ArticleTheme.Default

    const wasShowingHeader = useUpdateShowHeader(ref, shouldShowHeader)

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
