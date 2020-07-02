import React from 'react'
import { StyleSheet } from 'react-native'
import { NavigationScreenProp } from 'react-navigation'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { Heading } from 'src/components/layout/ui/row'
import { List } from 'src/components/lists/list'
import { useEditions } from 'src/hooks/use-edition-provider'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'

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
    const { editionsList, storeSelectedEdition } = useEditions()

    const consolidatedEditions = [
        ...editionsList.regionalEditions,
        ...editionsList.specialEditions,
    ]

    return (
        <ScrollContainer>
            <Heading>Presets</Heading>
            <List
                data={consolidatedEditions.map(edition => ({
                    title: edition.title,
                    key: edition.title,
                    data: consolidatedEditions,
                    onPress: () => {
                        storeSelectedEdition(edition, 'TrainingEdition')
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
