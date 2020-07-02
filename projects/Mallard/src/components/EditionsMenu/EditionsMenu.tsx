import React from 'react'
import { FlatList, ScrollView } from 'react-native'
import { RegionalEdition, SpecialEdition, Edition } from 'src/common'
import { defaultRegionalEditions } from '../../../../Apps/common/src/editions-defaults'
import { EditionsMenuHeader } from './Header/Header'
import { ItemSeperator } from './ItemSeperator/ItemSeperator'
import { RegionButton } from './RegionButton/RegionButton'
import { SpecialEditionButton } from './SpecialEditionButton/SpecialEditionButton'

const EditionsMenu = ({
    navigationPress,
    regionalEditions,
    selectedEdition,
    specialEditions,
    storeSelectedEdition,
}: {
    navigationPress: () => void
    regionalEditions?: RegionalEdition[]
    selectedEdition: Edition
    specialEditions?: SpecialEdition[]
    storeSelectedEdition: (edition: Edition) => void
}) => {
    return (
        <ScrollView>
            <EditionsMenuHeader>Regions</EditionsMenuHeader>
            <FlatList
                data={regionalEditions || defaultRegionalEditions}
                renderItem={({ item }: { item: RegionalEdition }) => {
                    return (
                        <RegionButton
                            selected={
                                selectedEdition === item.edition ? true : false
                            }
                            onPress={() => {
                                storeSelectedEdition(item.edition)
                                navigationPress()
                            }}
                            title={item.title}
                            subTitle={item.subTitle}
                        />
                    )
                }}
                ItemSeparatorComponent={() => <ItemSeperator />}
            />
            {specialEditions && specialEditions.length > 0 && (
                <>
                    <EditionsMenuHeader>Special Editions</EditionsMenuHeader>
                    <FlatList
                        data={specialEditions}
                        renderItem={({ item }: { item: SpecialEdition }) => {
                            const {
                                buttonStyle,
                                devUri,
                                edition,
                                expiry,
                                image,
                                title,
                                subTitle,
                            } = item
                            return (
                                <SpecialEditionButton
                                    devUri={devUri}
                                    expiry={expiry}
                                    image={image}
                                    onPress={() => {
                                        storeSelectedEdition(edition)
                                        navigationPress()
                                    }}
                                    title={title}
                                    selected={
                                        selectedEdition === edition
                                            ? true
                                            : false
                                    }
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
