import React, { useState, useEffect } from 'react'
import {
    View,
    KeyboardAvoidingView,
    Keyboard,
    TextInputProps,
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
        buttonStyles={{
            flexDirection: 'row',
            justifyContent: 'flex-start',
            marginVertical: metrics.vertical,
            backgroundColor: 'white',
            borderWidth: 1,
            borderColor: color.primary,
        }}
        textStyles={{
            color: color.primary,
        }}
        onPress={onPress}
    >
        {children}
    </Button>
)

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
        <UiBodyCopy
            weight="bold"
            style={{ color: color.primary, marginBottom: metrics.vertical }}
        >
            {label}
        </UiBodyCopy>
        <View>
            <TextInput
                style={{
                    borderColor: error ? color.error : color.primary,
                    borderWidth: 1,
                    color: editable ? 'black' : 'grey',
                    ...getFont('sans', 1),
                    paddingVertical: metrics.vertical,
                    paddingHorizontal: metrics.horizontal,
                }}
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
            <UiBodyCopy
                weight="bold"
                style={{
                    color: color.error,
                    marginTop: metrics.vertical,
                }}
            >
                {error}
            </UiBodyCopy>
        )}
    </View>
)

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
            style={{
                paddingVertical: metrics.vertical,
                paddingHorizontal: metrics.horizontal,
                paddingTop: insets.top,
                backgroundColor: '#399fdc',
                flexDirection: 'column',
            }}
        >
            <View
                style={{
                    alignItems: 'flex-end',
                    marginBottom: metrics.vertical / 2,
                }}
            >
                <Button
                    icon=""
                    alt="Dismiss"
                    buttonStyles={{
                        paddingHorizontal: 0,
                        backgroundColor: 'transparent',
                        borderColor: color.palette.neutral[100],
                        borderWidth: 1,
                    }}
                    textStyles={{ color: color.palette.neutral[100] }}
                    onPress={onDismiss}
                />
            </View>
            <View>
                <TitlepieceText
                    style={{
                        color: color.palette.neutral[100],
                    }}
                >
                    {children}
                </TitlepieceText>
            </View>
        </View>
    )
}

const isValidEmail = (email: string) => (email ? null : 'Email is invalid')
const isValidPassword = (password: string) =>
    password ? null : 'Password is invalid'

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
}) => {
    const [hasInputEmail, setHasInputEmail] = useState(false)
    const [showError, setShowError] = useState(false)

    const onInputChange = (fn: (value: string) => void) => (value: string) => {
        setShowError(false)
        fn(value)
    }

    return (
        <View style={{ flex: 1 }}>
            <KeyboardAvoidingView
                style={[
                    {
                        backgroundColor: 'white',
                        flex: 1,
                        justifyContent: 'center',
                    },
                ]}
                behavior="padding"
            >
                <View style={{ alignItems: 'center' }}>
                    {isLoading && <Spinner />}
                </View>
                <LoginHeader onDismiss={onDismiss}>{title}</LoginHeader>
                <View
                    style={{
                        flexDirection: 'column',
                        flexGrow: 1,
                        paddingHorizontal: metrics.horizontal,
                        paddingVertical: metrics.vertical,
                    }}
                >
                    {!hasInputEmail && (
                        <>
                            <View>{socialButtons}</View>
                            <TitlepieceText
                                style={{
                                    color: color.primary,
                                    marginVertical: metrics.vertical * 2,
                                }}
                            >
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
                        <UiBodyCopy
                            style={{ color: color.error, marginBottom: 10 }}
                        >
                            {errorMessage}
                        </UiBodyCopy>
                    )}
                    <View
                        style={{
                            alignItems: 'flex-start',
                            flexDirection: 'column',
                            flex: 1,
                        }}
                    >
                        <View
                            style={{
                                alignItems: 'flex-start',
                                flexDirection: 'row',
                                flex: 0,
                            }}
                        >
                            {hasInputEmail && (
                                <Button
                                    center
                                    style={{
                                        flex: 0,
                                    }}
                                    buttonStyles={{
                                        borderColor: color.primary,
                                        borderWidth: 1,
                                        marginBottom: 10,
                                        marginRight: metrics.horizontal / 2,
                                        backgroundColor: 'transparent',
                                    }}
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
                                style={{
                                    flex: 0,
                                }}
                                buttonStyles={{
                                    marginBottom: 10,
                                    backgroundColor: color.primary,
                                }}
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
                                    : 'Sign me in'}
                            </Button>
                        </View>
                        <View>
                            {hasInputEmail && (
                                <Link
                                    style={{ color: color.primary }}
                                    href="https://profile.theguardian.com/reset"
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
            email={email}
            isLoading={isLoading}
            errorMessage={errorMessage}
            emailProgressText="Next"
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
