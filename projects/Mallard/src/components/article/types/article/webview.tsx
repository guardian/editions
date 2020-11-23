import React from 'react'
import { WebView, WebViewProps } from 'react-native-webview'
import { Article, PictureArticle, GalleryArticle, ImageSize } from 'src/common'
import { onShouldStartLoadWithRequest } from './helpers'
import gql from 'graphql-tag'
import { useQuery } from 'src/hooks/apollo'
import { useLargeDeviceMemory } from 'src/hooks/use-config-provider'
import { FSPaths, PathToIssue } from 'src/paths'
import { Platform } from 'react-native'

type QueryValue = { imageSize: ImageSize; apiUrl: string }
const QUERY = gql`
    {
        imageSize @client
        apiUrl @client
    }
`

const WebviewWithArticle = ({
    article,
    issueId,
    _ref,
    ...webViewProps
}: {
    article: Article | PictureArticle | GalleryArticle
    issueId: PathToIssue | null
    _ref?: (ref: WebView) => void
} & WebViewProps & { onScroll?: any }) => {
    const largeDeviceMemory = useLargeDeviceMemory()

    const res = useQuery<QueryValue>(QUERY)
    // Hold off rendering until we have all the necessary data.
    if (res.loading) return null

    // const uri =
    //     defaultSettings.appRenderingService + article.key + '?template=editions'
    
    // console.log('ISSUE ID:' + JSON.stringify(issueId))
    // console.log('ISSUE DIR: ' + FSPaths.issuesDir)
    const articlePath = FSPaths.issuesDir + '/' + issueId?.localIssueId + '/html/' + `${article.internalPageCode}` + '.html'
    console.log('Article path: ' + articlePath)
    // const hash = path.replace(/\//g, '_')
    // const coreuri = FSPaths.issuesDir + '/daily-edition/2020-11-03/html/tabletXL/' + hash + '.html'
    const uri = Platform.OS === 'android' ? 'file:///' + articlePath : articlePath  
 
    return (
        <WebView
            {...webViewProps}
            bounces={largeDeviceMemory ? true : false}
            originWhitelist={['*']}
            scrollEnabled={true}
            source={{
                uri,
                baseUrl: ''
                // baseUrl: FSPaths.issuesDir + '/daily-edition/2020-10-14/jamestest/' /* required as per https://stackoverflow.com/a/51931187/609907 */,
            }}
            ref={_ref}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            allowFileAccess={true}
            allowFileAccessFromFileURLs={true}
            allowingReadAccessToURL={FSPaths.issuesDir}
        />
    )
}

export { WebviewWithArticle }
