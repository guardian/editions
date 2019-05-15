import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { List } from '../components/lists/list'
import { NavigationScreenProp } from 'react-navigation'
import { container } from '../theme/styles'
import { useSettings } from '../hooks/use-settings'

const styles = StyleSheet.create({
    container,
})

const SettingsScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const [{ apiUrl }] = useSettings()
    return (
        <ScrollView style={styles.container}>
            <List
                onPress={({ to }) => navigation.navigate(to)}
                data={[
                    {
                        key: 'Downloads',
                        title: 'Manage issues',
                        data: { to: 'Downloads' },
                    },
                    {
                        key: 'Endpoints',
                        title: 'API Endpoint',
                        explainer: apiUrl,
                        data: { to: 'Endpoints' },
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
