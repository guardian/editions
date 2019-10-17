import AsyncStorage from '@react-native-community/async-storage'
import React, { useContext, ReactNode, useState, useEffect } from 'react'
import { Alert, Clipboard, View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
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
import { FSPaths } from 'src/paths'
import { AccessContext } from 'src/authentication/AccessContext'
import { isValid } from 'src/authentication/lib/Attempt'
import DeviceInfo from 'react-native-device-info'
import RNFetchBlob from 'rn-fetch-blob'

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
    const { attempt, signOutCAS } = useContext(AccessContext)
    const apiUrl = useSettingsValue.apiUrl()
    const { showToast } = useToast()

    const [buildNumber, setBuildId] = useState('fetching...')
    const [files, setFiles] = useState('fetching...')
    useEffect(() => {
        DeviceInfo.getBuildNumber().then(buildNumber => setBuildId(buildNumber))
    }, [])

    useEffect(() => {
        RNFetchBlob.fs
            .ls(FSPaths.issuesDir + '/daily-edition')
            .then(files => setFiles(JSON.stringify(files)))
    }, [])

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
                        data: {
                            onPress: signOutCAS,
                        },
                    },
                    {
                        key: 'Build id',
                        title: 'Build commit hash',
                        explainer: getVersionInfo().commitId,
                        data: {
                            onPress: () => {},
                        },
                    },
                    {
                        key: 'Build number',
                        title: 'Build number',
                        explainer: buildNumber,
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
                    {
                        key: 'Copy local path to clipboard',
                        title: 'Copy local path to clipboard',
                        explainer: 'does what it says on the tin',
                        data: {
                            onPress: () => {
                                Clipboard.setString(FSPaths.issuesDir)
                                Alert.alert(FSPaths.issuesDir)
                            },
                        },
                    },
                    {
                        key: 'Files in Issues',
                        title: 'Files in Issues',
                        explainer: files,
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
                            explainer: `Signed in ${isValid(
                                attempt,
                            )} : ${isValid(attempt) && attempt.data}`,
                        },
                    ])}
            />
        </>
    )
})

export { DevZone }
