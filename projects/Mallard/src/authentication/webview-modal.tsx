import React from 'react'
import { Modal, View } from 'react-native'
import WebView from 'react-native-webview'

export const WebviewModal = ({
    url,
    visible,
    onStateChange,
}: {
    url: string
    visible: boolean
    onStateChange: (url: string) => void
}) => {
    return (
        <Modal visible={visible}>
            <View style={{ flex: 1, backgroundColor: 'red' }}>
                <WebView
                    source={{ uri: url }}
                    onNavigationStateChange={newState => {
                        const { url } = newState
                        console.log('Webview url change:', url)
                        onStateChange(url)
                    }}
                />
            </View>
        </Modal>
    )
}
