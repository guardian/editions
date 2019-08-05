import React, { useState, useEffect } from 'react'
import {
    View,
    KeyboardAvoidingView,
    Keyboard,
    TextInputProps,
    StyleSheet,
} from 'react-native'
import { Spinner } from 'src/components/spinner'
import { TitlepieceText, UiBodyCopy } from 'src/components/styled-text'
import { Button } from 'src/components/button/button'
import { TextInput } from 'react-native-gesture-handler'
import { metrics } from 'src/theme/spacing'
import { useInsets } from 'src/hooks/use-insets'
import { color } from 'src/theme/color'
import { Link } from 'src/components/link'
import { getFont } from 'src/theme/typography'
import { FormField } from 'src/hooks/use-form-field'

const socialButtonStyles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginVertical: metrics.vertical,
        backgroundColor: 'white',
        borderWidth: 1,
        borderColor: color.primary,
    },
    buttonText: {
        color: color.primary,
    },
})

const SocialButton = ({
    children,
    onPress,
    iconURL,
}: {
    children: string
    onPress: () => void
    iconURL: string
}) => (
    <Button
        buttonStyles={socialButtonStyles.button}
        textStyles={socialButtonStyles.buttonText}
        onPress={onPress}
    >
        {children}
    </Button>
)

const loginInputStyles = StyleSheet.create({
    label: {
        color: color.primary,
        marginBottom: metrics.vertical,
    },
    input: {
        paddingVertical: metrics.vertical,
        paddingHorizontal: metrics.horizontal,
        borderWidth: 1,
    },
    error: {
        color: color.error,
        marginTop: metrics.vertical,
    },
})

const LoginInput = ({
    secureTextEntry,
    label,
    accessibilityLabel,
    textContentType,
    keyboardType,
    editable,
    value,
    onChangeText,
    error,
}: {
    secureTextEntry?: boolean
    label: string
    accessibilityLabel: string
    textContentType: TextInputProps['textContentType']
    keyboardType?: TextInputProps['keyboardType']
    editable?: TextInputProps['editable']
    value: TextInputProps['value']
    onChangeText: TextInputProps['onChangeText']
    error: string | null
}) => (
    <View style={{ marginBottom: metrics.vertical * 2 }}>
        <UiBodyCopy weight="bold" style={loginInputStyles.label}>
            {label}
        </UiBodyCopy>
        <View>
            <TextInput
                style={[
                    loginInputStyles.input,
                    {
                        borderColor: error ? color.error : color.primary,
                        color: editable ? 'black' : 'grey',
                        ...getFont('sans', 1),
                    },
                ]}
                accessibilityLabel={accessibilityLabel}
                textContentType={textContentType}
                secureTextEntry={secureTextEntry}
                onSubmitEditing={Keyboard.dismiss}
                returnKeyType="done"
                placeholderTextColor="grey"
                editable={editable}
                autoCorrect={false}
                autoCapitalize="none"
                keyboardType={keyboardType}
                value={value}
                onChangeText={onChangeText}
            ></TextInput>
        </View>
        {error && (
            <UiBodyCopy weight="bold" style={loginInputStyles.error}>
                {error}
            </UiBodyCopy>
        )}
    </View>
)

const loginHeaderStyles = StyleSheet.create({
    wrapper: {
        paddingVertical: metrics.vertical,
        paddingHorizontal: metrics.horizontal,
        backgroundColor: '#399fdc',
        flexDirection: 'column',
    },
    actionRow: {
        alignItems: 'flex-end',
        marginBottom: metrics.vertical / 2,
    },
    dismissButton: {
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
        borderColor: color.palette.neutral[100],
        borderWidth: 1,
    },
    dismissText: { color: color.palette.neutral[100] },
    title: {
        color: color.palette.neutral[100],
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
    or: {
        color: color.primary,
        marginVertical: metrics.vertical * 2,
    },
    error: { color: color.error, marginBottom: 10 },
    actionsContainer: {
        alignItems: 'flex-start',
        flexDirection: 'column',
        flex: 1,
    },
    actionRow: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        flex: 0,
    },
    buttonContainer: {
        flex: 0,
        marginRight: metrics.horizontal / 2,
    },
    button: {
        marginBottom: 10,
    },
    resetLink: {
        color: color.primary,
        paddingVertical: 8,
        ...getFont('sans', 1),
    },
})

const LoginLayout = ({
    title,
    socialButtons,
    email,
    password,
    onSubmit,
    onDismiss,
    isLoading,
    errorMessage,
    emailProgressText,
    submitText,
    resetLink,
}: {
    title: string
    socialButtons: React.ReactNode
    email: FormField
    password: FormField
    onSubmit: () => void
    onDismiss: () => void
    isLoading: boolean
    errorMessage: string | null
    emailProgressText: string
    submitText: string
    resetLink: string
}) => {
    const [hasInputEmail, setHasInputEmail] = useState(false)
    const [showError, setShowError] = useState(false)

    const onInputChange = (fn: (value: string) => void) => (value: string) => {
        setShowError(false)
        fn(value)
    }

    return (
        <View style={loginLayoutStyles.wrapper}>
            <KeyboardAvoidingView
                style={loginLayoutStyles.keyboardAvoider}
                behavior="padding"
            >
                <View style={{ alignItems: 'center' }}>
                    {isLoading && <Spinner />}
                </View>
                <LoginHeader onDismiss={onDismiss}>{title}</LoginHeader>
                <View style={loginLayoutStyles.inputsContainer}>
                    {!hasInputEmail && (
                        <>
                            <View>{socialButtons}</View>
                            <TitlepieceText style={loginLayoutStyles.or}>
                                or
                            </TitlepieceText>
                        </>
                    )}
                    <LoginInput
                        editable={!isLoading && !hasInputEmail}
                        value={email.value}
                        error={showError ? email.error : null}
                        label="Enter your email address"
                        accessibilityLabel="email input"
                        keyboardType="email-address"
                        textContentType="emailAddress"
                        onChangeText={onInputChange(email.setValue)}
                    />
                    {hasInputEmail && (
                        <LoginInput
                            editable={!isLoading}
                            value={password.value}
                            error={showError ? password.error : null}
                            label="Enter your password"
                            accessibilityLabel="password input"
                            secureTextEntry
                            textContentType="password"
                            onChangeText={onInputChange(password.setValue)}
                        />
                    )}
                    {errorMessage && (
                        <UiBodyCopy style={loginLayoutStyles.error}>
                            {errorMessage}
                        </UiBodyCopy>
                    )}
                    <View style={loginLayoutStyles.actionsContainer}>
                        <View style={loginLayoutStyles.actionRow}>
                            {hasInputEmail && (
                                <Button
                                    center
                                    style={loginLayoutStyles.buttonContainer}
                                    buttonStyles={[
                                        loginLayoutStyles.button,
                                        {
                                            borderColor: color.primary,
                                            borderWidth: 1,
                                            backgroundColor: 'transparent',
                                        },
                                    ]}
                                    textStyles={{ color: color.primary }}
                                    onPress={() => {
                                        setHasInputEmail(false)
                                    }}
                                >
                                    Back
                                </Button>
                            )}
                            <Button
                                center
                                style={loginLayoutStyles.buttonContainer}
                                buttonStyles={[
                                    loginLayoutStyles.button,
                                    {
                                        backgroundColor: color.primary,
                                    },
                                ]}
                                textStyles={{ color: 'white' }}
                                onPress={() => {
                                    if (hasInputEmail) {
                                        if (password.error) {
                                            setShowError(true)
                                        } else {
                                            onSubmit()
                                        }
                                    } else {
                                        if (email.error) {
                                            setShowError(true)
                                        } else {
                                            setHasInputEmail(true)
                                        }
                                    }
                                }}
                            >
                                {!hasInputEmail
                                    ? emailProgressText
                                    : submitText}
                            </Button>
                        </View>
                        <View style={loginLayoutStyles.actionRow}>
                            {hasInputEmail && (
                                <Link
                                    style={loginLayoutStyles.resetLink}
                                    href={resetLink}
                                >
                                    Forgot password?
                                </Link>
                            )}
                        </View>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </View>
    )
}

const LogIn = ({
    email,
    password,
    onSubmit,
    isLoading,
    onFacebookPress,
    onGooglePress,
    onDismiss,
    errorMessage,
}: {
    email: FormField
    password: FormField
    onSubmit: () => void
    isLoading: boolean
    onFacebookPress: () => void
    onGooglePress: () => void
    onDismiss: () => void
    errorMessage: string | null
}) => {
    return (
        <LoginLayout
            title="Sign-in to activate your subscription"
            resetLink="https://profile.theguardian.com/reset"
            email={email}
            isLoading={isLoading}
            errorMessage={errorMessage}
            emailProgressText="Next"
            submitText="Sign me in"
            password={password}
            onSubmit={onSubmit}
            onDismiss={onDismiss}
            socialButtons={
                <>
                    <SocialButton onPress={onFacebookPress} iconURL="">
                        Continue with Facebook
                    </SocialButton>
                    <SocialButton onPress={onGooglePress} iconURL="">
                        Continue with Google
                    </SocialButton>
                </>
            }
        />
    )
}

export { LogIn }
