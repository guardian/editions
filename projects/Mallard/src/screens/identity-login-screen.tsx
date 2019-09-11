import React, { useState, useContext } from 'react'
import {
    fetchAndPersistUserAccessTokenWithIdentity,
    fetchUserDataForKeychainUser,
    canViewEdition,
    UserData,
} from 'src/authentication/helpers'
import { facebookAuthWithDeepRedirect } from 'src/authentication/services/facebook'
import { googleAuthWithDeepRedirect } from 'src/authentication/services/google'
import { AuthContext } from 'src/authentication/auth-context'
import { NavigationScreenProp } from 'react-navigation'
import { useModal } from 'src/components/modal'
import { SignInFailedModalCard } from 'src/components/sign-in-failed-modal-card'
import { routeNames } from 'src/navigation/routes'
import { SubFoundModalCard } from 'src/components/sub-found-modal-card'
import { Login } from './log-in'
import isEmail from 'validator/lib/isEmail'
import { useFormField } from 'src/hooks/use-form-field'
import { IdentityAuthStatus } from 'src/authentication/credentials-chain'
import { withConsent } from 'src/helpers/settings'
import { Alert } from 'react-native'

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
        onSuccess: (data: UserData) => void
        onError: (err: string) => void
    },
    authRunner: () => Promise<unknown> = () => Promise.resolve(null),
) => {
    try {
        onStart()
        await authRunner()
        const membershipData = await fetchUserDataForKeychainUser()

        if (!membershipData) {
            onError('Could not find membership data')
            return
        }

        onSuccess(membershipData)
    } catch (err) {
        onError(err instanceof Error ? err.message : err)
    }
}

const AuthSwitcherScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const [isLoading, setIsLoading] = useState(false)

    const [error, setError] = useState<string | null>(null)

    const email = useFormField('', {
        validator: email =>
            email
                ? isEmail(email)
                    ? null
                    : 'Please enter a valid email'
                : 'Please enter an email',
        onSet: () => setError(null),
    })
    const password = useFormField('', {
        validator: password => (password ? null : 'Invalid password'),
        onSet: () => setError(null),
    })

    const validatorString = useRandomState()

    const { setStatus, signOutIdentity } = useContext(AuthContext)
    const { open } = useModal()

    const handleAuthClick = async (
        authRunner: () => Promise<string>,
        {
            requiresFunctionalConsent,
            signInName,
        }: { requiresFunctionalConsent: boolean; signInName?: string },
    ) => {
        setError(null)
        withConsent(
            requiresFunctionalConsent ? 'gdprAllowFunctionality' : null,
            {
                allow: async () => {
                    await signOutIdentity()
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
                                setStatus(IdentityAuthStatus(data))
                                if (!canViewEdition(data)) {
                                    open(close => (
                                        <SignInFailedModalCard
                                            email={
                                                data.userDetails
                                                    .primaryEmailAddress
                                            }
                                            onDismiss={() =>
                                                navigation.popToTop()
                                            }
                                            onOpenCASLogin={() =>
                                                navigation.navigate(
                                                    routeNames.CasSignIn,
                                                )
                                            }
                                            onLoginPress={() =>
                                                navigation.navigate(
                                                    routeNames.SignIn,
                                                )
                                            }
                                            close={close}
                                        />
                                    ))
                                } else {
                                    open(close => (
                                        <SubFoundModalCard close={close} />
                                    ))
                                }
                                navigation.goBack()
                            },
                        },
                        authRunner,
                    )
                },
                deny: async () => {
                    Alert.alert(
                        `${signInName || 'Social'} sign-in disabled`,
                        `You have disabled ${signInName ||
                            'social'} sign-in. You can enable it in Settings > Privacy Settings > Functional`,
                    )
                },
            },
        )
    }

    return (
        <Login
            title="Sign in to activate your subscription"
            resetLink="https://profile.theguardian.com/reset"
            emailProgressText="Next"
            submitText="Sign me in"
            email={email}
            password={password}
            isLoading={isLoading}
            onDismiss={() => navigation.goBack()}
            onHelpPress={() =>
                navigation.navigate(routeNames.AlreadySubscribed)
            }
            onFacebookPress={() =>
                handleAuthClick(
                    () => facebookAuthWithDeepRedirect(validatorString),
                    { requiresFunctionalConsent: true, signInName: 'Facebook' },
                )
            }
            onGooglePress={() =>
                handleAuthClick(
                    () => googleAuthWithDeepRedirect(validatorString),
                    { requiresFunctionalConsent: true, signInName: 'Google' },
                )
            }
            onSubmit={() =>
                handleAuthClick(
                    () =>
                        fetchAndPersistUserAccessTokenWithIdentity(
                            email.value,
                            password.value,
                        ),
                    { requiresFunctionalConsent: false },
                )
            }
            errorMessage={error}
        />
    )
}

export { AuthSwitcherScreen }
