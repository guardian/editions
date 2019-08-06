import React, { useState, useCallback, useContext } from 'react'
import { View, Text, TextInput, Image } from 'react-native'
import { TitlepieceText } from 'src/components/styled-text'
import { metrics } from 'src/theme/spacing'
import { Button } from 'src/components/button/button'
import { NavigationScreenProp } from 'react-navigation'
import { fetchAndPersistCASExpiry } from 'src/authentication/helpers'
import { AuthContext } from 'src/authentication/auth-context'
import { CASAuthStatus } from 'src/authentication/credentials-chain'

const CasSignInScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const { setStatus } = useContext(AuthContext)
    const [subscriberID, setSubscriberID] = useState('')

    const [error, setError] = useState<string | null>(null)

    const onSubscriberIdChange = useCallback(value => {
        setError(null)
        setSubscriberID(value)
    }, [])

    const [password, setPassword] = useState('')
    const onPasswordChange = useCallback(value => {
        setError(null)
        setPassword(value)
    }, [])

    const handleSubmit = async () => {
        try {
            const expiry = await fetchAndPersistCASExpiry(
                subscriberID,
                password,
            )
            setStatus(CASAuthStatus(expiry))
        } catch (e) {
            setError(e)
        }
    }

    return (
        <View>
            <View>
                <TitlepieceText>Activate your subscription</TitlepieceText>
            </View>
            {error && <Text>{error}</Text>}
            <View>
                <Text>Subscriber ID (including all zeros)</Text>
                <TextInput
                    style={{
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderRadius: 999,
                        color: 'black',
                        marginBottom: 10,
                        padding: metrics.horizontal * 2,
                        paddingVertical: metrics.vertical,
                    }}
                    returnKeyType="done"
                    placeholderTextColor="grey"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={onSubscriberIdChange}
                ></TextInput>
                <Text>Postcode or surname</Text>
                <TextInput
                    style={{
                        backgroundColor: 'white',
                        borderWidth: 1,
                        borderRadius: 999,
                        color: 'black',
                        marginBottom: 10,
                        padding: metrics.horizontal * 2,
                        paddingVertical: metrics.vertical,
                    }}
                    placeholderTextColor="grey"
                    returnKeyType="done"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onChangeText={onPasswordChange}
                ></TextInput>
                <Button
                    center
                    buttonStyles={{
                        marginBottom: 10,
                    }}
                    onPress={handleSubmit}
                >
                    Submit
                </Button>
                <Text>What&apos;s a subscriber ID</Text>
                <Text>
                    You can find your subscriber ID on your subscription
                    confirmation email. If you collect your paper, your
                    subscriber ID is on your voucher.
                </Text>

                <Image
                    resizeMode="contain"
                    style={{ height: 200, width: undefined }}
                    source={require(`src/assets/images/cas-voucher.jpg`)}
                />
            </View>
        </View>
    )
}

export { CasSignInScreen }
