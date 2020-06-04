import React, { useContext, useState } from 'react'
import { Alert, Text, Switch, Linking } from 'react-native'
import {
    NavigationInjectedProps,
    NavigationRoute,
    NavigationParams,
} from 'react-navigation'
import { RightChevron } from 'src/components/icons/RightChevron'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { Heading } from 'src/components/layout/ui/row'
import { List } from 'src/components/lists/list'
import { routeNames } from 'src/navigation/routes'
import { WithAppAppearance } from 'src/theme/appearance'
import { DevZone } from './settings/dev-zone'
import { isStaffMember } from 'src/authentication/helpers'
import {
    AccessContext,
    useIdentity,
    useAccess,
} from 'src/authentication/AccessContext'
import DeviceInfo from 'react-native-device-info'
import {
    setIsWeatherShown,
    setIsUsingProdDevtools,
} from 'src/helpers/settings/setters'
import { useQuery } from 'src/hooks/apollo'
import gql from 'graphql-tag'
import ApolloClient from 'apollo-client'
import { NavigationScreenProp } from 'react-navigation'
import { FullButton } from 'src/components/lists/FullButton'
import { DualButton } from 'src/components/lists/DualButton'

const MiscSettingsList = React.memo(
    (props: {
        isWeatherShown: boolean
        client: ApolloClient<object>
        navigation: NavigationScreenProp<
            NavigationRoute<NavigationParams>,
            NavigationParams
        >
    }) => {
        const onChange = () =>
            setIsWeatherShown(props.client, !props.isWeatherShown)
        const items = [
            {
                key: 'isWeatherShown',
                title: 'Display weather',
                onPress: onChange,
                proxy: (
                    <Switch
                        accessible={true}
                        accessibilityLabel="Switch button"
                        accessibilityHint="Double tap to toggle setting"
                        accessibilityRole="switch"
                        value={props.isWeatherShown}
                        onValueChange={onChange}
                    />
                ),
            },
            {
                key: 'manageEditions',
                title: 'Manage editions',
                onPress: () =>
                    props.navigation.navigate(
                        routeNames.ManageEditionsSettings,
                    ),
                proxy: <RightChevron />,
            },
        ]
        return <List data={items} />
    },
)

type QueryData = { isWeatherShown: boolean; isUsingProdDevtools: boolean }

const QUERY = gql`
    {
        isWeatherShown @client
        isUsingProdDevtools @client
    }
`

const SignInButton = ({
    username,
    navigation,
    signOutIdentity,
}: {
    username?: string
    navigation: NavigationScreenProp<NavigationRoute>
    signOutIdentity: () => void
}) =>
    username ? (
        <DualButton
            textPrimary={username}
            textSecondary="Sign out"
            onPressPrimary={() =>
                Linking.openURL(
                    'https://manage.theguardian.com/account-settings',
                ).catch(() => signOutIdentity())
            }
            onPressSecondary={() => signOutIdentity()}
        />
    ) : (
        <FullButton
            text="Sign in"
            onPress={() => navigation.navigate(routeNames.SignIn)}
        />
    )

const SettingsScreen = ({ navigation }: NavigationInjectedProps) => {
    const query = useQuery<QueryData>(QUERY)
    const identityData = useIdentity()
    const canAccess = useAccess()
    const [, setVersionClickedTimes] = useState(0)
    const { signOutIdentity } = useContext(AccessContext)

    const versionNumber = DeviceInfo.getVersion()

    if (query.loading) return null
    const { client } = query
    const { isUsingProdDevtools, isWeatherShown } = query.data

    const versionClickHandler = identityData
        ? () => {
              if (!isUsingProdDevtools && isStaffMember(identityData))
                  setVersionClickedTimes(t => {
                      if (t < 7) return t + 1
                      Alert.alert(
                          'Enable Developer Mode',
                          'Are you sure?',
                          [
                              {
                                  text: 'Enable',
                                  style: 'destructive',
                                  onPress: () => {
                                      setIsUsingProdDevtools(client, true)
                                  },
                              },
                              {
                                  text: 'Cancel',
                                  style: 'cancel',
                                  onPress: () => {},
                              },
                          ],
                          { cancelable: false },
                      )
                      return 0
                  })
          }
        : () => {}

    const rightChevronIcon = <RightChevron />

    const signInListItems = [
        ...(canAccess
            ? [
                  {
                      key: 'Subscription details',
                      title: 'Subscription details',
                      onPress: () => {
                          navigation.navigate(routeNames.SubscriptionDetails)
                      },
                  },
              ]
            : [
                  {
                      key: `I'm already subscribed`,
                      title: `I'm already subscribed`,
                      onPress: () => {
                          navigation.navigate(routeNames.AlreadySubscribed)
                      },

                      proxy: rightChevronIcon,
                  },
              ]),
    ]

    return (
        <WithAppAppearance value={'settings'}>
            <ScrollContainer>
                <SignInButton
                    navigation={navigation}
                    username={
                        identityData
                            ? identityData.userDetails.primaryEmailAddress
                            : undefined
                    }
                    signOutIdentity={signOutIdentity}
                />
                <List data={signInListItems} />
                <Heading>{``}</Heading>
                <MiscSettingsList
                    client={client}
                    isWeatherShown={isWeatherShown}
                    navigation={navigation}
                />
                <Heading>{``}</Heading>
                <List
                    data={[
                        {
                            key: 'Privacy settings',
                            title: 'Privacy settings',
                            proxy: rightChevronIcon,
                            onPress: () => {
                                navigation.navigate(routeNames.GdprConsent)
                            },
                        },
                        {
                            key: 'Privacy policy',
                            title: 'Privacy policy',
                            proxy: rightChevronIcon,
                            onPress: () => {
                                navigation.navigate(routeNames.PrivacyPolicy)
                            },
                        },
                        {
                            key: 'Terms and conditions',
                            title: 'Terms and conditions',
                            onPress: () => {
                                navigation.navigate(
                                    routeNames.TermsAndConditions,
                                )
                            },
                            proxy: rightChevronIcon,
                        },
                    ]}
                />
                <Heading>{``}</Heading>
                <List
                    data={[
                        {
                            key: 'Help',
                            title: 'Help',
                            onPress: () => {
                                navigation.navigate(routeNames.Help)
                            },
                            proxy: rightChevronIcon,
                        },
                        {
                            key: 'Credits',
                            title: 'Credits',
                            onPress: () => {
                                navigation.navigate(routeNames.Credits)
                            },
                            proxy: rightChevronIcon,
                        },
                        {
                            key: 'Version',
                            title: 'Version',
                            onPress: versionClickHandler,
                            proxy: <Text>{versionNumber}</Text>,
                        },
                    ]}
                />
                {isUsingProdDevtools && <DevZone />}
            </ScrollContainer>
        </WithAppAppearance>
    )
}

SettingsScreen.navigationOptions = {
    title: 'Settings',
    showHeaderLeft: false,
    showHeaderRight: true,
}

export { SettingsScreen }
