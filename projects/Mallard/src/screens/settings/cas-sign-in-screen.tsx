import React, { useState, useCallback, useContext } from 'react'
import { View, Text, Image, StyleSheet } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { fetchAndPersistCASExpiry } from 'src/authentication/helpers'
import { AuthContext } from 'src/authentication/auth-context'
import { CASAuthStatus } from 'src/authentication/credentials-chain'
import { LoginLayout } from 'src/components/login/login-layout'
import { LoginInput } from 'src/components/login/login-input'
import { LoginButton } from 'src/components/login/login-button'

const styles = StyleSheet.create({
    image: { height: 200, width: undefined },
})

const CasSignInScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const { setStatus } = useContext(AuthContext)
    const [subscriberID, setSubscriberID] = useState('')

    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(false)

    const onSubscriberIdChange = useCallback(value => {
        setErrorMessage(null)
        setSubscriberID(value)
    }, [])

    const [password, setPassword] = useState('')
    const onPasswordChange = useCallback(value => {
        setErrorMessage(null)
        setPassword(value)
    }, [])

    const handleSubmit = async () => {
        try {
            const expiry = await fetchAndPersistCASExpiry(
                subscriberID,
                password,
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
                    error={null}
                    onChangeText={onSubscriberIdChange}
                    keyboardType="number-pad"
                    label="Subscriber ID (including all zeros)"
                    accessibilityLabel="subscriber id input"
                    value={subscriberID}
                />
                <LoginInput
                    error={null}
                    onChangeText={onPasswordChange}
                    label="Postcode or surname"
                    accessibilityLabel="postcode or surname input"
                    value={password}
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
