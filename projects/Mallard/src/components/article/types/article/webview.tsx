import { fetchImmediate } from 'src/hooks/use-net-info'
import React, { useState } from 'react'
import { WebView, WebViewProps } from 'react-native-webview'
import { ArticleType } from 'src/common'
import { useArticle } from 'src/hooks/use-article'
import { useImageSize } from 'src/hooks/use-image-size'
import {
    Article,
    PictureArticle,
    GalleryArticle,
    IssueOrigin,
    Image,
    ImageUse,
} from 'src/common'
import { renderArticle } from '../../html/article'
import { ArticleTheme } from '../article'
import { onShouldStartLoadWithRequest } from './helpers'
import { PathToArticle, APIPaths, FSPaths } from 'src/paths'
import { useApiUrl } from 'src/hooks/use-settings'
import { Platform } from 'react-native'

const WebviewWithArticle = ({
    article,
    path,
    type,
    _ref,
    theme,
    topPadding,
    origin,
    ...webViewProps
}: {
    article: Article | PictureArticle | GalleryArticle
    path: PathToArticle
    type: ArticleType
    theme: ArticleTheme
    _ref?: (ref: WebView) => void
    topPadding: number
    origin: IssueOrigin
} & WebViewProps & { onScroll?: any }) => {
    // This line ensures we don't re-render the article when
    // the network connection changes, see the comments around
    // `fetchImmediate` where it is defined
    const [{ isConnected }] = useState(fetchImmediate())

    // FIXME: pass this as article data instead so it's never out-of-sync?
    const [, { pillar }] = useArticle()

    const { localIssueId, publishedIssueId } = path
    const imageSize = useImageSize()
    const apiUrl = useApiUrl()

    const getImagePath = (image?: Image, use: ImageUse = 'full-size') => {
        if (image == null) return undefined

        if (origin === 'fs') {
            const fs = FSPaths.image(localIssueId, imageSize, image, use)
            return Platform.OS === 'android' ? 'file:///' + fs : fs
        }

        const issueId = publishedIssueId
        const imagePath = APIPaths.image(issueId, imageSize, image, use)
        return `${apiUrl}${imagePath}`
    }

    const html = renderArticle(article.elements, {
        pillar,
        article,
        type,
        imageSize,
        theme,
        showWebHeader: true,
        showMedia: isConnected,
        publishedId: publishedIssueId || null,
        topPadding,
        getImagePath,
    })

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
