import React, { useState, useCallback, useContext } from 'react'
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
import { MembersDataAPIResponse } from 'src/services/membership-service'
import { AuthContext } from 'src/authentication/auth-context'
import { NavigationScreenProp } from 'react-navigation'
import { useModal } from 'src/components/modal'
import { SubNotFoundModalCard } from 'src/components/sub-not-found-modal-card'
import { routeNames } from 'src/navigation'

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
        onSuccess: (data: MembersDataAPIResponse) => void
        onError: (err: string) => void
    },
    authRunner: () => Promise<unknown> = () => Promise.resolve(null),
) => {
    try {
        await authRunner()
        onStart()
        const membershipData = await fetchMembershipDataForKeychainUser()

        if (!membershipData) {
            onError('Could not find membership data')
            return
        }

        onSuccess(membershipData)
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
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const [isLoading, setIsLoading] = useState(false)

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

    const { setData, signOut } = useContext(AuthContext)
    const { open } = useModal()

    const handleAuthClick = async (authRunner: () => Promise<string>) => {
        setError(null)
        await signOut()
        tryAuth(
            {
                onStart: () => {
                    setIsLoading(true)
                },
                onError: err => {
                    setIsLoading(false)
                    setError(err)
                },
                onSuccess: data => {
                    setIsLoading(false)
                    setData(data)
                    if (!canViewEdition(data)) {
                        open(close => (
                            <SubNotFoundModalCard
                                onDismiss={() => navigation.goBack()}
                                onLoginPress={() =>
                                    navigation.navigate(routeNames.SignIn)
                                }
                                close={close}
                            />
                        ))
                    }
                    navigation.goBack()
                },
            },
            authRunner,
        )
    }

    return (
        <LoginPage showSpinner={isLoading}>
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
                        handleAuthClick(() =>
                            facebookAuthWithDeepRedirect(validatorString),
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
                        handleAuthClick(() =>
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
                editable={isLoading}
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
                editable={isLoading}
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
                    handleAuthClick(() =>
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
                onPress={() => navigation.goBack()}
            >
                Not now
            </Button>
        </LoginPage>
    )
}

export { AuthSwitcherScreen }
