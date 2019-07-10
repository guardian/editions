import React, { useState, useCallback, useEffect } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import {
    fetchAndPersistUserAccessTokenWithIdentity,
    fetchMembershipDataForKeychainUser,
} from 'src/authentication/helpers'
import { facebookAuthWithDeepRedirect } from 'src/authentication/services/facebook'
import { googleAuthWithDeepRedirect } from 'src/authentication/services/google'

enum AuthStatus {
    pending = 0,
    authed = 1,
    unauthed = 2,
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

    const [validatorString] = useState(Math.random().toString())

    const handleAuthClick = async (authPromise: Promise<string>) => {
        setError(null)
        try {
            setAuthStatus(AuthStatus.authenticating)
            const data = await authPromise
            if (!data) {
                setAuthStatus(AuthStatus.unauthed)
            } else {
                fetchMembershipDataForKeychainUser().then(data => {
                    if (!data) {
                        setAuthStatus(AuthStatus.unauthed)
                    } else {
                        // TODO: check this person can actually use the app
                        console.log(data)
                        onAuthenticated()
                    }
                })
            }
        } catch (err) {
            setAuthStatus(AuthStatus.unauthed)
            setError(err instanceof Error ? err.message : err)
        }
    }

    // try to auth on mount
    useEffect(() => {
        fetchMembershipDataForKeychainUser().then(data => {
            if (!data) {
                setAuthStatus(AuthStatus.unauthed)
            } else {
                // TODO: check this person can actually use the app
                console.log(data)
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
        case AuthStatus.unauthed: {
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
                    <Button
                        onPress={() =>
                            handleAuthClick(
                                facebookAuthWithDeepRedirect(validatorString),
                            )
                        }
                        title="Login with Facebook"
                    >
                        Login with Facebook
                    </Button>
                    <Button
                        onPress={() =>
                            handleAuthClick(
                                googleAuthWithDeepRedirect(validatorString),
                            )
                        }
                        title="Login with Google"
                    >
                        Login with Google
                    </Button>
                    <TextInput
                        style={{
                            borderColor: 'black',
                            borderRadius: 4,
                            borderWidth: 1,
                            color: 'black',
                            padding: 5,
                            marginBottom: 10,
                        }}
                        editable={authStatus !== AuthStatus.authenticating}
                        autoCorrect={false}
                        autoCapitalize="none"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        value={email}
                        placeholder="Email"
                        onChangeText={onEmailChange}
                    ></TextInput>
                    <TextInput
                        style={{
                            borderColor: 'black',
                            borderRadius: 4,
                            borderWidth: 1,
                            color: 'black',
                            padding: 5,
                            marginBottom: 10,
                        }}
                        editable={authStatus !== AuthStatus.authenticating}
                        autoCorrect={false}
                        autoCapitalize="none"
                        textContentType="password"
                        value={password}
                        placeholder="Password"
                        secureTextEntry
                        onChangeText={onPasswordChange}
                    ></TextInput>
                    <Button
                        title="submit"
                        onPress={() =>
                            handleAuthClick(
                                fetchAndPersistUserAccessTokenWithIdentity(
                                    email,
                                    password,
                                ),
                            )
                        }
                    >
                        Submit
                    </Button>
                </View>
            )
        }
    }
}

export { AuthSwitcherScreen }
