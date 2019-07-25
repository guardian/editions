import React from 'react'
import { View, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { CrosswordArticle } from 'src/common'
import { getBundleUri } from 'src/helpers/webview'

type Headline =
    | { type: 'text'; text: string }
    | { type: 'svg'; text: string; render: ReactNode }

const styles = StyleSheet.create({ flex: { flex: 1 } })

const Crossword = ({
    crosswordArticle,
}: {
    crosswordArticle: CrosswordArticle
}) => (
    <WebView
        originWhitelist={['*']}
        source={{ uri: getBundleUri('crosswords') }}
        injectedJavaScript={`
                window.loadCrosswordData(${JSON.stringify(
                    crosswordArticle.crossword,
                )}); true;
            `}
        allowFileAccess={true}
        javaScriptEnabled={true}
        style={styles.flex}
    />
)

export { Crossword }
