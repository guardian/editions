import React, { useState, useCallback, useEffect } from 'react'
import {
    View,
    TextInput,
    Text,
    KeyboardAvoidingView,
    Keyboard,
} from 'react-native'
import {
    fetchAndPersistUserAccessTokenWithIdentity,
    fetchMembershipDataForKeychainUser,
    canViewEdition,
} from 'src/authentication/helpers'
import { facebookAuthWithDeepRedirect } from 'src/authentication/services/facebook'
import { googleAuthWithDeepRedirect } from 'src/authentication/services/google'
import { Button, ButtonAppearance } from 'src/components/button/button'
import { appAppearances } from 'src/theme/appearance'
import { metrics } from 'src/theme/spacing'
import { TitlepieceText } from 'src/components/styled-text'
import { FadeIn } from 'src/components/bounce-fade-in'
import { Spinner } from 'src/components/spinner'

enum AuthStatus {
    pending = 0,
    authed = 1, // can't guarantee the callback will navigate away so will leave this here
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
    {
        onStart = () => {},
        onSuccess,
        onError,
    }: {
        onStart?: () => void
        onSuccess: () => void
        onError: (err: string) => void
    },
    authPromise: Promise<unknown> = Promise.resolve(null),
) => {
    try {
        await authPromise
        onStart()
        const membershipData = await fetchMembershipDataForKeychainUser()

        if (!membershipData) {
            onError('Could not find membership data')
            return
        }

        if (canViewEdition(membershipData)) {
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

const LoginPage = ({
    children,
    showSpinner,
}: {
    children: React.ReactNode
    showSpinner: boolean
}) => {
    return (
        <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={[
                    {
                        backgroundColor: appAppearances.primary.backgroundColor,
                        flex: 1,
                        justifyContent: 'center',
                        padding: 10,
                    },
                ]}
                behavior="padding"
            >
                <View
                    style={{
                        left: 10,
                        position: 'absolute',
                        top: 100,
                        width: '100%',
                        alignItems: 'center',
                    }}
                >
                    {showSpinner && <Spinner />}
                </View>
                <FadeIn duration={1000}>{children}</FadeIn>
            </KeyboardAvoidingView>
        </View>
    )
}

const AuthSwitcherScreen = ({
    onAuthenticated,
    onDismiss,
}: {
    onAuthenticated: () => void
    onDismiss: () => void
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
        tryAuth(
            {
                onStart: () => {
                    setAuthStatus(AuthStatus.authenticating)
                },
                onError: err => {
                    setAuthStatus(AuthStatus.unauthed)
                    setError(err)
                },
                onSuccess: onAuthenticated,
            },
            authPromise,
        )
    }

    // try to auth on mount
    useEffect(() => {
        tryAuth({
            onError: () => {
                setAuthStatus(AuthStatus.unauthed)
            },
            onSuccess: onAuthenticated,
        })
    }, [onAuthenticated]) // don't want to change on new deps as we only want this to run on mount

    return (
        <LoginPage
            showSpinner={
                authStatus === AuthStatus.authenticating ||
                authStatus === AuthStatus.pending
            }
        >
            {authStatus !== AuthStatus.pending ? (
                <>
                    <TitlepieceText
                        style={{
                            color: 'white',
                            fontSize: 50,
                            lineHeight: 50,
                            marginBottom: 50,
                            textAlign: 'center',
                        }}
                    >
                        Sign in
                    </TitlepieceText>
                    {error && (
                        <Text
                            style={{
                                color: 'white',
                                padding: 10,
                                textAlign: 'center',
                            }}
                        >
                            {error}
                        </Text>
                    )}
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-around',
                            marginBottom: 10,
                        }}
                    >
                        <Button
                            appearance={ButtonAppearance.skeletonLight}
                            style={{
                                flex: 1,
                            }}
                            center
                            onPress={() =>
                                handleAuthClick(
                                    facebookAuthWithDeepRedirect(
                                        validatorString,
                                    ),
                                )
                            }
                        >
                            Facebook
                        </Button>
                        <Button
                            appearance={ButtonAppearance.skeletonLight}
                            style={{
                                flex: 1,
                                marginLeft: 10,
                            }}
                            center
                            onPress={() =>
                                handleAuthClick(
                                    googleAuthWithDeepRedirect(validatorString),
                                )
                            }
                        >
                            Google
                        </Button>
                    </View>
                    <TextInput
                        style={{
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderRadius: 999,
                            color: 'black',
                            marginBottom: 10,
                            padding: metrics.horizontal * 2,
                            paddingVertical: metrics.vertical,
                        }}
                        onSubmitEditing={Keyboard.dismiss}
                        returnKeyType="done"
                        placeholderTextColor="grey"
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
                            backgroundColor: 'white',
                            borderWidth: 1,
                            borderRadius: 999,
                            color: 'black',
                            marginBottom: 10,
                            padding: metrics.horizontal * 2,
                            paddingVertical: metrics.vertical,
                        }}
                        placeholderTextColor="grey"
                        editable={authStatus !== AuthStatus.authenticating}
                        onSubmitEditing={Keyboard.dismiss}
                        returnKeyType="done"
                        autoCorrect={false}
                        autoCapitalize="none"
                        textContentType="password"
                        value={password}
                        placeholder="Password"
                        secureTextEntry
                        onChangeText={onPasswordChange}
                    ></TextInput>
                    <Button
                        center
                        buttonStyles={{
                            marginBottom: 10,
                        }}
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
                    <Button
                        appearance={ButtonAppearance.skeletonLight}
                        center
                        onPress={onDismiss}
                    >
                        Not now
                    </Button>
                </>
            ) : null}
        </LoginPage>
    )
}

export { AuthSwitcherScreen }
