import React, { useEffect, useRef } from 'react'
import { View, StyleSheet } from 'react-native'
import { useModal } from '../modal'
import { useAuth } from 'src/authentication/auth-context'
import { SignInModalCard } from '../sign-in-modal-card'
import { SubNotFoundModalCard } from '../sub-not-found-modal-card'
import { navigateToIssue } from 'src/navigation/helpers'
import {
    NavigationScreenProp,
    withNavigation,
    NavigationInjectedProps,
} from 'react-navigation'
import { routeNames } from 'src/navigation'

const overlayStyles = StyleSheet.create({
    wrapper: {
        overflow: 'hidden',
        flex: 1,
    },
})

const useInterval = (
    callback: () => void,
    delay: number,
    shouldFire: boolean,
) => {
    const cb = useRef<() => void>(() => {})
    const sf = useRef(shouldFire)

    // Remember the latest callback.
    useEffect(() => {
        cb.current = callback
    }, [callback])

    // Remember the latest shouldFire.
    useEffect(() => {
        sf.current = shouldFire
    }, [shouldFire])

    useEffect(() => {
        const id = setInterval(() => {
            if (sf.current) {
                cb.current()
            }
        }, delay)
        return () => clearInterval(id)
    }, [delay])
}

/**
 * This allows us to open a modal using a component in the view.
 *
 * The primary use case here is for opening with a scrolling interaction.
 */

const ModalOpener = ({
    children,
    renderModal,
}: {
    children: React.ReactNode
    forceOpen?: boolean
    renderModal: (close: () => void) => React.ReactNode
}) => {
    const { open, close, isOpen } = useModal()

    // we use an interval here to make sure that if there's ever a bug
    // where we don't close this screen after the modal closes, then we
    // re-check that someone's subscription is valid a bit later
    useInterval(
        () => {
            if (!isOpen) {
                open(renderModal)
            }
        },
        5000,
        !isOpen,
    )

    // ensure the modal is closed on unmount
    useEffect(() => () => close(), [close])

    return <View style={overlayStyles.wrapper}>{children}</View>
}

const LoginOverlay = ({
    children,
    onDismiss,
    onOpenCASLogin,
    onLoginPress,
}: {
    children: React.ReactNode
    onDismiss: () => void
    onOpenCASLogin: () => void
    onLoginPress: () => void
}) => {
    const handler = useAuth()

    return handler({
        pending: () => <>{children}</>,
        authed: () => <>{children}</>,
        unauthed: signedIn =>
            signedIn ? (
                <ModalOpener
                    renderModal={close => (
                        <SubNotFoundModalCard
                            onDismiss={onDismiss}
                            onOpenCASLogin={onOpenCASLogin}
                            onLoginPress={onLoginPress}
                            close={close}
                        />
                    )}
                >
                    {children}
                </ModalOpener>
            ) : (
                <ModalOpener
                    renderModal={close => (
                        <SignInModalCard
                            onDismiss={onDismiss}
                            onLoginPress={onLoginPress}
                            close={close}
                        />
                    )}
                >
                    {children}
                </ModalOpener>
            ),
    })
}

export { LoginOverlay }
