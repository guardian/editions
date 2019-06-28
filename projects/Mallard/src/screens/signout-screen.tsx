import React from 'react'
import WebView from 'react-native-webview'

const SignoutScreen = ({ onSignout }: { onSignout: () => void }) => (
    <WebView
        style={[{ display: 'none' }]}
        source={{
            uri: 'https://profile.theguardian.com/signout',
        }}
        onLoad={onSignout}
    />
)

export { SignoutScreen }
