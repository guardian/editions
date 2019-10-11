import { useNetInfo } from '@react-native-community/netinfo'
import React, { useMemo } from 'react'
import { Animated } from 'react-native'
import { WebView, WebViewProps } from 'react-native-webview'
import { BlockElement, ArticleType } from 'src/common'
import { useArticle } from 'src/hooks/use-article'
import { ArticleHeaderProps } from '../../article-header/types'
import { useRenderedHTML } from '../../html/render'
import { WrapLayout } from '../../wrap/wrap'
import { onShouldStartLoadWithRequest } from './helpers'
import { useIssueSummary } from 'src/hooks/use-issue-summary'

const AniWebView = Animated.createAnimatedComponent(WebView)

const WebviewWithArticle = ({
    article,
    wrapLayout,
    headerProps,
    paddingTop = 0,
    _ref,
    ...webViewProps
}: {
    article: BlockElement[]
    wrapLayout: WrapLayout
    headerProps?: ArticleHeaderProps & { type: ArticleType }
    paddingTop?: number
    _ref?: (ref: { _component: WebView }) => void
} & WebViewProps & { onScroll?: any }) => {
    const { isConnected } = useNetInfo()
    const [, { pillar }] = useArticle()
    const { issueId } = useIssueSummary()

    const html = useRenderedHTML(article, {
        pillar,
        wrapLayout,
        headerProps,
        showWebHeader: true,
        showMedia: isConnected,
        height: paddingTop,
        publishedId: (issueId && issueId.publishedIssueId) || null,
    })

    return (
        <AniWebView
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
