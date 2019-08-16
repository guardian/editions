import React, { useState, useContext } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { fetchAndPersistCASExpiry } from 'src/authentication/helpers'
import { AuthContext } from 'src/authentication/auth-context'
import { CASAuthStatus } from 'src/authentication/credentials-chain'
import { LoginLayout } from 'src/components/login/login-layout'
import { LoginInput } from 'src/components/login/login-input'
import { LoginButton } from 'src/components/login/login-button'
import { useFormField } from 'src/hooks/use-form-field'

const styles = StyleSheet.create({
    image: { height: 200, width: undefined },
})

const CasSignInScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const { setStatus } = useContext(AuthContext)

    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const subscriberID = useFormField('', {
        validator: subId => (subId ? null : 'Please enter a subscriber ID'),
        onSet: () => setErrorMessage(null),
    })
    const password = useFormField('', {
        validator: password =>
            password ? null : 'Please enter a postcode or surname',
        onSet: () => setErrorMessage(null),
    })

    const handleSubmit = async () => {
        try {
            const expiry = await fetchAndPersistCASExpiry(
                subscriberID.value,
                password.value,
            )
            setStatus(CASAuthStatus(expiry))
        } catch (err) {
            setErrorMessage(
                (err instanceof Error ? err.message : err) ||
                    'Something went wrong',
            )
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <LoginLayout
            title="Activate your subscription"
            onDismiss={() => navigation.goBack()}
            isLoading={isLoading}
            errorMessage={errorMessage}
        >
            <View>
                <LoginInput
                    error={subscriberID.error}
                    onChangeText={subscriberID.setValue}
                    label="Subscriber ID (including all zeros)"
                    accessibilityLabel="subscriber id input"
                    value={subscriberID.value}
                />
                <LoginInput
                    error={password.error}
                    onChangeText={password.setValue}
                    label="Postcode or surname"
                    accessibilityLabel="postcode or surname input"
                    value={password.value}
                />
                <LoginButton type="cta" onPress={handleSubmit}>
                    Submit
                </LoginButton>
                <Text>What&apos;s a subscriber ID?</Text>
                <Text>
                    You can find your subscriber ID on your subscription
                    confirmation email. If you collect your paper, your
                    subscriber ID is on your voucher.
                </Text>

                <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={require(`src/assets/images/cas-voucher.jpg`)}
                />
            </View>
        </LoginLayout>
    )
}

export { CasSignInScreen }
