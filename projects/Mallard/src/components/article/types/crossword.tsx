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
    const sourceUri =
        (Platform.OS === 'android' ? 'file:///android_asset/' : '') +
        'crosswords.bundle/index.html'

    return (
        <View style={{ backgroundColor: color.background }}>
            <WebView
                originWhitelist={['*']}
                source={{ uri: sourceUri }}
                onMessage={event => {
                    setHeight(parseInt(event.nativeEvent.data))
                }}
                allowFileAccess={true}
                javaScriptEnabled={true}
                style={{ flex: 1, minHeight: height }}
            />
        </View>
    )
}

export { Crossword }
