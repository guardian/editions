import React from 'react'
import { StyleSheet } from 'react-native'
import { TextInput } from 'react-native-gesture-handler'
import { NavigationScreenProp } from 'react-navigation'
import { useApolloClient } from '@apollo/react-hooks'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { Heading } from 'src/components/layout/ui/row'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { setEdition } from 'src/helpers/settings/setters'
import { List } from 'src/components/lists/list'
import { editions } from 'src/helpers/settings/defaults'
import { useEdition } from 'src/hooks/use-settings'

const styles = StyleSheet.create({
    textInputStyle: {
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical * 2,
        backgroundColor: color.background,
        borderBottomColor: color.line,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
})

const EditionsScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}>
}) => {
    const client = useApolloClient()
    const edition = useEdition()

    return (
        <ScrollContainer>
            <Heading>Selected edition</Heading>
            <TextInput
                style={styles.textInputStyle}
                onChangeText={value => {
                    if (value) {
                        setEdition(client, value)
                    }
                }}
                value={edition || ''}
            />
            <Heading>Presets</Heading>
            <List
                data={Object.values(editions).map(editionSlug => ({
                    title: editionSlug,
                    key: editionSlug,
                    data: { editionSlug },
                    onPress: () => {
                        setEdition(client, editionSlug)
                        navigation.goBack()
                    },
                }))}
            />
        </ScrollContainer>
    )
}
EditionsScreen.navigationOptions = {
    title: 'Edition',
}

export { EditionsScreen }
