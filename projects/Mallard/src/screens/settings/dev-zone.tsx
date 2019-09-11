import AsyncStorage from '@react-native-community/async-storage'
import React, { useContext, ReactNode } from 'react'
import { Alert, View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { AuthContext } from 'src/authentication/auth-context'
import { Footer, Heading } from 'src/components/layout/ui/row'
import { List } from 'src/components/lists/list'
import { UiBodyCopy } from 'src/components/styled-text'
import { clearCache } from 'src/helpers/fetch/cache'
import { getVersionInfo } from 'src/helpers/settings'
import {
    useSettings,
    useOtherSettingsValues,
    useSettingsValue,
} from 'src/hooks/use-settings'
import { routeNames } from 'src/navigation/routes'
import { Button } from 'src/components/button/button'
import { metrics } from 'src/theme/spacing'
import { useToast } from 'src/hooks/use-toast'
import { isInTestFlight } from 'src/helpers/release-stream'
import { DEV_clearCASCaches } from 'src/helpers/storage'

const ButtonList = ({ children }: { children: ReactNode }) => {
    return (
        <Footer>
            <View style={{ width: '100%' }}>
                {React.Children.map(children, (button, i) => (
                    <View
                        key={i}
                        style={{
                            marginVertical: metrics.vertical / 2,
                            marginHorizontal: metrics.horizontal,
                        }}
                    >
                        {button}
                    </View>
                ))}
            </View>
        </Footer>
    )
}

const DevZone = withNavigation(({ navigation }: NavigationInjectedProps) => {
    const setSetting = useSettings()
    const settings = useOtherSettingsValues()
    const { status } = useContext(AuthContext)
    const apiUrl = useSettingsValue.apiUrl()
    const { showToast } = useToast()
    return (
        <>
            <Heading>🦆 SECRET DUCK MENU 🦆</Heading>
            <Footer>
                <UiBodyCopy>
                    Only wander here if you know what you are doing!!
                </UiBodyCopy>
            </Footer>
            <ButtonList>
                <Button
                    onPress={() => {
                        // go back to the main to simulate a fresh app
                        setSetting('hasOnboarded', false)
                        navigation.navigate('Onboarding')
                    }}
                >
                    Re-start onboarding
                </Button>
                <Button
                    onPress={() => {
                        showToast('Toast title', { subtitle: 'Subtitle' })
                    }}
                >
                    Pop a toast
                </Button>
                <Button
                    onPress={() => {
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
                    }}
                >
                    Clear caches
                </Button>
            </ButtonList>
            <List
                onPress={({ onPress }) => onPress()}
                data={[
                    {
                        key: 'Downloads',
                        title: 'Manage issues',
                        data: {
                            onPress: () => {
                                navigation.navigate(routeNames.Downloads)
                            },
                        },
                    },
                    {
                        key: 'Endpoints',
                        title: 'API Endpoint',
                        explainer: apiUrl,
                        data: {
                            onPress: () => {
                                navigation.navigate(routeNames.Endpoints)
                            },
                        },
                    },
                    {
                        key: 'Hide this menu',
                        title: 'Hide this menu',
                        explainer:
                            'Tap the version 7 times & confirm the fake scary message to bring it back',
                        data: {
                            onPress: () => {
                                setSetting('isUsingProdDevtools', false)
                            },
                        },
                    },
                    {
                        key: 'Clear CAS caches',
                        title: 'Clear CAS caches',
                        explainer:
                            'You will need to reload the app for this to take effect',
                        data: {
                            onPress: DEV_clearCASCaches,
                        },
                    },
                    {
                        key: 'Build id',
                        title: 'Build',
                        explainer: getVersionInfo().commitId,
                        data: {
                            onPress: () => {},
                        },
                    },
                    {
                        key: 'Reports as in test flight',
                        title: 'Reports as in test flight',
                        explainer: isInTestFlight().toString(),
                        data: {
                            onPress: () => {},
                        },
                    },
                ]}
            />
            <Heading>Your settings</Heading>
            <List
                onPress={() => {}}
                data={Object.entries(settings)
                    .map(([title, explainer]) => ({
                        key: title,
                        title,
                        explainer: explainer + '',
                    }))
                    .concat([
                        {
                            key: 'Authentication details',
                            title: 'Authentication details',
                            explainer: `Signed in status ${status.type} : ${
                                status.type === 'authed'
                                    ? status.data.type
                                    : '_'
                            }`,
                        },
                    ])}
            />
        </>
    )
})

export { DevZone }
