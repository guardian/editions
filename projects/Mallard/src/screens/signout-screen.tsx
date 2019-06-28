import React from 'react'
import WebView from 'react-native-webview'

const SignoutScreen = ({ onSignout }: { onSignout: () => void }) => (
    <WebView
        style={[{ display: 'none' }]}
        source={{
            uri: 'https://profile.theguardian.com/signout',
        }}
        onLoadProgress={e => {
            // use this as a proxy for having received headers
            // probably a better way to do this!
            if (e.nativeEvent.title) {
                onSignout()
            }
        }}
    />
)

export { SignoutScreen }
