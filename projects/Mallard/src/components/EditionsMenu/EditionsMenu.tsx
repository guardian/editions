import React from 'react'
import { FlatList, ScrollView } from 'react-native'
import { EditionsMenuHeader } from './Header/Header'
import { RegionButton } from './RegionButton/RegionButton'
import { SpecialEditionButton } from './SpecialEditionButton/SpecialEditionButton'
import { RegionalEdition, SpecialEdition } from '../../../../Apps/common/src'
import { defaultRegionalEditions } from '../../../../Apps/common/src/editions-defaults'
import { ItemSeperator } from './ItemSeperator/ItemSeperator'
import { NavigationScreenProp } from 'react-navigation'
import { useApolloClient } from '@apollo/react-hooks'
import { setEdition } from 'src/helpers/settings/setters'
import { routeNames } from 'src/navigation/routes'
import { useEdition } from 'src/hooks/use-settings'

const EditionsMenu = ({
    navigation,
    regionalEdtions,
    specialEditions,
}: {
    navigation: NavigationScreenProp<{}>
    regionalEdtions?: RegionalEdition[]
    specialEditions?: SpecialEdition[]
}) => {
    const client = useApolloClient()
    const selectedEdition = useEdition()

    return (
        <ScrollView>
            <EditionsMenuHeader>Regions</EditionsMenuHeader>
            <FlatList
                data={regionalEdtions || defaultRegionalEditions}
                renderItem={({ item }: { item: RegionalEdition }) => {
                    return (
                        <RegionButton
                            selected={
                                selectedEdition === item.edition ? true : false
                            }
                            onPress={() => {
                                setEdition(client, item.edition)
                                navigation.navigate(routeNames.Issue)
                            }}
                            title={item.title}
                            subTitle={item.subTitle}
                        />
                    )
                }}
                ItemSeparatorComponent={() => <ItemSeperator />}
            />
            {specialEditions && (
                <>
                    <EditionsMenuHeader>Special Editions</EditionsMenuHeader>
                    <FlatList
                        data={specialEditions}
                        renderItem={({
                            item: {
                                buttonStyle,
                                devUri,
                                edition,
                                expiry,
                                image,
                                title,
                                subTitle,
                            },
                        }: {
                            item: SpecialEdition
                        }) => {
                            return (
                                <SpecialEditionButton
                                    devUri={devUri}
                                    expiry={expiry}
                                    image={image}
                                    onPress={() => {
                                        setEdition(client, edition)
                                        navigation.navigate(routeNames.Issue)
                                    }}
                                    title={title}
                                    style={buttonStyle}
                                    subTitle={subTitle}
                                />
                            )
                        }}
                    />
                </>
            )}
        </ScrollView>
    )
}

export { EditionsMenu }
