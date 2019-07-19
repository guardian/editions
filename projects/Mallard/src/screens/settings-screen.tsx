import React from 'react'
import { Text, Dimensions, View, Alert } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import { List } from 'src/components/lists/list'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'
import { useSettings } from 'src/hooks/use-settings'
import { MonoTextBlock } from 'src/components/styled-text'
import { Highlight } from 'src/components/highlight'
import { APP_DISPLAY_NAME, FEEDBACK_EMAIL } from 'src/helpers/words'
import { clearCache } from 'src/helpers/fetch/cache'
import { Heading } from 'src/components/layout/ui/row'
import { getVersionInfo } from 'src/helpers/settings'
import { metrics } from 'src/theme/spacing'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { resetCredentials } from 'src/authentication/keychain'
import { useSignInStatus, SignInStatus } from 'src/hooks/use-sign-in-status'

const DevZone = withNavigation(({ navigation }: NavigationInjectedProps) => {
    const [settings, setSetting] = useSettings()
    const { apiUrl } = settings
    return (
        <>
            <Heading>💣 DEVELOPER ZONE 💣</Heading>
            <MonoTextBlock>
                Only wander here if you know what you are doing!!
            </MonoTextBlock>
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
    const status = useSignInStatus()

    const signInListItems =
        status === SignInStatus.pending
            ? []
            : [
                  {
                      key: `Sign ${
                          status === SignInStatus.signedIn ? 'out' : 'in'
                      }`,
                      title: `Sign ${
                          status === SignInStatus.signedIn ? 'out' : 'in'
                      }`,
                      data: {
                          onPress: async () => {
                              if (status === SignInStatus.signedIn) {
                                  await resetCredentials()
                              }
                              navigation.navigate('SignIn')
                          },
                      },
                  },
              ]

    return (
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
            <MonoTextBlock>
                {`Thanks for helping us test the ${APP_DISPLAY_NAME} app!` +
                    `your feedback will be invaluable to the final product.`}
            </MonoTextBlock>
            <MonoTextBlock style={{ marginBottom: metrics.vertical * 4 }}>
                {`Send us feedback to ${FEEDBACK_EMAIL}`}
            </MonoTextBlock>
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
                    <View style={{ height: Dimensions.get('window').height }} />
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
    )
}
SettingsScreen.navigationOptions = {
    title: 'Settings',
}

export { SettingsScreen }
