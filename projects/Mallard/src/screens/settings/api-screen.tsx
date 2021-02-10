import React from 'react'
import { StyleSheet } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
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
import { HeaderScreenContainer } from 'src/components/Header/Header'
import { useNavigation } from '@react-navigation/native'
import { ENDPOINTS_HEADER_TITLE } from 'src/helpers/words'

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

const ApiScreen = () => {
    const client = useApolloClient()
    const apiUrl = useApiUrl()
    const navigation = useNavigation()

    return (
        <HeaderScreenContainer title={ENDPOINTS_HEADER_TITLE} actionLeft={true}>
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
                    data={backends.map(({ title, value }) => ({
                        title: (apiUrl === value ? '✅ ' : '') + title,
                        explainer: value,
                        key: value,
                        onPress: () => {
                            setApiUrl(client, value)
                            navigation.goBack()
                        },
                    }))}
                />
            </ScrollContainer>
        </HeaderScreenContainer>
    )
}
export { ApiScreen, ApiState }
