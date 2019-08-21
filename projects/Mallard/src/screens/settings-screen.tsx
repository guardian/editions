import AsyncStorage from '@react-native-community/async-storage'
import React, { useContext, useState } from 'react'
import { Alert, StyleSheet, Text } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import {
    AuthContext,
    useAuth,
    useIdentity,
} from 'src/authentication/auth-context'
import { RightChevron } from 'src/components/icons/RightChevron'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { Footer, Heading } from 'src/components/layout/ui/row'
import { List } from 'src/components/lists/list'
import { UiBodyCopy } from 'src/components/styled-text'
import { clearCache } from 'src/helpers/fetch/cache'
import { getVersionInfo } from 'src/helpers/settings'
import { APP_DISPLAY_NAME, FEEDBACK_EMAIL } from 'src/helpers/words'
import { useSettings, useSettingsValue } from 'src/hooks/use-settings'
import { routeNames } from 'src/navigation/routes'
import { WithAppAppearance } from 'src/theme/appearance'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { DevZone } from './settings/dev-zone'

const SettingsScreen = ({ navigation }: NavigationInjectedProps) => {
    const setSetting = useSettings()
    const isUsingProdDevtools = useSettingsValue.isUsingProdDevtools()
    const signInHandler = useIdentity()
    const authHandler = useAuth()
    const [, setVersionClickedTimes] = useState(0)
    const { signOutIdentity } = useContext(AuthContext)
    const styles = StyleSheet.create({
        signOut: {
            color: color.ui.supportBlue,
            ...getFont('sans', 1),
        },
    })

    const rightChevronIcon = <RightChevron />

    const signInListItems = [
        ...signInHandler({
            pending: () => [],
            signedIn: data => [
                {
                    key: `Sign out`,
                    title: data.userDetails.publicFields.displayName,
                    data: {
                        onPress: async () => {
                            await signOutIdentity()
                        },
                    },
                    proxy: <Text style={styles.signOut}>Sign Out</Text>,
                },
                {
                    key: `Subscription details`,
                    title: `Subscription details`,
                    data: {
                        onPress: async () => {},
                    },
                    proxy: rightChevronIcon,
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
                    proxy: rightChevronIcon,
                },
            ],
        }),
        ...authHandler({
            pending: () => [],
            authed: () => [],
            unauthed: () => [
                {
                    key: `I'm already subscribed`,
                    title: `I'm already subscribed`,
                    data: {
                        onPress: () => {
                            navigation.navigate(routeNames.AlreadySubscribed)
                        },
                    },
                    proxy: rightChevronIcon,
                },
            ],
        }),
    ]

    return (
        <WithAppAppearance value={'settings'}>
            <ScrollContainer>
                <List
                    onPress={({ onPress }) => onPress()}
                    data={signInListItems}
                />
                <Heading>{``}</Heading>
                <List
                    onPress={({ onPress }) => onPress()}
                    data={[
                        {
                            key: 'Privacy settings',
                            title: 'Privacy settings',
                            data: {
                                onPress: () => {
                                    navigation.navigate(routeNames.GdprConsent)
                                },
                            },
                            proxy: rightChevronIcon,
                        },
                        {
                            key: 'Privacy policy',
                            title: 'Privacy policy',
                            data: {
                                onPress: () => {
                                    navigation.navigate(
                                        routeNames.PrivacyPolicy,
                                    )
                                },
                            },
                            proxy: rightChevronIcon,
                        },
                        {
                            key: 'Terms and conditions',
                            title: 'Terms and conditions',
                            data: {
                                onPress: () => {
                                    navigation.navigate(
                                        routeNames.TermsAndConditions,
                                    )
                                },
                            },
                            proxy: rightChevronIcon,
                        },
                    ]}
                />
                <Heading>{``}</Heading>
                <List
                    onPress={({ onPress }) => onPress()}
                    data={[
                        {
                            key: 'Help',
                            title: 'Help',
                            data: {
                                onPress: () => {
                                    navigation.navigate(routeNames.Help)
                                },
                            },
                            proxy: rightChevronIcon,
                        },
                        {
                            key: 'Clear cache',
                            title: 'Clear cache',
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
                            key: 'Credits',
                            title: 'Credits',
                            data: {
                                onPress: () => {
                                    navigation.navigate(routeNames.Credits)
                                },
                            },
                            proxy: rightChevronIcon,
                        },
                        {
                            key: 'Version',
                            title: 'Version',
                            data: {
                                onPress: () => {
                                    if (!isUsingProdDevtools) {
                                        setVersionClickedTimes(t => {
                                            if (t < 7) return t + 1
                                            Alert.alert(
                                                'Delete all stored data',
                                                'Are you sure?',
                                                [
                                                    {
                                                        text: 'Delete data',
                                                        style: 'destructive',
                                                        onPress: () => {
                                                            setSetting(
                                                                'isUsingProdDevtools',
                                                                true,
                                                            )
                                                            Alert.alert(
                                                                'You are a developer now!',
                                                            )
                                                        },
                                                    },
                                                    {
                                                        text: 'Cancel',
                                                        style: 'cancel',
                                                        onPress: () => {
                                                            AsyncStorage.clear()
                                                        },
                                                    },
                                                ],
                                                { cancelable: false },
                                            )
                                            return 0
                                        })
                                    }
                                },
                            },
                            proxy: <Text>{getVersionInfo().version}</Text>,
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
                {isUsingProdDevtools && <DevZone />}
            </ScrollContainer>
        </WithAppAppearance>
    )
}

SettingsScreen.navigationOptions = {
    title: 'Settings',
}

export { SettingsScreen }
