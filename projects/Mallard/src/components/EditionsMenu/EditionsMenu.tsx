import React from 'react'
import { FlatList, ScrollView } from 'react-native'
import { EditionsMenuHeader } from './Header/Header'
import { RegionButton } from './RegionButton/RegionButton'
import { SpecialEditionButton } from './SpecialEditionButton/SpecialEditionButton'
import { editions } from 'src/helpers/settings/defaults'
import {
    Edition,
    RegionalEdition,
    SpecialEdition,
} from '../../../../Apps/common/src'
import { ItemSeperator } from './ItemSeperator/ItemSeperator'

const defaultRegionalEditions: RegionalEdition[] = [
    {
        title: 'The Daily',
        subTitle: 'Published every day by 6am (GMT)',
        edition: editions.daily as Edition,
    },
    {
        title: 'Australia Weekend',
        subTitle: 'Published every Saturday by 6am (AEST)',
        edition: editions.ausWeekly as Edition,
    },
    {
        title: 'US Weekend',
        subTitle: 'Published every Saturday by 6am (EST)',
        edition: editions.usWeekly as Edition,
    },
]

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
