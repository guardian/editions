import React, { useContext, useEffect, useMemo } from 'react'
import { useCanViewEditionStatus } from 'src/hooks/use-sign-in-status'
import { View, StyleSheet, PanResponder } from 'react-native'
import { NavigationEvents } from 'react-navigation'
import { useForceUpdate } from 'src/hooks/use-force-update'
import { ModalContext, ModalCardProps } from './modal'

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
    getModalProps,
}: {
    children: React.ReactNode
    forceOpen?: boolean
    getModalProps: (close: () => void) => ModalCardProps
}) => {
    const { open, close } = useContext(ModalContext)

    const swipeUpHandlers = useMemo(
        () =>
            PanResponder.create({
                onStartShouldSetPanResponder: () => true,
                onMoveShouldSetPanResponder: () => true,
                onPanResponderMove: (_, gesture) => {
                    gesture.dy < -10 && open(getModalProps(close))
                },
            }),
        [getModalProps, open, close],
    )

    // ensure the modal is closed on unmount
    useEffect(() => {
        if (forceOpen) {
            open(getModalProps(close))
        }
        return () => close()
    }, [getModalProps, open, close, forceOpen])

    return (
        <View style={overlayStyles.wrapper} {...swipeUpHandlers.panHandlers}>
            {children}
        </View>
    )
}

const LoginOverlay = ({
    children,
    onLoginPress,
}: {
    children: React.ReactNode
    onLoginPress: () => void
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
                        forceOpen
                        getModalProps={close => ({
                            title: 'Invalid account',
                            text: 'You need to upgrade your account',
                            actions: [
                                { label: 'Login', onPress: onLoginPress },
                                { label: 'Not now', onPress: close },
                            ],
                        })}
                    >
                        {children}
                    </ModalOpener>
                ),
                notLoggedIn: () => (
                    <ModalOpener
                        getModalProps={close => ({
                            title: 'Log in',
                            text: 'You need to log in',
                            actions: [
                                { label: 'Login', onPress: onLoginPress },
                                { label: 'Not now', onPress: close },
                            ],
                        })}
                    >
                        {children}
                    </ModalOpener>
                ),
            })}
        </>
    )
}

export { LoginOverlay }
