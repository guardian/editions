import AsyncStorage from '@react-native-community/async-storage'
import React, { useContext, ReactNode, useState, useEffect } from 'react'
import { Alert, Clipboard, View } from 'react-native'
import { NavigationInjectedProps, withNavigation } from 'react-navigation'
import { Footer, Heading } from 'src/components/layout/ui/row'
import { List } from 'src/components/lists/list'
import { UiBodyCopy } from 'src/components/styled-text'
import { clearCache } from 'src/helpers/fetch/cache'
import { getVersionInfo } from 'src/helpers/settings'
import { routeNames } from 'src/navigation/routes'
import { Button } from 'src/components/button/button'
import { metrics } from 'src/theme/spacing'
import { useToast } from 'src/hooks/use-toast'
import { isInTestFlight } from 'src/helpers/release-stream'
import { FSPaths } from 'src/paths'
import { AccessContext } from 'src/authentication/AccessContext'
import { isValid } from 'src/authentication/lib/Attempt'
import DeviceInfo from 'react-native-device-info'
import { ALL_SETTINGS_FRAGMENT } from 'src/helpers/settings/resolvers'
import {
    setHasOnboarded,
    setIsUsingProdDevtools,
} from 'src/helpers/settings/setters'
import { useQuery } from 'src/hooks/apollo'
import gql from 'graphql-tag'
import { getPushTracking, clearPushTracking } from 'src/helpers/push-tracking'
import { getFileList } from 'src/helpers/files'
import { deleteIssueFiles } from 'src/helpers/files'

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
    const { attempt, signOutCAS } = useContext(AccessContext)
    const { showToast } = useToast()

    const [buildNumber, setBuildId] = useState('fetching...')
    const [files, setFiles] = useState('fetching...')
    const [pushTrackingInfo, setPushTrackingInfo] = useState('fetching...')

    useEffect(() => {
        DeviceInfo.getBuildNumber().then(buildNumber => setBuildId(buildNumber))
    }, [])

    useEffect(() => {
        getFileList().then(fileList => {
            setFiles(JSON.stringify(fileList, null, 2))
        })
    }, [])

    useEffect(() => {
        getPushTracking().then(pushTracking => {
            pushTracking && setPushTrackingInfo(pushTracking)
        })
    }, [])

    const query = useQuery<{ [key: string]: unknown }>(
        gql(`{ ${ALL_SETTINGS_FRAGMENT} }`),
    )
    if (query.loading) return null
    const { data, client } = query
    const { apiUrl } = data
    if (typeof apiUrl !== 'string') throw new Error('expected string')

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
                        setHasOnboarded(client, false)
                        navigation.navigate('Onboarding')
                    }}
                >
                    Re-start onboarding
                </Button>
                <Button
                    onPress={() => {
                        // go back to the main to simulate a fresh app
                        Alert.alert(
                            'Delete all issue files',
                            'You sure?',
                            [
                                {
                                    text: 'Delete issue files',
                                    onPress: () => {
                                        deleteIssueFiles()
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
                    Delete issue files
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
                        explainer: 'Tap the version 7 times to bring it back',
                        data: {
                            onPress: () => {
                                setIsUsingProdDevtools(client, false)
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
                    {
                        key: 'Clear Push Tracking',
                        title: 'Clear Push Tracking',
                        explainer:
                            'Clears out tracking information relating to pushes',
                        data: {
                            onPress: () =>
                                Alert.alert(
                                    'Are you sure?',
                                    'Are you sure you want to delete the push tracking infromation. Please note this will be unrecoverable',
                                    [
                                        {
                                            text: 'Cancel',
                                            onPress: () => null,
                                        },
                                        {
                                            text: 'Delete',
                                            onPress: () => {
                                                clearPushTracking()
                                                setPushTrackingInfo(
                                                    'fetching...',
                                                )
                                            },
                                            style: 'cancel',
                                        },
                                    ],
                                ),
                        },
                    },
                    {
                        key: 'Push Tracking Information',
                        title: 'Push Tracking Information',
                        explainer:
                            pushTrackingInfo !== 'fetching...'
                                ? JSON.stringify(
                                      JSON.parse(pushTrackingInfo),
                                      null,
                                      2,
                                  )
                                : pushTrackingInfo,
                        data: {
                            onPress: () => {},
                        },
                    },
                ]}
            />
            <Heading>Your settings</Heading>
            <List
                onPress={() => {}}
                data={Object.entries(data)
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
