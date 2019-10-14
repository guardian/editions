import React, { ReactElement } from 'react'
import { FlatList, FlatListProps } from 'react-native'
import { Separator, Row } from 'src/components/layout/ui/row'
/*
An item is what the list uses to draw its own row –
See https://facebook.github.io/react-native/docs/using-a-listview
*/
export interface Item<D> {
    key: string
    title: string
    explainer?: string
    proxy?: ReactElement
    data?: D
    linkWeight?: 'bold' | 'regular'
}

/*
<D> inside of an item is passed to the click handler.
This is the function that gets called when clicking a row.
D contains things like the route a row points or the text content of it
*/
export type OnPressHandler<D> = (item: D) => void

export const BaseList = <I extends {}>({
    ...flatListProps
}: FlatListProps<I>) => {
    return (
        <FlatList
            ItemSeparatorComponent={Separator}
            ListFooterComponent={Separator}
            ListHeaderComponent={Separator}
            {...flatListProps}
        />
    )
}

export const List = <D extends {}>({
    data,
    onPress,
}: {
    data: Item<D>[]
    onPress: OnPressHandler<D>
}) => {
    return (
        <BaseList
            data={data}
            renderItem={({ item }) => (
                <Row
                    proxy={item.proxy}
                    onPress={() => {
                        if (item.data) onPress(item.data)
                    }}
                    {...item}
                ></Row>
            )}
        />
    )
}
