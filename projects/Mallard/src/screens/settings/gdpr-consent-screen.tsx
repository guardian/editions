import React from 'react'
import { FlatList, View, Alert, Text } from 'react-native'
import { Button, ButtonAppearance } from 'src/components/Button/Button'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { Footer, Separator, TallRow } from 'src/components/layout/ui/row'
import {
    ThreeWaySwitch,
    ThreeWaySwitchValue,
} from 'src/components/layout/ui/switch'
import { LinkNav } from 'src/components/link'
import { UiBodyCopy } from 'src/components/styled-text'
import {
    GdprSwitchSettings,
    CURRENT_CONSENT_VERSION,
    GdprBuckets,
    gdprSwitchSettings,
    GdprSettings,
    GdprDefaultSettings,
} from 'src/helpers/settings'
import {
    PREFS_SAVED_MSG,
    PRIVACY_SETTINGS_HEADER_TITLE,
} from 'src/helpers/words'
import { WithAppAppearance } from 'src/theme/appearance'
import { useToast } from 'src/hooks/use-toast'
import { LoginHeader } from 'src/components/login/login-layout'
import { NavigationInjectedProps } from 'react-navigation'
import { routeNames } from 'src/navigation/routes'
import {
    gdprAllowFunctionalityKey,
    gdprAllowPerformanceKey,
} from 'src/helpers/settings'
import gql from 'graphql-tag'
import { useQuery } from 'src/hooks/apollo'
import { Settings } from 'src/helpers/settings'
import { GDPR_SETTINGS_FRAGMENT } from 'src/helpers/settings/resolvers'
import {
    setGdprConsentVersion,
    setGdprFlag,
} from 'src/helpers/settings/setters'
import ApolloClient from 'apollo-client'

interface GdprSwitch {
    key: keyof GdprSwitchSettings
    name: string
    services: string
    description: string
}
type EssentialGdprSwitch = Omit<GdprSwitch, 'key'>

const essentials: EssentialGdprSwitch = {
    name: 'Essential',
    services: 'Ophan - Braze - YouTube Player',
    description:
        'These are essential to provide you with services that you have requested. For example, this includes supporting the ability for you to watch videos and see service-related messages.',
}

const setConsent = (
    client: ApolloClient<object>,
    consentBucketKey: keyof GdprSwitchSettings,
    value: ThreeWaySwitchValue,
) => {
    setGdprFlag(client, consentBucketKey, value)
    GdprBuckets[consentBucketKey].forEach(key => {
        setGdprFlag(client, key, value)
    })
    setGdprConsentVersion(client, CURRENT_CONSENT_VERSION)
}

const consentToAll = (client: ApolloClient<object>) => {
    gdprSwitchSettings.forEach(sw => {
        setConsent(client, sw, true)
    })
    setGdprConsentVersion(client, CURRENT_CONSENT_VERSION)
}

const resetAll = (client: ApolloClient<object>) => {
    gdprSwitchSettings.forEach(sw => {
        setConsent(client, sw, null)
    })
    setGdprConsentVersion(client, null)
}

const QUERY = gql`
    {
        isUsingProdDevtools @client
        ${GDPR_SETTINGS_FRAGMENT}
    }
`

type QueryData = {
    isUsingProdDevtools: Settings['isUsingProdDevtools']
} & GdprSettings &
    GdprDefaultSettings &
    GdprSwitchSettings

const GdprConsent = ({
    shouldShowDismissableHeader = false,
    navigation,
    continueText,
}: {
    shouldShowDismissableHeader?: boolean
    continueText: string
} & NavigationInjectedProps) => {
    const { showToast } = useToast()
    const query = useQuery<QueryData>(QUERY)
    if (query.loading) return null
    const { client, data } = query

    const switches: { [key in keyof GdprSwitchSettings]: GdprSwitch } = {
        gdprAllowPerformance: {
            key: gdprAllowPerformanceKey,
            name: 'Performance',
            services: 'Sentry - Logging',
            description:
                'Enabling these allow us to observe and measure how you use our services. We use this information to fix bugs more quickly so that users have a better experience. For example, we would be able to see the journey you have taken and where the error was encountered. Your data will only be stored in our servers for two weeks. If you disable this, we will not be able to observe and measure your use of our services, and we will have less information about their performance and details of any issues encountered.',
        },
        gdprAllowFunctionality: {
            key: gdprAllowFunctionalityKey,
            name: 'Functionality',
            services: 'Google - Facebook',
            description:
                'Enabling these allow us to provide you with a range of functionality and store related information. For example, you can use social media credentials such as your Google account to log into your Guardian account. If you disable this, some features of our services may not function.',
        },
    }

    const onEnableAllAndContinue = () => {
        consentToAll(client)
        showToast(PREFS_SAVED_MSG)
        navigation.navigate('App')
    }

    const onDismiss = () => {
        if (
            data.gdprAllowFunctionality != null &&
            data.gdprAllowPerformance != null &&
            data.gdprConsentVersion === CURRENT_CONSENT_VERSION
        ) {
            showToast(PREFS_SAVED_MSG)
            navigation.navigate('App')
        } else {
            Alert.alert(
                'Before you go',
                `Please set your preferences for 'Performance' and 'Functionality'.`,
                [
                    { text: 'Manage preferences', onPress: () => {} },
                    {
                        text: continueText,
                        onPress: () => onEnableAllAndContinue(),
                    },
                ],
                { cancelable: false },
            )
        }
    }

    return (
        <View>
            {shouldShowDismissableHeader ? (
                <LoginHeader onDismiss={onDismiss}>
                    {PRIVACY_SETTINGS_HEADER_TITLE}
                </LoginHeader>
            ) : (
                <></>
            )}
            <TallRow
                title={''}
                explainer={
                    <Text>
                        Below you can manage your privacy settings for cookies
                        and similar technologies for this service. These
                        technologies are provided by us and by our third-party
                        partners. To find out more, read our{' '}
                        <LinkNav
                            onPress={() =>
                                navigation.navigate(routeNames.PrivacyPolicy)
                            }
                        >
                            privacy policy
                        </LinkNav>
                        . If you disable a category, you may need to restart the
                        app for your changes to fully take effect.
                    </Text>
                }
                proxy={
                    <Button
                        appearance={ButtonAppearance.skeleton}
                        onPress={() => onEnableAllAndContinue()}
                    >
                        {continueText}
                    </Button>
                }
            ></TallRow>
            <Separator></Separator>
            <TallRow
                title={essentials.name}
                subtitle={essentials.services}
                explainer={essentials.description}
            ></TallRow>

            <FlatList
                ItemSeparatorComponent={Separator}
                ListFooterComponent={Separator}
                ListHeaderComponent={Separator}
                data={Object.values(switches)}
                keyExtractor={({ key }) => key}
                renderItem={({ item }) => (
                    <TallRow
                        title={item.name}
                        subtitle={item.services}
                        explainer={item.description}
                        proxy={
                            <ThreeWaySwitch
                                onValueChange={value => {
                                    setConsent(client, item.key, value)
                                    showToast(PREFS_SAVED_MSG)
                                }}
                                value={
                                    data.gdprConsentVersion !==
                                    CURRENT_CONSENT_VERSION
                                        ? null
                                        : data[item.key]
                                }
                            />
                        }
                    ></TallRow>
                )}
            />
            <Footer>
                <UiBodyCopy weight="bold" style={{ fontSize: 14 }}>
                    You can change the above settings any time by selecting
                    Privacy Settings from the Settings menu.
                </UiBodyCopy>
            </Footer>
            {__DEV__ ? (
                <Footer>
                    <Button onPress={resetAll.bind(undefined, client)}>
                        Reset
                    </Button>
                </Footer>
            ) : null}
        </View>
    )
}

const GdprConsentScreen = ({ navigation }: NavigationInjectedProps) => (
    <WithAppAppearance value={'settings'}>
        <ScrollContainer>
            <GdprConsent
                navigation={navigation}
                continueText={'Enable all'}
            ></GdprConsent>
        </ScrollContainer>
    </WithAppAppearance>
)

const GdprConsentScreenForOnboarding = ({
    navigation,
}: NavigationInjectedProps) => (
    <WithAppAppearance value={'settings'}>
        <ScrollContainer>
            <GdprConsent
                shouldShowDismissableHeader={true}
                continueText={'Enable all and continue'}
                navigation={navigation}
            ></GdprConsent>
        </ScrollContainer>
    </WithAppAppearance>
)

GdprConsentScreen.navigationOptions = {
    title: PRIVACY_SETTINGS_HEADER_TITLE,
}

export { GdprConsent, GdprConsentScreenForOnboarding, GdprConsentScreen }
