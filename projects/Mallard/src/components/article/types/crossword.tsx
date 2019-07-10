import React, { useState } from 'react'
import { View, Dimensions, Platform } from 'react-native'
import { WebView } from 'react-native-webview'
import { color } from 'src/theme/color'
import { CrosswordArticle } from 'src/common'

const Crossword = ({
    crosswordArticle,
}: {
    crosswordArticle: CrosswordArticle
}) => {
    const [height, setHeight] = useState(Dimensions.get('window').height)
    const uri =
        (Platform.OS === 'android' ? 'file:///android_asset/' : '') +
        'Web.bundle/loader.html'

    return (
        <View style={{ backgroundColor: color.background }}>
            <WebView
                originWhitelist={['*']}
                source={{ uri }}
                onMessage={event => {
                    setHeight(parseInt(event.nativeEvent.data))
                }}
                injectedJavaScript={`window.onload = function() {
                            window.crosswordData = ${JSON.stringify(
                                crosswordArticle.crossword,
                            )}
                        };`}
                javaScriptEnabled={true}
                style={{ flex: 1, minHeight: height }}
            />
        </View>
    )
}

export { Crossword }
