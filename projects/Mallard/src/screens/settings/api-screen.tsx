import React from 'react'
import { StyleSheet } from 'react-native'

import { List } from 'src/components/lists/list'
import { UiBodyCopy } from 'src/components/styled-text'
import { useSettings } from 'src/hooks/use-settings'
import { NavigationScreenProp } from 'react-navigation'
import { TextInput } from 'react-native-gesture-handler'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { backends, defaultSettings } from 'src/helpers/settings/defaults'
import { Heading, Footer } from 'src/components/layout/ui/row'
import { ScrollContainer } from 'src/components/layout/ui/container'

const ApiState = () => {
    const [{ apiUrl }] = useSettings()
    if (apiUrl === defaultSettings.apiUrl) return null
    return (
        <Footer>
            <UiBodyCopy>
                {`API backend pointing to ${apiUrl}. This is not PROD!`}
            </UiBodyCopy>
        </Footer>
    )
}

const ApiScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const [{ apiUrl }, setSetting] = useSettings()

    return (
        <ScrollContainer>
            <Heading>Selected backend</Heading>
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
            <Heading>Presets</Heading>
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
        </ScrollContainer>
    )
}
ApiScreen.navigationOptions = {
    title: 'API Endpoint',
}

export { ApiScreen, ApiState }
