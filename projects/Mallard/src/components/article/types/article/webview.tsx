import { fetchImmediate } from 'src/hooks/use-net-info'
import React, { useState } from 'react'
import { WebView, WebViewProps } from 'react-native-webview'
import { ArticleType } from 'src/common'
import { useArticle } from 'src/hooks/use-article'
import { Article, PictureArticle, GalleryArticle, ImageSize } from 'src/common'
import { renderArticle } from '../../html/article'
import { ArticleTheme } from '../article'
import { onShouldStartLoadWithRequest } from './helpers'
import { useQuery } from 'src/hooks/apollo'
import gql from 'graphql-tag'
import { PathToIssue } from 'src/paths'

type QueryValue = { imageSize: ImageSize; issueId: PathToIssue }
const QUERY = gql`
    {
        imageSize @client
        issueId @client
    }
`

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
    // This line ensures we don't re-render the article when
    // the network connection changes, see the comments around
    // `fetchImmediate` where it is defined
    const [{ isConnected }] = useState(fetchImmediate())
    const [, { pillar }] = useArticle()

    const res = useQuery<QueryValue>(QUERY)
    // Hold off rendering until we have all the necessary data.
    if (res.loading) return null
    const { imageSize, issueId } = res.data

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
