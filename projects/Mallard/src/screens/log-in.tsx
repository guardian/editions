import React, { useState } from 'react'
import { View, StyleSheet, Image, ImageSourcePropType } from 'react-native'
import { TitlepieceText } from 'src/components/styled-text'
import { Button } from 'src/components/button/button'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { Link, LinkNav } from 'src/components/link'
import { getFont } from 'src/theme/typography'
import { FormField } from 'src/hooks/use-form-field'
import { LoginLayout } from 'src/components/login/login-layout'
import { EmailInput, PasswordInput } from 'src/components/login/login-input'
import { LoginButton } from 'src/components/login/login-button'
import AppleSignInButton from 'src/components/apple-sign-in-button/apple-sign-in-buttom'

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
    icon: {
        marginRight: 10,
        height: 20,
        width: 20,
    },
})

const SocialButton = ({
    children,
    onPress,
    iconRequire,
}: {
    children: string
    onPress: () => void
    iconRequire: ImageSourcePropType
}) => (
    <Button
        buttonStyles={socialButtonStyles.button}
        textStyles={socialButtonStyles.buttonText}
        onPress={onPress}
        icon={
            <Image
                resizeMode="contain"
                style={socialButtonStyles.icon}
                source={iconRequire}
            />
        }
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
        flex: 0,
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
    onApplePress,
    onFacebookPress,
    onGooglePress,
    onSubmit,
    onDismiss,
    isLoading,
    errorMessage,
    emailProgressText,
    submitText,
    resetLink,
    onHelpPress,
}: {
    title: string
    onFacebookPress: () => void
    onApplePress: (credentials: any) => void
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
    onHelpPress: () => void
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
                        <SocialButton
                            onPress={onFacebookPress}
                            iconRequire={require('src/assets/images/fb.png')}
                        >
                            Continue with Facebook
                        </SocialButton>
                        <SocialButton
                            onPress={onGooglePress}
                            iconRequire={require('src/assets/images/google.png')}
                        >
                            Continue with Google
                        </SocialButton>
                        <AppleSignInButton
                            onClick={(credentials: any) =>
                                onApplePress(credentials)
                            }
                        />
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
                <View style={loginStyles.actionsContainer}>
                    {hasInputEmail && (
                        <Link style={[loginStyles.resetLink]} href={resetLink}>
                            Forgot password?
                        </Link>
                    )}
                    <LinkNav
                        style={[loginStyles.resetLink]}
                        onPress={onHelpPress}
                    >
                        Have a subscription but cannot sign in?
                    </LinkNav>
                </View>
            </View>
        </LoginLayout>
    )
}

export { Login }
