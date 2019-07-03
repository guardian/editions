import React, { useState, useCallback, useEffect } from 'react'
import { View, TextInput, TextInputProps, Button, Text } from 'react-native'
import {
    fetchAndPersistUserAccessToken,
    getMembershipDataForKeychainUser,
} from 'src/authentication/helpers'
import { LoginButton, AccessToken } from 'react-native-fbsdk'

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
            const data = await fetchAndPersistUserAccessToken(email, password)
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
                    <LoginButton
                        onLoginFinished={(error, result) => {
                            if (error) {
                                console.log('login has error: ' + result.error)
                                setError(result.error)
                            } else if (result.isCancelled) {
                                console.log('login is cancelled.')
                            } else {
                                AccessToken.getCurrentAccessToken().then(
                                    data => {
                                        if (data) {
                                            console.log(
                                                data.accessToken.toString(),
                                            )
                                        }
                                    },
                                )
                            }
                        }}
                    />
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
