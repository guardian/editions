import React from 'react'
import { FlatList, ScrollView } from 'react-native'
import { EditionsMenuHeader } from './Header/Header'
import { RegionButton } from './RegionButton/RegionButton'
import { SpecialEditionButton } from './SpecialEditionButton/SpecialEditionButton'
import { RegionalEdition, SpecialEdition } from '../../../../Apps/common/src'
import { defaultRegionalEditions } from '../../../../Apps/common/src/editions-defaults'
import { ItemSeperator } from './ItemSeperator/ItemSeperator'

const EditionsMenu = ({
    regionalEdtions,
    specialEditions,
}: {
    regionalEdtions?: RegionalEdition[]
    specialEditions?: SpecialEdition[]
}) => (
    <ScrollView>
        <EditionsMenuHeader>Regions</EditionsMenuHeader>
        <FlatList
            data={regionalEdtions || defaultRegionalEditions}
            renderItem={({ item }: { item: RegionalEdition }) => {
                return (
                    <RegionButton
                        onPress={() => {}}
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
                        item: { devUri, expiry, image, title, style, subTitle },
                    }: {
                        item: SpecialEdition
                    }) => {
                        return (
                            <SpecialEditionButton
                                devUri={devUri}
                                expiry={expiry}
                                image={image}
                                onPress={() => {}}
                                title={title}
                                style={style}
                                subTitle={subTitle}
                            />
                        )
                    }}
                />
            </>
        )}
    </ScrollView>
)

export { EditionsMenu }
