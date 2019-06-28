import React, { useCallback, useRef, useState } from 'react'
import WebView from 'react-native-webview'
import { NativeSyntheticEvent } from 'react-native'
import { WebViewMessage } from 'react-native-webview/lib/WebViewTypes'
import { NavigationScreenProp } from 'react-navigation'

const USER_DATA_SUCCESS = 'USER_DATA_SUCCESS'
const USER_DATA_FAILURE = 'USER_DATA_FAILURE'
const COOKIES_NOT_SET = 'COOKIES_NOT_SET'

const LOG = 'LOG'

// for some reason this needs to be called inside a function when in injecting
const injectedJavascript = `
const hasGuIdentityCookie =
    document
        .cookie
        .split(";")
        .map(c => c.split("=")[0].trim())
        .find(key => key === "GU_U");


const msg = (type, data) =>
    window.ReactNativeWebView.postMessage(JSON.stringify({
        type,
        data
    }));

// for debugging
const log = str => msg('${LOG}', str);

// for some reason this needs wrapping in a function
const tryToAuthenticate = () => {
    if (hasGuIdentityCookie) {
        fetch('https://members-data-api.theguardian.com/user-attributes/me', {
            credentials: 'include'
        })
            .then(res => res.status === 200 ? res.json() : Promise.reject())
            .then(res => msg('${USER_DATA_SUCCESS}', res))
            .catch(() => msg('${USER_DATA_FAILURE}'))
    } else {
        msg('${COOKIES_NOT_SET}')
    }
}

tryToAuthenticate();
`

const AuthSwitcherScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const [isWebViewHidden, setIsWebViewHidden] = useState(true)

    const webViewRef = useRef<WebView>(null)

    const handleLoad = useCallback(() => {
        const { current } = webViewRef

        if (current) {
            current.injectJavaScript(injectedJavascript)
        }
    }, [])

    const handleMessage = useCallback(
        (event: NativeSyntheticEvent<WebViewMessage>) => {
            const { type, data } = JSON.parse(event.nativeEvent.data)

            switch (type) {
                case USER_DATA_SUCCESS: {
                    // TODO - change true to false
                    if (data.contentAccess.paidMember === false) {
                        // TODO - set a setting here rather than just navigating?
                        navigation.navigate('Authed')
                    }
                    break
                }
                case USER_DATA_FAILURE: {
                    // no-op
                }
                case COOKIES_NOT_SET: {
                    setIsWebViewHidden(false)
                }
                case LOG: {
                    console.log(data)
                }
            }
        },
        [navigation],
    )

    return (
        <WebView
            ref={webViewRef}
            style={[{ display: isWebViewHidden ? 'none' : 'flex' }]}
            source={{
                uri: 'https://profile.theguardian.com/signin/current',
            }}
            onLoad={handleLoad}
            onMessage={handleMessage}
        />
    )
}

export { AuthSwitcherScreen }
