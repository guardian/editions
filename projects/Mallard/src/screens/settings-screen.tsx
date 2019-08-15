import React, { useContext } from 'react'
import { Text, Dimensions, View, Alert, StyleSheet } from 'react-native'
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
import { Button } from 'src/components/button/button'
import { WithAppAppearance } from 'src/theme/appearance'
import {
    useIdentity,
    AuthContext,
    useAuth,
} from 'src/authentication/auth-context'
import { RightChevron } from 'src/components/icons/RightChevron'
import { getFont } from 'src/theme/typography'
import { color } from 'src/theme/color'
import { routeNames } from 'src/navigation/routes'

const DevZone = withNavigation(({ navigation }: NavigationInjectedProps) => {
    const [settings, setSetting] = useSettings()
    const { status } = useContext(AuthContext)
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

const SettingsScreen = ({ navigation }: NavigationInjectedProps) => {
    const [settings, setSetting] = useSettings()
    const { isUsingProdDevtools } = settings
    const signInHandler = useIdentity()
    const authHandler = useAuth()
    const { signOut, restorePurchases } = useContext(AuthContext)

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
                            await signOut()
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
                    key: 'Activate with subscriber ID',
                    title: 'Activate with subscriber ID',
                    data: {
                        onPress: () => {
                            navigation.navigate(routeNames.CasSignIn)
                        },
                    },
                },
            ],
        }),
    ]

    return (
        <WithAppAppearance value={'settings'}>
            <ScrollContainer>
                <List
                    onPress={({ onPress }) => onPress()}
                    data={[
                        ...signInListItems,
                        {
                            key: 'Restore purchases',
                            title: 'Restore purchases',
                            data: {
                                onPress: () => {
                                    restorePurchases()
                                },
                            },
                        },
                    ]}
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
                                onPress: () => {},
                            },
                            proxy: <Text>{getVersionInfo().version}</Text>,
                        },
                        {
                            key: 'Build id',
                            title: 'Build',
                            data: {
                                onPress: () => {},
                            },
                            proxy: <Text>{getVersionInfo().commitId}</Text>,
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
                {!isUsingProdDevtools ? (
                    <>
                        <View
                            style={{
                                height: Dimensions.get('window').height,
                            }}
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
