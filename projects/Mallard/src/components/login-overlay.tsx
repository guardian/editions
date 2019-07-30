import React, { useRef, useContext, useEffect } from 'react'
import { useCanViewEditionStatus } from 'src/hooks/use-sign-in-status'
import { View, StyleSheet, Text, PanResponder } from 'react-native'
import { Button } from './button/button'
import { NavigationEvents } from 'react-navigation'
import { useForceUpdate } from 'src/hooks/use-force-update'
import { ModalContext, ModalCardProps } from './modal'

const messageStyles = StyleSheet.create({
    message: {
        color: 'white',
        backgroundColor: 'blue',
        padding: 10,
    },
    text: {
        color: 'white',
    },
})

const InvalidAccountMessage = ({
    onLoginPress,
}: {
    onLoginPress: () => void
}) => {
    return (
        <View style={messageStyles.message}>
            <Text style={messageStyles.text}>
                You need to upgrade your account
            </Text>
            <Button onPress={onLoginPress}>Login</Button>
        </View>
    )
}

const LoginMessage = ({ onLoginPress }: { onLoginPress: () => void }) => {
    return (
        <View style={messageStyles.message}>
            <Text style={messageStyles.text}>Why dont you login!?</Text>
            <Button onPress={onLoginPress}>Login</Button>
        </View>
    )
}

const overlayStyles = StyleSheet.create({
    wrapper: {
        overflow: 'hidden',
        flex: 1,
    },
    overlay: {
        backgroundColor: 'black',
        bottom: 0,
        left: 0,
        opacity: 0.25,
        position: 'absolute',
        right: 0,
        top: 0,
    },
    contentWrapper: {
        overflow: 'hidden',
        flex: 1,
    },
    messageWrapper: {
        flex: 1,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        elevation: 9999,
    },
})

const ScrollBlockingMessage = ({
    children,
    getModalProps,
}: {
    children: React.ReactNode
    getModalProps: (close: () => void) => ModalCardProps
}) => {
    const { open, close } = useContext(ModalContext)

    // need this to re-check, whether we can view editions in-lieu of better state management
    const swipeUpHandlers = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gesture) => {
                gesture.dy < 10 && open(getModalProps(close))
            },
        }),
    )

    // ensure the modal is closed on unmount
    useEffect(() => () => close(), [])

    return (
        <View
            style={overlayStyles.wrapper}
            {...swipeUpHandlers.current.panHandlers}
        >
            <View style={overlayStyles.contentWrapper} pointerEvents="box-only">
                {children}
            </View>
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
            <NavigationEvents onDidFocus={() => forceUpdate()} />
            {handler({
                pending: () => <>{children}</>,
                canView: () => <>{children}</>,
                cannotView: () => (
                    <ScrollBlockingMessage
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
                    </ScrollBlockingMessage>
                ),
                notLoggedIn: () => (
                    <ScrollBlockingMessage
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
                    </ScrollBlockingMessage>
                ),
            })}
        </>
    )
}

export { LoginOverlay }
