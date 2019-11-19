import React, { useContext, useState } from 'react'
import { Alert, StyleSheet, Text, Switch } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
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

const MiscSettingsList = React.memo(
    (props: { isWeatherShown: boolean; client: ApolloClient<object> }) => {
        const onChange = () =>
            setIsWeatherShown(props.client, !props.isWeatherShown)
        const items = [
            {
                key: 'isWeatherShown',
                title: 'Display Weather',
                data: { onPress: onChange },
                proxy: (
                    <Switch
                        value={props.isWeatherShown}
                        onValueChange={onChange}
                    />
                ),
            },
        ]
        return <List onPress={({ onPress }) => onPress()} data={items} />
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
                      title: identityData.userDetails.publicFields.displayName,
                      data: {
                          onPress: async () => {
                              await signOutIdentity()
                          },
                      },
                      proxy: <Text style={styles.signOut}>Sign out</Text>,
                  },
              ]
            : [
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
              ]),
        ...(canAccess
            ? [
                  {
                      key: 'Subscription details',
                      title: 'Subscription details',
                      data: {
                          onPress: () => {
                              navigation.navigate(
                                  routeNames.SubscriptionDetails,
                              )
                          },
                      },
                  },
              ]
            : [
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
              ]),
    ]

    return (
        <WithAppAppearance value={'settings'}>
            <ScrollContainer>
                <List
                    onPress={({ onPress }) => onPress()}
                    data={signInListItems}
                />
                <Heading>{``}</Heading>
                <MiscSettingsList
                    client={client}
                    isWeatherShown={isWeatherShown}
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
                                onPress: versionClickHandler,
                            },
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
