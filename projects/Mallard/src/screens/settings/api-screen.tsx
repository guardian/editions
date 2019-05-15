import React, { useEffect, useState } from 'react'
import { ScrollView, StyleSheet } from 'react-native'
import AsyncStorage from '@react-native-community/async-storage'

import { List } from '../../components/list'
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

export { ApiScreen, ApiState }
