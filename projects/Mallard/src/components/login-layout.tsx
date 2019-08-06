import React from 'react'
import { StyleSheet, View, KeyboardAvoidingView } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { useInsets } from 'src/hooks/use-insets'
import { Button } from './button/button'
import { TitlepieceText, UiBodyCopy } from './styled-text'
import { Spinner } from './spinner'

const loginHeaderStyles = StyleSheet.create({
    wrapper: {
        paddingVertical: metrics.vertical,
        paddingHorizontal: metrics.horizontal,
        backgroundColor: '#279DDC',
        flexDirection: 'column',
    },
    actionRow: {
        alignItems: 'flex-end',
        marginBottom: metrics.vertical / 2,
    },
    dismissButton: {
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
        borderColor: color.primary,
        borderWidth: 1,
    },
    dismissText: {
        color: color.primary,
    },
    title: {
        color: color.primary,
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
        <View style={[loginHeaderStyles.wrapper, { paddingTop: insets.top }]}>
            <View style={loginHeaderStyles.actionRow}>
                <Button
                    icon=""
                    alt="Dismiss"
                    buttonStyles={loginHeaderStyles.dismissButton}
                    textStyles={loginHeaderStyles.dismissText}
                    onPress={onDismiss}
                />
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
        backgroundColor: 'white',
        flex: 1,
        justifyContent: 'center',
    },
    inputsContainer: {
        flexDirection: 'column',
        flexGrow: 1,
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
            <LoginHeader onDismiss={onDismiss}>{title}</LoginHeader>
            <View style={{ alignItems: 'center' }}>
                {isLoading && <Spinner />}
            </View>
            <View style={loginLayoutStyles.inputsContainer}>
                {errorMessage && (
                    <UiBodyCopy style={loginLayoutStyles.error}>
                        {errorMessage}
                    </UiBodyCopy>
                )}
                {children}
            </View>
        </KeyboardAvoidingView>
    </View>
)

export { LoginLayout }
