import React, { useState, useContext } from 'react'
import { facebookAuthWithDeepRedirect } from 'src/authentication/services/facebook'
import { googleAuthWithDeepRedirect } from 'src/authentication/services/google'
import { NavigationScreenProp } from 'react-navigation'
import { useModal } from 'src/components/modal'
import { SignInFailedModalCard } from 'src/components/sign-in-failed-modal-card'
import { routeNames } from 'src/navigation/routes'
import { SubFoundModalCard } from 'src/components/sub-found-modal-card'
import { Login } from './log-in'
import isEmail from 'validator/lib/isEmail'
import { useFormField } from 'src/hooks/use-form-field'
import { withConsent } from 'src/helpers/settings'
import { Alert } from 'react-native'
import { AuthParams } from 'src/authentication/authorizers/IdentityAuthorizer'
import { AccessContext } from 'src/authentication/AccessContext'
import { isValid } from 'src/authentication/lib/Attempt'

const useRandomState = () =>
    useState(
        Math.random()
            .toString()
            .split('.')[1],
    )[0]

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

    const { authIdentity } = useContext(AccessContext)
    const { open } = useModal()

    const handleAuthClick = async (
        runGetIdentityAuthParams: () => Promise<AuthParams>,
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
                    setIsLoading(true)
                    try {
                        const { attempt, accessAttempt } = await authIdentity(
                            await runGetIdentityAuthParams(),
                        )
                        if (isValid(attempt)) {
                            setIsLoading(false)
                            if (!isValid(accessAttempt)) {
                                open(close => (
                                    <SignInFailedModalCard
                                        email={
                                            attempt.data.userDetails
                                                .primaryEmailAddress
                                        }
                                        onDismiss={() => navigation.popToTop()}
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
                        } else {
                            // push this into the catch logic below
                            throw attempt.reason
                        }
                    } catch (e) {
                        setIsLoading(false)
                        setError(
                            typeof e === 'string' ? e : 'Something went wrong',
                        )
                    }
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
                    () =>
                        facebookAuthWithDeepRedirect(validatorString).then(
                            token => ({
                                'facebook-access-token': token,
                            }),
                        ),
                    { requiresFunctionalConsent: true, signInName: 'Facebook' },
                )
            }
            onGooglePress={() =>
                handleAuthClick(
                    () =>
                        googleAuthWithDeepRedirect(validatorString).then(
                            token => ({
                                'google-access-token': token,
                            }),
                        ),
                    { requiresFunctionalConsent: true, signInName: 'Google' },
                )
            }
            onSubmit={() =>
                handleAuthClick(
                    async () => ({
                        email: email.value,
                        password: password.value,
                    }),
                    { requiresFunctionalConsent: false },
                )
            }
            errorMessage={error}
        />
    )
}

export { AuthSwitcherScreen }
