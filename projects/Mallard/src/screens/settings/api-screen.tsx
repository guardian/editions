import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { List, ListHeading } from '../../components/lists/list'
import { MonoTextBlock } from '../../components/styled-text'
import { container } from '../../theme/styles'
import { useStateValue } from '../../helpers/state'

const styles = StyleSheet.create({
    container,
})

const ApiState = () => {
    const [{ apiUrl }] = useStateValue()
    return <MonoTextBlock>API backend pointing to {apiUrl}</MonoTextBlock>
}

const ApiScreen = () => {
    const [{}, setSetting] = useStateValue()
    return (
        <ScrollView style={styles.container}>
            <ListHeading>Select a backend</ListHeading>
            <List
                onPress={({ value }) => {
                    setSetting('apiUrl', value)
                }}
                data={[
                    {
                        key: 'live',
                        title: 'Live backend',
                        value: 'https://editions-api.gutools.co.uk',
                    },
                    {
                        key: 'local',
                        title: 'Localhost',
                        value: 'https://localhost:9001',
                    },
                ]}
            />
            <ApiState />
        </ScrollView>
    )
}
ApiScreen.navigationOptions = {
    title: 'API Endpoint',
}

export { ApiScreen, ApiState }
