import AsyncStorage from '@react-native-community/async-storage'
import React, { useContext, useState } from 'react'
import { Alert, StyleSheet, Text, Button } from 'react-native'
import { NavigationInjectedProps } from 'react-navigation'
import { RightChevron } from 'src/components/icons/RightChevron'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { Heading } from 'src/components/layout/ui/row'
import { List } from 'src/components/lists/list'
import { clearCache } from 'src/helpers/fetch/cache'
import { getVersionInfo } from 'src/helpers/settings'
import { useSettings, useSettingsValue } from 'src/hooks/use-settings'
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

const SettingsScreen = ({ navigation }: NavigationInjectedProps) => {
    const setSetting = useSettings()
    const isUsingProdDevtools = useSettingsValue.isUsingProdDevtools()
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

    const versionClickHandler = identityData
        ? () => {
              if (!isUsingProdDevtools && isStaffMember(identityData))
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
                                      setSetting('isUsingProdDevtools', true)
                                      Alert.alert('You are a developer now!')
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
                      proxy: <Text style={styles.signOut}>Sign Out</Text>,
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
            ? []
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
                                onPress: versionClickHandler,
                            },
                            proxy: <Text>{getVersionInfo().version}</Text>,
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
