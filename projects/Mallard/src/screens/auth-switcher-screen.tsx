import React, { useState, useCallback, useEffect } from 'react'
import { View, TextInput, TextInputProps, Button, Text } from 'react-native'
import {
    fetchAndPersistUserAccessTokenWithIdentity,
    getMembershipDataForKeychainUser,
    fetchAndPersistUserAccessTokenWithFacebook,
} from 'src/authentication/helpers'
import WebView from 'react-native-webview'
import { WebViewNavigation } from 'react-native-webview/lib/WebViewTypes'

const parseURL = (url: string) => {
    const [path, searchString = ''] = url.split('?')
    const paramString = searchString.split('&')
    const init: { [key: string]: string } = {}
    const params = paramString.reduce((acc, p) => {
        const [key, value] = p.split('=')
        return { ...acc, [key]: decodeURIComponent(value) }
    }, init)

    return {
        path,
        params,
    }
}

interface WebAuthProps {
    uri: string
    tokenParamKey: string
    onSuccess: (token: string) => void
    stateParamKey?: string
    redirectURI: string
}

const WebAuth = ({
    uri,
    tokenParamKey,
    onSuccess,
    redirectURI,
}: WebAuthProps) => {
    const [shouldShow, setShouldShow] = useState(false)
    return (
        <WebView
            style={{ display: shouldShow ? 'flex' : 'none' }}
            source={{ uri }}
            onNavigationStateChange={(e: WebViewNavigation) => {
                const { path, params } = parseURL(e.url)
                const token = params[tokenParamKey]
                return path === redirectURI && token
                    ? onSuccess(token)
                    : !shouldShow && setShouldShow(true)
            }}
        />
    )
}

interface FBWebAuthProps {
    clientId: string
    onSuccess: (token: string) => void
    redirectURI: string
}

const FBWebAuth = ({ clientId, onSuccess, redirectURI }: FBWebAuthProps) => (
    <WebAuth
        tokenParamKey="#access_token"
        redirectURI={redirectURI}
        uri={encodeURI(
            `https://www.facebook.com/v3.3/dialog/oauth?client_id=${clientId}&response_type=token&redirect_uri=${redirectURI}`,
        )}
        onSuccess={onSuccess}
    />
)

const AuthInput = (props: TextInputProps) => (
    <TextInput
        {...props}
        style={[
            {
                borderColor: 'black',
                borderRadius: 4,
                borderWidth: 1,
                color: 'black',
                padding: 5,
                marginBottom: 10,
            },
        ]}
    />
)

enum AuthStatus {
    pending = 0,
    authed = 1,
    unathed = 2,
    authenticating = 3,
}

const AuthSwitcherScreen = ({
    onAuthenticated,
}: {
    onAuthenticated: () => void
}) => {
    const [authStatus, setAuthStatus] = useState(AuthStatus.pending)

    const [error, setError] = useState<string | null>(null)

    const [email, setEmail] = useState('')
    const onEmailChange = useCallback(value => {
        setEmail(value)
        setError(null)
    }, [])

    const [password, setPassword] = useState('')
    const onPasswordChange = useCallback(value => {
        setPassword(value)
        setError(null)
    }, [])

    const onSubmit = useCallback(async () => {
        try {
            setAuthStatus(AuthStatus.authenticating)
            const data = await fetchAndPersistUserAccessTokenWithIdentity(
                email,
                password,
            )
            if (!data) {
                setAuthStatus(AuthStatus.unathed)
            } else {
                onAuthenticated()
                console.log(data)
            }
        } catch (err) {
            setAuthStatus(AuthStatus.unathed)
            setError(err.message)
        }
    }, [email, password, onAuthenticated])

    // try to auth on mount
    useEffect(() => {
        getMembershipDataForKeychainUser().then(data => {
            if (!data) {
                setAuthStatus(AuthStatus.unathed)
            } else {
                onAuthenticated()
            }
        })
    }, []) // don't want to change on new deps as we only want this to run on mount

    switch (authStatus) {
        case AuthStatus.pending: {
            return <Text>Loading</Text>
        }
        case AuthStatus.authed: {
            // this should never show
            return <Text>Redirecting</Text>
        }
        case AuthStatus.authenticating:
        case AuthStatus.unathed: {
            return (
                <FBWebAuth
                    redirectURI="https://www.theguardian.com/uk"
                    clientId="180444840287"
                    onSuccess={async token => {
                        console.log('fb token', token)
                        const data = await fetchAndPersistUserAccessTokenWithFacebook(
                            token,
                        )
                        if (!data) {
                            setAuthStatus(AuthStatus.unathed)
                        } else {
                            onAuthenticated()
                            console.log(data)
                        }
                    }}
                />
            )
            return (
                <View
                    style={[
                        {
                            alignItems: 'stretch',
                            backgroundColor: 'white',
                            flex: 1,
                            justifyContent: 'center',
                            padding: 10,
                        },
                    ]}
                >
                    {error && <Text>{error}</Text>}
                    <AuthInput
                        editable={authStatus !== AuthStatus.authenticating}
                        autoCorrect={false}
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        value={email}
                        placeholder="Email"
                        onChangeText={onEmailChange}
                    ></AuthInput>
                    <AuthInput
                        editable={authStatus !== AuthStatus.authenticating}
                        autoCorrect={false}
                        autoCapitalize="none"
                        textContentType="password"
                        value={password}
                        placeholder="Password"
                        secureTextEntry
                        onChangeText={onPasswordChange}
                    ></AuthInput>
                    <Button title="submit" onPress={onSubmit}>
                        Submit
                    </Button>
                </View>
            )
        }
    }
}

export { AuthSwitcherScreen }
