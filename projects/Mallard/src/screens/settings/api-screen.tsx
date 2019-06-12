import React from 'react'
import { ScrollView, StyleSheet } from 'react-native'

import { List, ListHeading } from '../../components/lists/list'
import { MonoTextBlock } from '../../components/styled-text'
import { container } from '../../theme/styles'
import { useSettings } from '../../hooks/use-settings'
import { NavigationScreenProp } from 'react-navigation'
import { TextInput } from 'react-native-gesture-handler'
import { color } from '../../theme/color'
import { metrics } from '../../theme/spacing'

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
            value: 'https://s3.amazonaws.com/lauras-funhouse/download.json?q=',
        },
    ]
    return (
        <ScrollView style={styles.container}>
            <ListHeading>Selected backend</ListHeading>
            <TextInput
                style={{
                    padding: metrics.horizontal,
                    paddingVertical: metrics.vertical * 2,
                    backgroundColor: color.background,
                    borderBottomColor: color.line,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                }}
                onChangeText={value => {
                    if (value) {
                        setSetting('apiUrl', value)
                    }
                }}
                value={apiUrl || ''}
            />
            <ListHeading>Presets</ListHeading>
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
