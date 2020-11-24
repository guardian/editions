import React from 'react'
import { Platform } from 'react-native'
import { WebView, WebViewProps } from 'react-native-webview'
import {
    Article,
    GalleryArticle,
    IssueOrigin,
    PictureArticle,
} from 'src/common'
import { defaultSettings } from 'src/helpers/settings/defaults'
import { useLargeDeviceMemory } from 'src/hooks/use-config-provider'
import { FSPaths, PathToArticle } from 'src/paths'
import { onShouldStartLoadWithRequest } from './helpers'

const WebviewWithArticle = ({
    article,
    path,
    _ref,
    origin,
    ...webViewProps
}: {
    article: Article | PictureArticle | GalleryArticle
    path: PathToArticle
    _ref?: (ref: WebView) => void
    origin: IssueOrigin
} & WebViewProps & { onScroll?: any }) => {
    const { localIssueId } = path
    const largeDeviceMemory = useLargeDeviceMemory()

    // Online rendering
    let uri = `${defaultSettings.appsRenderingService}${article.internalPageCode}?editions`

    // Offline rendering
    if (origin === 'filesystem') {
        const htmlUri = `${FSPaths.issueRoot(localIssueId)}/${
            article.internalPageCode
        }.html`
        uri = Platform.OS === 'android' ? 'file:///' + htmlUri : htmlUri
    }

    return (
        <WebView
            {...webViewProps}
            bounces={largeDeviceMemory ? true : false}
            originWhitelist={['*']}
            scrollEnabled={true}
            source={{ uri }}
            ref={_ref}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
            allowFileAccess={true}
            allowFileAccessFromFileURLs={true}
            allowingReadAccessToURL={FSPaths.issuesDir}
        />
    )
}

export { WebviewWithArticle }
