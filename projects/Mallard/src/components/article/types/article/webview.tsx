import { useNetInfo } from '@react-native-community/netinfo'
import React, { useMemo } from 'react'
import { Animated, Linking, Platform, WebViewProps } from 'react-native'
import { WebView } from 'react-native-webview'
import { ArticleFeatures, BlockElement } from 'src/common'
import { useArticle } from 'src/hooks/use-article'
import { useIssueCompositeKey } from 'src/hooks/use-issue-id'
import { EMBED_DOMAIN, render } from '../../html/render'
import { WrapLayout } from '../../wrap/wrap'

const urlIsNotAnEmbed = (url: string) =>
    !(
        url.startsWith(EMBED_DOMAIN) ||
        url.startsWith('https://www.youtube.com/embed')
    )

const features: ArticleFeatures[] = [ArticleFeatures.HasDropCap]

const AniWebview = Animated.createAnimatedComponent(WebView)

const WebviewWithArticle = ({
    article,
    wrapLayout,
    paddingTop = 0,
    ...webViewProps
}: {
    article: BlockElement[]
    wrapLayout: WrapLayout
    paddingTop?: number
} & WebViewProps & { onScroll?: any }) => {
    const { isConnected } = useNetInfo()
    const [, { pillar }] = useArticle()
    const issueCompositeKey = useIssueCompositeKey()

    const html = useMemo(
        () =>
            render(article, {
                pillar,
                features,
                wrapLayout,
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
        <AniWebview
            originWhitelist={['*']}
            scrollEnabled={true}
            source={{ html }}
            onShouldStartLoadWithRequest={(event: any) => {
                if (
                    Platform.select({
                        ios: event.navigationType === 'click',
                        android: urlIsNotAnEmbed(event.url), // android doesn't have 'click' types so check for our embed types
                    })
                ) {
                    Linking.openURL(event.url)
                    return false
                }
                return true
            }}
            {...webViewProps}
        />
    )
}

export { WebviewWithArticle }
