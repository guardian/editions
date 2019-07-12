import React, { useState, useCallback, useEffect } from 'react'
import { View, TextInput, Button, Text } from 'react-native'
import {
    fetchAndPersistUserAccessTokenWithIdentity,
    fetchMembershipDataForKeychainUser,
    canViewEdition,
} from 'src/authentication/helpers'
import { facebookAuthWithDeepRedirect } from 'src/authentication/services/facebook'
import { googleAuthWithDeepRedirect } from 'src/authentication/services/google'

enum AuthStatus {
    pending = 0,
    authed = 1,
    unauthed = 2,
    authenticating = 3,
}

const useRandomState = () =>
    useState(
        Math.random()
            .toString()
            .split('.')[1],
    )[0]

const tryAuth = async (
    authPromise: Promise<unknown>,
    {
        onSuccess,
        onError,
    }: {
        onSuccess: () => void
        onError: (err: string) => void
    },
) => {
    try {
        await authPromise
        const membershipData = await fetchMembershipDataForKeychainUser()

        if (!membershipData) {
            onError('Could not find membership data')
            return
        }

        if (!canViewEdition(membershipData)) {
            onSuccess()
            return
        }

        onError(
            'You are unable to access editions with your current subscription',
        )
    } catch (err) {
        onError(err instanceof Error ? err.message : err)
    }
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

    const validatorString = useRandomState()

    const handleAuthClick = async (authPromise: Promise<string>) => {
        setError(null)
        setAuthStatus(AuthStatus.authenticating)
        tryAuth(authPromise, {
            onError: err => {
                setAuthStatus(AuthStatus.unauthed)
                setError(err)
            },
            onSuccess: onAuthenticated,
        })
    }

    // try to auth on mount
    useEffect(() => {
        tryAuth(fetchMembershipDataForKeychainUser(), {
            onError: () => {
                setAuthStatus(AuthStatus.unauthed)
            },
            onSuccess: onAuthenticated,
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
        // Intentional fall through
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
                    {authStatus === AuthStatus.authenticating && (
                        <Text>Loading spinner ...</Text>
                    )}
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
