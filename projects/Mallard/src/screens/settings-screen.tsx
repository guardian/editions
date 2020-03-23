import React, { useContext, useState } from 'react'
import { Alert, StyleSheet, Text, Switch } from 'react-native'
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
import { color } from 'src/theme/color'
import { getFont } from 'src/theme/typography'
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

const SettingsScreen = ({ navigation }: NavigationInjectedProps) => {
    const query = useQuery<QueryData>(QUERY)
    const identityData = useIdentity()
    const canAccess = useAccess()
    const [, setVersionClickedTimes] = useState(0)
    const { signOutIdentity } = useContext(AccessContext)
    const styles = StyleSheet.create({
        signOut: {
            color: color.ui.supportBlue,
            ...getFont('sans', 1),
        },
    })

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
        ...(identityData
            ? [
                  {
                      key: `Sign out`,
                      title: identityData.userDetails.primaryEmailAddress,
                      onPress: async () => {
                          await signOutIdentity()
                      },
                      proxy: <Text style={styles.signOut}>Sign out</Text>,
                  },
              ]
            : [
                  {
                      key: `Sign in`,
                      title: `Sign in`,
                      onPress: () => {
                          navigation.navigate(routeNames.SignIn)
                      },
                      proxy: rightChevronIcon,
                  },
              ]),
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
