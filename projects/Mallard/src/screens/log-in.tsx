import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { TitlepieceText } from 'src/components/styled-text'
import { Button } from 'src/components/button/button'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { Link } from 'src/components/link'
import { getFont } from 'src/theme/typography'
import { FormField } from 'src/hooks/use-form-field'
import { LoginLayout } from 'src/components/login-layout'
import { EmailInput, PasswordInput } from 'src/components/login-input'
import { LoginButton } from 'src/components/login-button'

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

const loginStyles = StyleSheet.create({
    or: {
        color: color.primary,
        marginVertical: metrics.vertical * 2,
    },
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
    resetLink: {
        color: color.primary,
        paddingVertical: 8,
        ...getFont('sans', 1),
    },
})

const Login = ({
    title,
    email,
    password,
    onFacebookPress,
    onGooglePress,
    onSubmit,
    onDismiss,
    isLoading,
    errorMessage,
    emailProgressText,
    submitText,
    resetLink,
}: {
    title: string
    onFacebookPress: () => void
    onGooglePress: () => void
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
        <LoginLayout
            title={title}
            isLoading={isLoading}
            onDismiss={onDismiss}
            errorMessage={errorMessage}
        >
            {!hasInputEmail && (
                <>
                    <View>
                        <SocialButton onPress={onFacebookPress} iconURL="">
                            Continue with Facebook
                        </SocialButton>
                        <SocialButton onPress={onGooglePress} iconURL="">
                            Continue with Google
                        </SocialButton>
                    </View>
                    <TitlepieceText style={loginStyles.or}>or</TitlepieceText>
                </>
            )}
            <EmailInput
                editable={!isLoading && !hasInputEmail}
                value={email.value}
                error={showError ? email.error : null}
                label="Enter your email address"
                accessibilityLabel="email input"
                onChangeText={onInputChange(email.setValue)}
            />
            {hasInputEmail && (
                <PasswordInput
                    editable={!isLoading}
                    value={password.value}
                    error={showError ? password.error : null}
                    label="Enter your password"
                    accessibilityLabel="password input"
                    onChangeText={onInputChange(password.setValue)}
                />
            )}
            <View style={loginStyles.actionsContainer}>
                <View style={loginStyles.actionRow}>
                    {hasInputEmail && (
                        <LoginButton
                            onPress={() => {
                                setHasInputEmail(false)
                            }}
                        >
                            Back
                        </LoginButton>
                    )}
                    <LoginButton
                        type="cta"
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
                        {!hasInputEmail ? emailProgressText : submitText}
                    </LoginButton>
                </View>
                <View style={loginStyles.actionRow}>
                    {hasInputEmail && (
                        <Link style={loginStyles.resetLink} href={resetLink}>
                            Forgot password?
                        </Link>
                    )}
                </View>
            </View>
        </LoginLayout>
    )
}

export { Login }
