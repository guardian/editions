import React, { useState } from 'react'
import { WebView, WebViewProps } from 'react-native-webview'
import { ArticleType } from 'src/common'
import { useArticle } from 'src/hooks/use-article'
import { Article, PictureArticle, GalleryArticle, ImageSize } from 'src/common'
import { renderArticle } from '../../html/article'
import { onShouldStartLoadWithRequest } from './helpers'
import { useApolloClient } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { useQuery } from 'src/hooks/apollo'
import { FSPaths, APIPaths, PathToArticle } from 'src/paths'
import { Platform } from 'react-native'
import { Image, ImageUse, IssueOrigin } from 'src/common'

type QueryValue = { imageSize: ImageSize; apiUrl: string }
const QUERY = gql`
    {
        imageSize @client
        apiUrl @client
    }
`

const WebviewWithArticle = ({
    article,
    path,
    type,
    _ref,
    topPadding,
    origin,
    ...webViewProps
}: {
    article: Article | PictureArticle | GalleryArticle
    path: PathToArticle
    type: ArticleType
    _ref?: (ref: WebView) => void
    topPadding: number
    origin: IssueOrigin
} & WebViewProps & { onScroll?: any }) => {
    const client = useApolloClient()
    // This line ensures we don't re-render the article when
    // the network connection changes, see the comments around
    // `fetchImmediate` where it is defined
    const data = client.readQuery<{ netInfo: { isConnected: boolean } }>({
        query: gql('{ netInfo @client { isConnected @client } }'),
    })
    const [isConnected] = useState(
        data != null ? data.netInfo.isConnected : false,
    )

    // FIXME: pass this as article data instead so it's never out-of-sync?
    const [, { pillar }] = useArticle()

    const res = useQuery<QueryValue>(QUERY)
    // Hold off rendering until we have all the necessary data.
    if (res.loading) return null
    const { imageSize, apiUrl } = res.data
    const { localIssueId, publishedIssueId } = path

    const getImagePath = (image?: Image, use: ImageUse = 'full-size') => {
        if (image == null) return undefined

        if (origin === 'filesystem') {
            const fs = FSPaths.image(localIssueId, imageSize, image, use)
            return Platform.OS === 'android' ? 'file:///' + fs : fs
        }
        if (origin !== 'api') throw new Error('unrecognized "origin"')

        const issueId = publishedIssueId
        const imagePath = APIPaths.image(issueId, imageSize, image, use)
        return `${apiUrl}${imagePath}`
    }

    const html = renderArticle(article.elements, {
        pillar,
        article,
        type,
        imageSize,
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
            allowFileAccessFromFileURLs={true}
        />
    )
}

export { WebviewWithArticle }
