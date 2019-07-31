import React, { useContext } from 'react'
import { Text, Dimensions, View, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import { List } from 'src/components/lists/list'
import {
    withNavigation,
    NavigationInjectedProps,
    NavigationScreenProp,
} from 'react-navigation'
import { useSettings } from 'src/hooks/use-settings'
import { UiBodyCopy } from 'src/components/styled-text'
import { Highlight } from 'src/components/highlight'
import { APP_DISPLAY_NAME, FEEDBACK_EMAIL } from 'src/helpers/words'
import { clearCache } from 'src/helpers/fetch/cache'
import { Heading, Footer } from 'src/components/layout/ui/row'
import { getVersionInfo } from 'src/helpers/settings'
import { metrics } from 'src/theme/spacing'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { routeNames } from 'src/navigation'
import { Button } from 'src/components/button/button'
import { WithAppAppearance } from 'src/theme/appearance'
import { useAuth, AuthContext } from 'src/authentication/auth-context'

const DevZone = withNavigation(({ navigation }: NavigationInjectedProps) => {
    const [settings, setSetting] = useSettings()
    const { apiUrl } = settings
    return (
        <>
            <Heading>💣 DEVELOPER ZONE 💣</Heading>
            <Footer>
                <UiBodyCopy>
                    Only wander here if you know what you are doing!!
                </UiBodyCopy>
            </Footer>
            <List
                onPress={({ onPress }) => onPress()}
                data={[
                    {
                        key: 'Downloads',
                        title: 'Manage issues',
                        data: {
                            onPress: () => {
                                navigation.navigate('Downloads')
                            },
                        },
                    },
                    {
                        key: 'Endpoints',
                        title: 'API Endpoint',
                        explainer: apiUrl,
                        data: {
                            onPress: () => {
                                navigation.navigate('Endpoints')
                            },
                        },
                    },
                    {
                        key: 'Clear caches',
                        title: 'Clear caches',
                        data: {
                            onPress: () => {
                                Alert.alert(
                                    'Clear caches',
                                    'You sure?',
                                    [
                                        {
                                            text: 'Delete fetch cache',
                                            onPress: () => {
                                                clearCache()
                                            },
                                        },
                                        {
                                            text: 'Delete EVERYTHING',
                                            onPress: () => {
                                                AsyncStorage.clear()
                                            },
                                        },
                                        {
                                            style: 'cancel',
                                            text: `No don't do it`,
                                        },
                                    ],
                                    { cancelable: false },
                                )
                            },
                        },
                    },
                    {
                        key: 'Re-start onboarding',
                        title: 'Re-start onboarding',
                        data: {
                            onPress: () => {
                                // go back to the main to simulate a fresh app
                                setSetting('hasOnboarded', false)
                                navigation.navigate('Onboarding')
                            },
                        },
                    },
                    {
                        key: 'Hide this menu',
                        title: 'Hide this menu',
                        explainer:
                            'Scroll down and tap the duck to bring it back',
                        data: {
                            onPress: () => {
                                setSetting('isUsingProdDevtools', false)
                            },
                        },
                    },
                ]}
            />
            <Heading>Your settings</Heading>
            <List
                onPress={() => {}}
                data={Object.entries(settings).map(([title, explainer]) => ({
                    key: title,
                    title,
                    explainer: explainer + '',
                }))}
            />
        </>
    )
})

const SettingsScreen = ({ navigation }: NavigationInjectedProps) => {
    const [settings, setSetting] = useSettings()
    const { isUsingProdDevtools } = settings
    const handler = useAuth()
    const { signOut } = useContext(AuthContext)

    const signInListItems = handler({
        pending: () => [],
        signedIn: (_, data) => [
            {
                key: `Sign out`,
                title: `Sign out of ${data.userDetails.publicFields.displayName}`,
                data: {
                    onPress: async () => {
                        await signOut()
                        navigation.navigate(routeNames.SignIn)
                    },
                },
            },
        ],
        signedOut: () => [
            {
                key: `Sign in`,
                title: `Sign in`,
                data: {
                    onPress: () => {
                        navigation.navigate(routeNames.SignIn)
                    },
                },
            },
        ],
    })

    return (
        <WithAppAppearance value={'settings'}>
            <ScrollContainer>
                <Heading>Settings</Heading>
                <List
                    onPress={({ onPress }) => onPress()}
                    data={[
                        ...signInListItems,
                        {
                            key: 'Consent settings',
                            title: 'Consent settings',
                            data: {
                                onPress: () => {
                                    navigation.navigate('GdprConsent')
                                },
                            },
                        },
                    ]}
                />
                <Heading>{`About ${APP_DISPLAY_NAME}`}</Heading>
                <Footer>
                    <UiBodyCopy>
                        {`Thanks for helping us test the ${APP_DISPLAY_NAME} app!` +
                            `your feedback will be invaluable to the final product.`}
                    </UiBodyCopy>
                </Footer>
                <Footer style={{ marginBottom: metrics.vertical * 4 }}>
                    <UiBodyCopy>
                        {`Send us feedback to ${FEEDBACK_EMAIL}`}
                    </UiBodyCopy>
                </Footer>
                <List
                    onPress={() => {}}
                    data={[
                        {
                            key: '0',
                            title: 'App version',
                            explainer: getVersionInfo().version,
                            data: {},
                        },
                        {
                            key: '1',
                            title: 'Build id',
                            explainer: getVersionInfo().commitId,
                            data: {},
                        },
                    ]}
                />
                {!isUsingProdDevtools ? (
                    <>
                        <View
                            style={{ height: Dimensions.get('window').height }}
                        />
                        <Highlight
                            style={{ alignItems: 'center' }}
                            onPress={() => {
                                setSetting('isUsingProdDevtools', true)
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    padding: 40,
                                }}
                            >
                                🦆
                            </Text>
                        </Highlight>
                    </>
                ) : (
                    <DevZone />
                )}
            </ScrollContainer>
        </WithAppAppearance>
    )
}
SettingsScreen.navigationOptions = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => ({
    title: 'Settings',
    headerTitleStyle: {
        textAlign: 'center',
        flex: 1,
    },
    headerLeft: () => (
        <Button onPress={() => navigation.goBack(null)}>Back</Button>
    ),
})

export { SettingsScreen }
