import React, { ReactNode, useState, useEffect } from 'react'
import { Animated, Dimensions, StyleSheet, View, Platform } from 'react-native'
import { ScrollView } from 'react-native-gesture-handler'
import { BlockElement } from 'src/common'
import { safeInterpolation } from 'src/helpers/math'
import { useArticle } from 'src/hooks/use-article'
import { metrics } from 'src/theme/spacing'
import { Fader } from '../../layout/animators/fader'
import { ArticleHeader } from '../article-header'
import { ArticleHeaderProps } from '../article-header/types'
import { PropTypes as StandfirstPropTypes } from '../article-standfirst'
import { Wrap, WrapLayout } from '../wrap/wrap'
import { WebviewWithArticle } from './article/webview'
import {
    wireScrollBarToDismiss,
    OnTopPositionChangeFn,
} from 'src/screens/article/helpers'

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
        backgroundColor: 'yellow',
        width: '100%',
        height: 100,
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
    const [height, setHeight] = useState(Dimensions.get('window').height)
    useEffect(() => {
        onTopPositionChange(false)
    }, [])
    return (
        <View style={[styles.webview]}>
            <WebviewWithArticle
                {...webviewProps}
                scrollEnabled={true}
                useWebKit={false}
                style={[styles.webview]}
            />
        </View>
    )
}

const androidStyles = StyleSheet.create({
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        width: '100%',
        zIndex: 999999,
    },
    wrapper: {
        height: '100%',
    },
})

const Article = ({
    article,
    onTopPositionChange,
    ...headerProps
}: {
    article: BlockElement[]
    onTopPositionChange: OnTopPositionChangeFn
} & ArticleHeaderProps &
    StandfirstPropTypes) => {
    const [wrapLayout, setWrapLayout] = useState<WrapLayout | null>(null)
    const [, { type }] = useArticle()

    return (
        <>
            <Fader>
                {wrapLayout && (
                    <ArticleWebView
                        header={<View />}
                        headerProps={headerProps}
                        article={article}
                        onTopPositionChange={onTopPositionChange}
                        wrapLayout={wrapLayout}
                    />
                )}

                <Wrap onWrapLayout={setWrapLayout}></Wrap>
            </Fader>
        </>
    )
}

export { Article }
