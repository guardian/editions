import React, { useState, useEffect } from 'react'
import {
    View,
    KeyboardAvoidingView,
    Keyboard,
    TextInputProps,
    Text,
} from 'react-native'
import { Spinner } from 'src/components/spinner'
import { TitlepieceText, UiBodyCopy } from 'src/components/styled-text'
import { Button } from 'src/components/button/button'
import { TextInput } from 'react-native-gesture-handler'
import { metrics } from 'src/theme/spacing'
import { useInsets } from 'src/hooks/use-insets'
import { color } from 'src/theme/color'

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

interface FormField {
    value: string
    setValue: (value: string) => void
    error: string | null
}

const useFormField = (
    initialValue: string,
    {
        validator,
        onSet,
    }: {
        validator: (value: string) => string | null
        onSet?: (value: string) => void
    },
): FormField => {
    const [value, setValue] = useState(initialValue)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setError(validator(value))
    }, [validator, value])

    return {
        value,
        setValue: value => {
            onSet && onSet(value)
            setValue(value)
        },
        error,
    }
}

const Shadow = () => (
    <View
        style={{
            backgroundColor: 'transparent',
            bottom: 0,
            left: 0,
            overflow: 'hidden',
            position: 'absolute',
            right: 0,
            shadowColor: 'black',
            shadowRadius: 2,
            shadowOpacity: 1,
            shadowOffset: {
                height: 2,
                width: 0,
            },
            top: 0,
        }}
    />
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
    <>
        <UiBodyCopy
            weight="bold"
            style={{ color: color.primary, marginBottom: metrics.vertical }}
        >
            {label}
        </UiBodyCopy>
        <View style={{ marginBottom: metrics.vertical * 2 }}>
            {/** <Shadow /> */}
            <TextInput
                style={{
                    borderColor: error ? color.error : color.primary,
                    borderWidth: 1,
                    color: editable ? 'black' : 'grey',
                    padding: metrics.horizontal,
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
                    marginBottom: metrics.vertical,
                }}
            >
                {error}
            </UiBodyCopy>
        )}
    </>
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
                paddingTop: insets.top + metrics.vertical * 2,
                backgroundColor: '#399fdc',
                flexDirection: 'row',
            }}
        >
            <TitlepieceText style={{ flex: 1, flexGrow: 1 }}>
                {children}
            </TitlepieceText>
            <Button
                buttonStyles={{
                    paddingHorizontal: 0,
                    aspectRatio: 1,
                    backgroundColor: 'transparent',
                    borderColor: color.primary,
                    borderWidth: 1,
                }}
                onPress={onDismiss}
            >
                X
            </Button>
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
                <View
                    style={{
                        left: 10,
                        position: 'absolute',
                        top: 100,
                        width: '100%',
                        alignItems: 'center',
                    }}
                >
                    {isLoading && <Spinner />}
                </View>
                <LoginHeader onDismiss={onDismiss}>{title}</LoginHeader>
                {errorMessage && <Text>{errorMessage}</Text>}
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
                    <View
                        style={{
                            alignItems: 'flex-start',
                            flexDirection: 'row',
                            flex: 1,
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
                            {hasInputEmail ? emailProgressText : 'Submit'}
                        </Button>
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

export { LogIn, useFormField }
