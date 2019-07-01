import React from 'react'
import { FlatList, SafeAreaView, View, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { UiBodyCopy } from '../styled-text'
import { Separator, TappableRow } from 'src/components/layout/list/row'
/*
An item is what the list uses to draw its own row –
See https://facebook.github.io/react-native/docs/using-a-listview
*/
export interface Item<D> {
    key: string
    title: string
    explainer?: string
    data?: D
}

/*
<D> inside of an item is passed to the click handler.
This is the function that gets called when clicking a row.
D contains things like the route a row points or the text content of it
*/
export type OnPressHandler<D> = (item: D) => void

const styles = StyleSheet.create({
    heading: {
        padding: metrics.horizontal,
        paddingTop: metrics.vertical * 2,
        paddingBottom: metrics.vertical / 2,
    },
    item: {
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
        marginVertical: StyleSheet.hairlineWidth,
    },
})

export const List = <D extends {}>({
    data,
    onPress,
}: {
    data: Item<D>[]
    onPress: OnPressHandler<D>
}) => {
    return (
        <FlatList
            ItemSeparatorComponent={Separator}
            ListFooterComponent={Separator}
            ListHeaderComponent={Separator}
            data={data}
            renderItem={({ item }) => (
                <TappableRow
                    onPress={() => {
                        if (item.data) onPress(item.data)
                    }}
                    {...item}
                ></TappableRow>
            )}
        />
    )
}
