import React from 'react'
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { useInsets } from 'src/hooks/use-screen'
import { CloseModalButton } from '../button/close-modal-button'
import { TitlepieceText, UiBodyCopy } from '../styled-text'
import { Spinner } from '../spinner'

const loginHeaderStyles = StyleSheet.create({
    wrapper: {
        paddingVertical: metrics.vertical,
        paddingHorizontal: metrics.horizontal,
        backgroundColor: color.ui.sea,
        flexDirection: 'column',
    },
    actionRow: {
        alignItems: 'flex-end',
        marginBottom: metrics.vertical / 2,
    },
    title: {
        color: color.textOverPrimary,
    },
})

const LoginHeader = ({
    children,
    onDismiss,
}: {
    children: string
    onDismiss: () => void
}) => {
    const insets = useInsets()
    return (
        <View
            style={[
                loginHeaderStyles.wrapper,
                { paddingTop: insets.top + metrics.vertical },
            ]}
        >
            <View style={loginHeaderStyles.actionRow}>
                <CloseModalButton onPress={onDismiss} />
            </View>
            <View>
                <TitlepieceText style={loginHeaderStyles.title}>
                    {children}
                </TitlepieceText>
            </View>
        </View>
    )
}

const loginLayoutStyles = StyleSheet.create({
    wrapper: {
        flex: 1,
    },
    keyboardAvoider: {
        flex: 1,
    },
    inner: {
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
        flexDirection: 'column',
    },
    spinnerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255,255,255,.8)',
        ...StyleSheet.absoluteFillObject,
    },
    inputsContainer: {
        flexDirection: 'column',
        flexGrow: 1,
        flexShrink: 0,
        paddingHorizontal: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    error: { color: color.error, marginBottom: 10 },
})

const LoginLayout = ({
    children,
    isLoading,
    title,
    errorMessage,
    onDismiss,
}: {
    children: React.ReactNode
    isLoading: boolean
    title: string
    errorMessage: string | null
    onDismiss: () => void
}) => (
    <View style={loginLayoutStyles.wrapper}>
        <KeyboardAvoidingView
            style={loginLayoutStyles.keyboardAvoider}
            behavior="padding"
        >
            <View style={loginLayoutStyles.inner}>
                <LoginHeader onDismiss={onDismiss}>{title}</LoginHeader>
                <View style={loginLayoutStyles.inputsContainer}>
                    {errorMessage && (
                        <UiBodyCopy style={loginLayoutStyles.error}>
                            {errorMessage}
                        </UiBodyCopy>
                    )}
                    {children}
                </View>
            </View>
            {isLoading && (
                <View style={loginLayoutStyles.spinnerContainer}>
                    <Spinner />
                </View>
            )}
        </KeyboardAvoidingView>
    </View>
)

export { LoginLayout, LoginHeader }
