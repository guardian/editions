import React, { ReactNode, useEffect, useState } from 'react'
import { StyleSheet, View } from 'react-native'
import { BlockElement } from 'src/common'
import { useArticle } from 'src/hooks/use-article'
import { OnTopPositionChangeFn } from 'src/screens/article/helpers'
import { metrics } from 'src/theme/spacing'
import { Fader } from '../../layout/animators/fader'
import { ArticleHeaderProps } from '../article-header/types'
import { PropTypes as StandfirstPropTypes } from '../article-standfirst'
import { Wrap, WrapLayout } from '../wrap/wrap'
import { WebviewWithArticle } from './article/webview'

const styles = StyleSheet.create({
    block: {
        alignItems: 'flex-start',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    webviewWrap: {
        ...StyleSheet.absoluteFillObject,
    },
    webview: {
        flex: 1,
        /*
        The below line fixes crashes on Android
        https://github.com/react-native-community/react-native-webview/issues/429
        */
        opacity: 0.99,
    },
})

const ArticleWebView = ({
    header,
    onTopPositionChange,
    ...webviewProps
}: {
    header: ReactNode
    headerProps: ArticleHeaderProps
    article: BlockElement[]
    onTopPositionChange: OnTopPositionChangeFn
    wrapLayout: WrapLayout
}) => {
    return (
        <WebviewWithArticle
            {...webviewProps}
            scrollEnabled={true}
            useWebKit={false}
            style={[styles.webview]}
        />
    )
}

const Article = ({
    onTopPositionChange,
    article,
    ...headerProps
}: {
    article: BlockElement[]
    onTopPositionChange: OnTopPositionChangeFn
} & ArticleHeaderProps &
    StandfirstPropTypes) => {
    const [wrapLayout, setWrapLayout] = useState<WrapLayout | null>(null)
    useEffect(() => {
        onTopPositionChange(false)
    }, [])

    return (
        <Fader>
            {wrapLayout && (
                <WebviewWithArticle
                    headerProps={headerProps}
                    article={article}
                    scrollEnabled={true}
                    useWebKit={false}
                    style={[styles.webview]}
                    wrapLayout={wrapLayout}
                />
            )}
            <Wrap onWrapLayout={setWrapLayout}></Wrap>
        </Fader>
    )
}

export { Article }
