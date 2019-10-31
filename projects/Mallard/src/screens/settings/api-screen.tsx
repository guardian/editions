import React from 'react'
import { StyleSheet } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { NavigationScreenProp } from 'react-navigation'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { Footer, Heading } from 'src/components/layout/ui/row'
import { List } from 'src/components/lists/list'
import { UiBodyCopy } from 'src/components/styled-text'
import { backends, defaultSettings } from 'src/helpers/settings/defaults'
import { useApiUrl } from 'src/hooks/use-settings'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { setApiUrl } from 'src/helpers/settings/setters'
import { useApolloClient } from '@apollo/react-hooks'

const ApiState = () => {
    const apiUrl = useApiUrl()
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
    const client = useApolloClient()
    const apiUrl = useApiUrl()

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
                        setApiUrl(client, value)
                    }
                }}
                value={apiUrl || ''}
            />
            <Heading>Presets</Heading>
            <List
                onPress={({ value }) => {
                    setApiUrl(client, value)
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
