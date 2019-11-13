import React from 'react'
import { Alert } from 'react-native'
import { List } from 'src/components/lists/list'
import { deleteIssueFiles } from 'src/helpers/files'
import { WithAppAppearance } from 'src/theme/appearance'

const ManageEditionsScreen = () => {
    return (
        <WithAppAppearance value="settings">
            <List
                onPress={({ onPress }) => onPress()}
                data={[
                    {
                        key: 'Delete all downloads',
                        title: 'Delete all downloads',
                        explainer:
                            'All downloaded editions will be deleted from your device but will still be available to download',
                        data: {
                            onPress: () => {
                                Alert.alert(
                                    'Are you sure you want to delete all downloads?',
                                    'You wil still be able to access them and download them again',
                                    [
                                        {
                                            text: 'Ok',
                                            style: 'destructive',
                                            onPress: deleteIssueFiles,
                                        },
                                        { text: 'Cancel', style: 'cancel' },
                                    ],
                                    { cancelable: false },
                                )
                            },
                        },
                    },
                ]}
            />
        </WithAppAppearance>
    )
}

ManageEditionsScreen.navigationOptions = {
    title: 'Manage editions',
}

export { ManageEditionsScreen }
