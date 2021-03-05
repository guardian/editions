import { useNavigation } from '@react-navigation/native'
import React from 'react'
import { ScrollContainer } from 'src/components/layout/ui/container'
import { Heading } from 'src/components/layout/ui/row'
import { List } from 'src/components/lists/list'
import { useEditions } from 'src/hooks/use-edition-provider'

const EditionsScreen = () => {
    const navigation = useNavigation()
    const { editionsList, storeSelectedEdition } = useEditions()

    const consolidatedEditions = [
        ...editionsList.regionalEditions,
        ...editionsList.specialEditions,
    ]

    return (
        <ScrollContainer>
            <Heading>Presets</Heading>
            <List
                data={consolidatedEditions.map((edition) => ({
                    title: edition.title,
                    key: edition.title,
                    data: consolidatedEditions,
                    onPress: () => {
                        storeSelectedEdition(edition)
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
