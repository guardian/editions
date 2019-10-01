import { useNetInfo } from '@react-native-community/netinfo'
import React, { useMemo } from 'react'
import { Animated } from 'react-native'
import { WebView, WebViewProps } from 'react-native-webview'
import { BlockElement, ArticleType } from 'src/common'
import { useArticle } from 'src/hooks/use-article'
import { useIssueCompositeKey } from 'src/hooks/use-issue-id'
import { ArticleHeaderProps } from '../../article-header/types'
import { render } from '../../html/render'
import { WrapLayout } from '../../wrap/wrap'
import { onShouldStartLoadWithRequest } from './helpers'

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
    const issueCompositeKey = useIssueCompositeKey()

    const html = useMemo(
        () =>
            render(article, {
                pillar,
                wrapLayout,
                headerProps,
                showWebHeader: true,
                showMedia: isConnected,
                height: paddingTop,
                publishedId:
                    (issueCompositeKey && issueCompositeKey.publishedIssueId) ||
                    null,
            }),
        [
            article,
            pillar,
            wrapLayout,
            isConnected,
            paddingTop,
            issueCompositeKey,
        ],
    )

    return (
        <AniWebView
            {...webViewProps}
            originWhitelist={['*']}
            scrollEnabled={true}
            source={{ html }}
            ref={_ref}
            onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
        />
    )
}

export { WebviewWithArticle }
