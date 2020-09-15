import React from 'react'
import { FlatList, ScrollView } from 'react-native'
import { EditionId, RegionalEdition, SpecialEdition } from 'src/common'
import { StoreSelectedEditionFunc } from 'src/hooks/use-edition-provider'
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
    selectedEdition: EditionId
    specialEditions?: SpecialEdition[]
    storeSelectedEdition: StoreSelectedEditionFunc
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
                                storeSelectedEdition(item, 'RegionalEdition')
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
                                buttonImageUri,
                                edition,
                                expiry,
                                title,
                                subTitle,
                            } = item
                            return (
                                <SpecialEditionButton
                                    buttonImageUri={buttonImageUri}
                                    expiry={expiry}
                                    onPress={() => {
                                        storeSelectedEdition(
                                            item,
                                            'SpecialEdition',
                                        )
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
