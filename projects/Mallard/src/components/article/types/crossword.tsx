import React, { useState } from 'react'
import { View, Dimensions, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import { color } from 'src/theme/color'
import { CrosswordArticle } from 'src/common'
import { bundles } from 'src/html-bundle-info.json'

const Crossword = ({
    crosswordArticle,
}: {
    crosswordArticle: CrosswordArticle
}) => {
    const [height, setHeight] = useState(Dimensions.get('window').height)
    let sourceUri =
        (Platform.OS === 'android' ? 'file:///android_asset/' : '') +
        bundles.crosswords.key +
        '.bundle/index.html'
    sourceUri = 'http://localhost:' + bundles.crosswords.watchPort
    return (
        <View style={{ backgroundColor: color.background }}>
            <WebView
                originWhitelist={['*']}
                source={{ uri: sourceUri }}
                onMessage={event => {
                    setHeight(parseInt(event.nativeEvent.data))
                }}
                injectedJavaScript={`window.onload = function() {
                    window.crosswordData = ${JSON.stringify(
                        crosswordArticle.crossword,
                    )}
                };`}
                allowFileAccess={true}
                javaScriptEnabled={true}
                style={{ flex: 1, minHeight: height }}
            />
        </View>
    )
}

export { Crossword }
