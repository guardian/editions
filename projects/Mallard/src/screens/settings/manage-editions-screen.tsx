import { useQuery } from '@apollo/react-hooks'
import gql from 'graphql-tag'
import React from 'react'
import { Alert, Switch, TouchableOpacity, View, StyleSheet } from 'react-native'
import { List } from 'src/components/lists/list'
import { UiBodyCopy } from 'src/components/styled-text'
import {
    setMaxAvailableEditions,
    setWifiOnlyDownloads,
} from 'src/helpers/settings/setters'
import { WithAppAppearance } from 'src/theme/appearance'
import { getIssueSummary } from 'src/hooks/use-issue-summary'
import { sendComponentEvent, ComponentType, Action } from 'src/services/ophan'
import { MANAGE_EDITIONS_TITLE } from 'src/helpers/words'
import { deleteIssueFiles } from 'src/download-edition/clear-issues'

const buttonStyles = StyleSheet.create({
    background: {
        borderWidth: 1,
        borderRadius: 3,
        flex: 1,
        marginHorizontal: 5,
        padding: 10,
        alignItems: 'center',
    },
})

const MultiButton = ({
    children,
    onPress,
    selected,
}: {
    children: string
    onPress: () => void
    selected?: boolean
}) => (
    <TouchableOpacity
        style={{ flex: 1 }}
        accessibilityRole="button"
        onPress={onPress}
    >
        <View
            style={[
                buttonStyles.background,
                {
                    backgroundColor: selected ? '#0077b3' : 'transparent',
                    borderColor: selected ? 'transparent' : '#999',
                },
            ]}
        >
            <UiBodyCopy
                weight="bold"
                style={{ color: selected ? 'white' : 'black' }}
            >
                {children}
            </UiBodyCopy>
        </View>
    </TouchableOpacity>
)

const AvailableEditionsButtons = ({
    numbers,
    isSelected,
    onPress,
}: {
    numbers: number[]
    isSelected: (n: number) => boolean
    onPress: (n: number) => void
}) => (
    <View
        style={{
            display: 'flex',
            flexDirection: 'row',
            marginHorizontal: -5,
            paddingTop: 10,
        }}
    >
        {numbers.map(number => (
            <MultiButton
                key={number}
                selected={isSelected(number)}
                onPress={() => onPress(number)}
            >
                {`${number} days`}
            </MultiButton>
        ))}
    </View>
)

const ManageEditionsScreen = () => {
    const { client, data, loading } = useQuery(gql`
        {
            wifiOnlyDownloads @client
            maxAvailableEditions @client
        }
    `)

    return (
        <WithAppAppearance value="settings">
            <List
                data={[
                    ...(loading
                        ? []
                        : [
                              {
                                  key: 'Wifi-only',
                                  title: 'Wifi-only',
                                  explainer:
                                      'Editions will only be downloaded when wi-fi is available',
                                  proxy: (
                                      <Switch
                                          accessible={true}
                                          accessibilityLabel="Switch button"
                                          accessibilityHint="Double tap to toggle setting"
                                          accessibilityRole="switch"
                                          value={data.wifiOnlyDownloads}
                                          onValueChange={val => {
                                              setWifiOnlyDownloads(client, val)
                                              sendComponentEvent({
                                                  componentType:
                                                      ComponentType.appButton,
                                                  action: Action.click,
                                                  componentId:
                                                      'manageEditionsWifiDownload',
                                                  value: val.toString(),
                                              })
                                          }}
                                      />
                                  ),
                              },
                              {
                                  key: 'Available editions',
                                  title: 'Available editions',
                                  explainer: (
                                      <AvailableEditionsButtons
                                          numbers={[7, 14, 30]}
                                          isSelected={n =>
                                              n === data.maxAvailableEditions
                                          }
                                          onPress={async n => {
                                              await setMaxAvailableEditions(
                                                  client,
                                                  n,
                                              )
                                              getIssueSummary(false)
                                              sendComponentEvent({
                                                  componentType:
                                                      ComponentType.appButton,
                                                  action: Action.click,
                                                  componentId:
                                                      'manageEditionsAvailableEditions',
                                                  value: n.toString(),
                                              })
                                          }}
                                      />
                                  ),
                              },
                          ]),
                    {
                        key: 'Delete all downloads',
                        title: 'Delete all downloads',
                        explainer:
                            'All downloaded editions will be deleted from your device but will still be available to download',
                        onPress: () => {
                            Alert.alert(
                                'Are you sure you want to delete all downloads?',
                                'You will still be able to access them and download them again',
                                [
                                    {
                                        text: 'Delete',
                                        style: 'destructive',
                                        onPress: deleteIssueFiles,
                                    },
                                    { text: 'Cancel', style: 'cancel' },
                                ],
                                { cancelable: false },
                            )
                            sendComponentEvent({
                                componentType: ComponentType.appButton,
                                action: Action.click,
                                value: 'deleteAllDownload',
                                componentId: 'manageEditions',
                            })
                        },
                    },
                ]}
            />
        </WithAppAppearance>
    )
}

const ManageEditionScreenFromIssuePicker = () => <ManageEditionsScreen />

ManageEditionsScreen.navigationOptions = {
    title: MANAGE_EDITIONS_TITLE,
}

ManageEditionScreenFromIssuePicker.navigationOptions = {
    title: MANAGE_EDITIONS_TITLE,
    showHeaderLeft: false,
    showHeaderRight: true,
}

export { ManageEditionsScreen, ManageEditionScreenFromIssuePicker }
