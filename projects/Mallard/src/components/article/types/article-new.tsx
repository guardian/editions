import React, { useRef, useState } from 'react'
import { StyleSheet } from 'react-native'
import WebView from 'react-native-webview'
import { BlockElement } from 'src/common'
import { parsePing } from 'src/helpers/webview'
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
    const [, { type }] = useArticle()
    const ref = useRef<{ _component: WebView } | null>(null)
    return (
        <Fader>
            {wrapLayout && (
                <WebviewWithArticle
                    headerProps={{ ...headerProps, type: type }}
                    article={article}
                    scrollEnabled={true}
                    useWebKit={false}
                    style={[styles.webview]}
                    wrapLayout={wrapLayout}
                    _ref={r => {
                        ref.current = r
                    }}
                    onMessage={event => {
                        const { isAtTop } = parsePing(event.nativeEvent.data)
                        if (ref.current) {
                            // webViewRef is missing from the type definition
                            // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
                            // @ts-ignore
                            ref.current._component.webViewRef.current.measure(
                                (
                                    fx: number,
                                    fy: number,
                                    width: number,
                                    height: number,
                                    px: number,
                                ) => {
                                    if (px === 0) {
                                        onTopPositionChange(isAtTop)
                                    }
                                },
                            )
                        }
                    }}
                />
            )}
            <Wrap onWrapLayout={setWrapLayout}></Wrap>
        </Fader>
    )
}

export { Article }
