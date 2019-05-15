import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { List } from '../components/list'
import { MonoTextBlock } from '../components/styled-text'
import { NavigationScreenProp } from 'react-navigation'
import { container } from '../theme/styles'
import { ApiState } from './settings/api-screen'
const styles = StyleSheet.create({
    container,
})

const SettingsScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const issue = navigation.getParam('issue', 'NO-ID')

    return (
        <ScrollView style={styles.container}>
            <ApiState />
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

export { SettingsScreen }
