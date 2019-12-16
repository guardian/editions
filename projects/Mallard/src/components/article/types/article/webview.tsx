import { fetchImmediate } from 'src/hooks/use-net-info'
import React, { useState, useCallback } from 'react'
import { WebView, WebViewProps } from 'react-native-webview'
import { ArticleType } from 'src/common'
import { useArticle } from 'src/hooks/use-article'
import { useImageSize } from 'src/hooks/use-image-size'
import {
    Article,
    PictureArticle,
    GalleryArticle,
} from '../../../../../../Apps/common/src'
import { renderArticle } from '../../html/article'
import { ArticleTheme } from '../article'
import { onShouldStartLoadWithRequest } from './helpers'
import { PathToArticle } from 'src/paths'
import {
    useCollectedImagePaths,
    renderWithImagePaths,
} from 'src/hooks/use-collected-image-paths'
import { useApiUrl } from 'src/hooks/use-settings'

const WebviewWithArticle = ({
    article,
    path,
    type,
    _ref,
    theme,
    topPadding,
    ...webViewProps
}: {
    article: Article | PictureArticle | GalleryArticle
    path: PathToArticle
    type: ArticleType
    theme: ArticleTheme
    _ref?: (ref: WebView) => void
    topPadding: number
} & WebViewProps & { onScroll?: any }) => {
    // This line ensures we don't re-render the article when
    // the network connection changes, see the comments around
    // `fetchImmediate` where it is defined
    const [{ isConnected }] = useState(fetchImmediate())

    // FIXME: pass this as article data instead so it's never out-of-sync
    const [, { pillar }] = useArticle()

    const { localIssueId, publishedIssueId } = path
    const { imageSize } = useImageSize()

    const renderThisArticle = useCallback(
        () =>
            renderArticle(article.elements, {
                pillar,
                article,
                type,
                imageSize,
                theme,
                showWebHeader: true,
                showMedia: isConnected,
                publishedId: publishedIssueId || null,
                topPadding,
            }),
        [
            article,
            pillar,
            type,
            imageSize,
            theme,
            isConnected,
            publishedIssueId,
            topPadding,
        ],
    )

    const apiUrl = useApiUrl()
    const imagePaths = useCollectedImagePaths(
        apiUrl,
        localIssueId,
        publishedIssueId,
        renderThisArticle,
    )
    const html = renderWithImagePaths(renderThisArticle, imagePaths)
    if (html == null) return null

    return (
        <WebView
            {...webViewProps}
            originWhitelist={['*']}
            scrollEnabled={true}
            source={{
                html,
                baseUrl:
                    '' /* required as per https://stackoverflow.com/a/51931187/609907 */,
            }}
            ref={_ref}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            allowFileAccess={true}
        />
    )
}

export { WebviewWithArticle }
