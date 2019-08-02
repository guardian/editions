import React, { useEffect, useMemo } from 'react'
import { View, StyleSheet, PanResponder } from 'react-native'
import { useModal } from './modal'
import { useAuth } from 'src/authentication/auth-context'
import { SignInModalCard } from './sign-in-modal-card'
import { SubNotFoundModalCard } from './sub-not-found-modal-card'

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
 */

const ModalOpener = ({
    children,
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
    useEffect(() => () => close(), [close])

    return (
        <View style={overlayStyles.wrapper} {...swipeUpHandlers.panHandlers}>
            {children}
        </View>
    )
}

const LoginOverlay = ({
    children,
    onDismiss,
    onLoginPress,
}: {
    children: React.ReactNode
    onDismiss: () => void
    onLoginPress: () => void
}) => {
    const handler = useAuth()

    return handler({
        pending: () => <>{children}</>,
        signedIn: canView =>
            canView ? (
                <>{children}</>
            ) : (
                <ModalOpener
                    renderModal={close => (
                        <SubNotFoundModalCard
                            onDismiss={onDismiss}
                            onLoginPress={onLoginPress}
                            close={close}
                        />
                    )}
                >
                    {children}
                </ModalOpener>
            ),
        signedOut: () => (
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
