import React from 'react'
import { StyleSheet, View } from 'react-native'
import { WebView } from 'react-native-webview'
import { CrosswordArticle } from 'src/common'
import { getBundleUri } from 'src/helpers/webview'

const styles = StyleSheet.create({ flex: { flex: 1 } })

const Crossword = ({
    crosswordArticle,
}: {
    crosswordArticle: CrosswordArticle
}) => (
    <View
        style={{
            ...StyleSheet.absoluteFillObject,
            bottom: 150,
        }}
    >
        <WebView
            key={crosswordArticle.key}
            originWhitelist={['*']}
            source={{ uri: getBundleUri('crosswords') }}
            injectedJavaScript={`
                window.loadCrosswordData("${
                    crosswordArticle.key
                }", ${JSON.stringify(crosswordArticle.crossword)}); true;
            `}
            allowFileAccess={true}
            javaScriptEnabled={true}
            style={styles.flex}
        />
    </View>
)

export { Crossword }
