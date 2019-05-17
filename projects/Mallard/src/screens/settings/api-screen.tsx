import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { List, ListHeading } from '../../components/lists/list'
import { MonoTextBlock } from '../../components/styled-text'
import { container } from '../../theme/styles'
import { useSettings } from '../../hooks/use-settings'
import { NavigationScreenProp } from 'react-navigation'

const styles = StyleSheet.create({
    container,
})

const ApiState = () => {
    const [{ apiUrl }] = useSettings()
    return <MonoTextBlock>API backend pointing to {apiUrl}</MonoTextBlock>
}

const ApiScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const [{ apiUrl }, setSetting] = useSettings()

    const backends = [
        { title: 'Live backend', value: 'https://editions-api.gutools.co.uk' },
        { title: 'Localhost', value: 'https://localhost:3131' },
        {
            title: 'Lauras funhouse',
            value:
                'https://s3.amazonaws.com/lauras-funhouse/download.json#yaddayadda#',
        },
    ]
    return (
        <ScrollView style={styles.container}>
            <ListHeading>Select a backend</ListHeading>
            <List
                onPress={({ value }) => {
                    setSetting('apiUrl', value)
                    navigation.goBack()
                }}
                data={backends.map(({ title, value }) => ({
                    title: (apiUrl === value ? '✅ ' : '') + title,
                    explainer: value,
                    key: value,
                    data: { value },
                }))}
            />
        </ScrollView>
    )
}
ApiScreen.navigationOptions = {
    title: 'API Endpoint',
}

export { ApiScreen, ApiState }
