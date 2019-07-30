import React, { useEffect, useMemo } from 'react'
import { useCanViewEditionStatus } from 'src/hooks/use-sign-in-status'
import { View, StyleSheet, PanResponder } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import { useForceUpdate } from 'src/hooks/use-force-update'
import { useModal } from './modal'
import { OnboardingCard, CardAppearance } from './onboarding/onboarding-card'

const overlayStyles = StyleSheet.create({
    wrapper: {
        overflow: 'hidden',
        flex: 1,
    },
})

/**
 * This allows us to open a modal using a component in the view.
 *
 * The primary use case here is for opening with a scrolling interaction.
 * However, if `true` is passed as `forceOpen` then it will
 * open the modal straight away.
 */

const ModalOpener = ({
    children,
    forceOpen = false,
    renderModal,
}: {
    children: React.ReactNode
    forceOpen?: boolean
    renderModal: (close: () => void) => React.ReactNode
}) => {
    const { open, close } = useModal()

    const swipeUpHandlers = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderMove: (_, gesture) => {
                    gesture.dy < -10 && open(renderModal)
                },
            }),
        [renderModal, open],
    )

    // ensure the modal is closed on unmount
    useEffect(() => () => close(), [])

    return (
        <View style={overlayStyles.wrapper} {...swipeUpHandlers.panHandlers}>
            {children}
        </View>
    )
}

const LoginOverlay = ({
    children,
    onLoginPress,
    onReLogin,
    onLoginDismiss,
}: {
    children: React.ReactNode
    onLoginPress: () => void
    onReLogin: () => void
    onLoginDismiss: () => void
}) => {
    const handler = useCanViewEditionStatus()
    // need this to re-check, whether we can view editions in-lieu of better state management
    const forceUpdate = useForceUpdate()

    return (
        <>
            <NavigationEvents onDidFocus={forceUpdate} />
            {handler({
                pending: () => <>{children}</>,
                canView: () => <>{children}</>,
                cannotView: () => (
                    <ModalOpener
                        renderModal={close => (
                            <OnboardingCard
                                title="Subscription not found"
                                appearance={CardAppearance.blue}
                                mainActions={[
                                    {
                                        label: 'Sign-in with different account',
                                        onPress: () => {
                                            close()
                                            onReLogin()
                                        },
                                    },
                                    {
                                        label: 'Close',
                                        onPress: () => {
                                            close()
                                            onLoginDismiss()
                                        },
                                    },
                                ]}
                            >
                                We were unable to find a subscription with that
                                account
                            </OnboardingCard>
                        )}
                    >
                        {children}
                    </ModalOpener>
                ),
                notLoggedIn: () => (
                    <ModalOpener
                        renderModal={close => (
                            <OnboardingCard
                                title="Already a subscriber?"
                                subtitle="Sign in to continue with the app"
                                appearance={CardAppearance.blue}
                                mainActions={[
                                    {
                                        label: 'Continue',
                                        onPress: () => {
                                            close()
                                            onLoginPress()
                                        },
                                    },
                                    {
                                        label: 'Close',
                                        onPress: () => {
                                            close()
                                            onLoginDismiss()
                                        },
                                    },
                                ]}
                            >
                                Not subscribed yet? Learn more ...
                            </OnboardingCard>
                        )}
                    >
                        {children}
                    </ModalOpener>
                ),
            })}
        </>
    )
}

export { LoginOverlay }
