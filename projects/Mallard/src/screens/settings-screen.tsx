import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { List } from '../components/lists/list'
import { NavigationScreenProp } from 'react-navigation'
import { container } from '../theme/styles'

const styles = StyleSheet.create({
    container,
})

const SettingsScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    return (
        <ScrollView style={styles.container}>
            <List
                onPress={({ key }) => navigation.navigate(key)}
                data={[
                    {
                        key: 'Downloads',
                        title: 'Manage issues',
                    },
                    {
                        key: 'Endpoints',
                        title: 'API Endpoint',
                    },
                ]}
            />
        </ScrollView>
    )
}
SettingsScreen.navigationOptions = {
    title: 'Settings',
}

export { SettingsScreen }
