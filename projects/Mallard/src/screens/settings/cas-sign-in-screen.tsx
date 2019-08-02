import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, TextInput, Image, Platform } from 'react-native'
import { TitlepieceText } from 'src/components/styled-text'
import { metrics } from 'src/theme/spacing'
import { Button } from 'src/components/button/button'
import { NavigationScreenProp } from 'react-navigation'

const CasEndpointUrl = 'https://content-auth.guardian.co.uk/subs'

interface CasExpiry {
    content: string
    expiryDate: string
    expiryType: string
    provider: string
    subscriptionCode: string
}

interface CasError {
    message: string
    code: number
}

const checkCasSubscription = async (
    subscriberID: string,
    password: string,
    deviceId: string = 'MADE_IT_UP',
): Promise<CasExpiry> => {
    const res = await fetch(CasEndpointUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            appId: 'uk.co.guardian.editions', // Will change.
            deviceId: deviceId, // TODO - need to get this from somewhere: https://www.npmjs.com/package/react-native-device-info ?
            subscriberId: subscriberID,
            password: password,
        }),
    })

    const json = await res.json()

    if (res.status !== 200) {
        let casError: CasError = json
        throw new Error(`${casError.message}`)
    }

    return json.expiry
}

const CasSignInScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const [subscriberID, setSubscriberID] = useState('')
    const onSubscriberIdChange = useCallback(value => {
        setSubscriberID(value)
    }, [])

    const [password, setPassword] = useState('')
    const onPasswordChange = useCallback(value => {
        setPassword(value)
    }, [])

    return (
        <View>
            <View>
                <TitlepieceText>Activate your subscription</TitlepieceText>
            </View>

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
                    onPress={() => checkCasSubscription(subscriberID, password)}
                >
                    Submit
                </Button>
                <Text>What's a subscriber ID</Text>
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
