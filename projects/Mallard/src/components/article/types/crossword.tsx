import React from 'react'
import { StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'
import { CrosswordArticle } from 'src/common'
import { getBundleUri } from 'src/helpers/webview'

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
