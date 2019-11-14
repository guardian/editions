import { useNetInfo } from '@react-native-community/netinfo'
import React from 'react'
import { WebView, WebViewProps } from 'react-native-webview'
import { ArticleType } from 'src/common'
import { useArticle } from 'src/hooks/use-article'
import { useImageSize } from 'src/hooks/use-image-size'
import { useIssueSummary } from 'src/hooks/use-issue-summary'
import {
    Article,
    PictureArticle,
    GalleryArticle,
} from '../../../../../../common/src'
import { renderArticle } from '../../html/article'
import { ArticleTheme } from '../article'
import { onShouldStartLoadWithRequest } from './helpers'

const WebviewWithArticle = ({
    article,
    type,
    _ref,
    theme,
    topPadding,
    ...webViewProps
}: {
    article: Article | PictureArticle | GalleryArticle
    type: ArticleType
    theme: ArticleTheme
    _ref?: (ref: WebView) => void
    topPadding: number
} & WebViewProps & { onScroll?: any }) => {
    const { isConnected } = useNetInfo()
    const [, { pillar }] = useArticle()
    const { issueId } = useIssueSummary()
    const { imageSize } = useImageSize()

    const html = renderArticle(article.elements, {
        pillar,
        article,
        type,
        imageSize,
        theme,
        showWebHeader: true,
        showMedia: isConnected,
        publishedId: (issueId && issueId.publishedIssueId) || null,
        topPadding,
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
