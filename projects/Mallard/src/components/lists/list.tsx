import React from 'react'
import { FlatList, SafeAreaView, View, StyleSheet } from 'react-native'
import { metrics } from '../../theme/spacing'
import { UiBodyCopy, UiExplainerCopy } from '../styled-text'
import { useAppAppearance } from '../../theme/appearance'
import { Highlight } from '../highlight'

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
    list: {
        borderTopWidth: StyleSheet.hairlineWidth,
    },
})

export const ListHeading = ({ children }: { children: string }) => (
    <View style={styles.heading}>
        <SafeAreaView>
            <UiBodyCopy style={{ fontWeight: '700' }}>{children}</UiBodyCopy>
        </SafeAreaView>
    </View>
)

const ListItem = <D extends {}>({
    onPress,
    item: { title, explainer, data },
}: {
    item: Item<D>
    onPress: OnPressHandler<D>
}) => {
    const { borderColor, backgroundColor } = useAppAppearance()

    return (
        <>
            <Highlight
                onPress={() => {
                    if (data) onPress(data)
                }}
            >
                <View
                    style={[
                        styles.item,
                        {
                            backgroundColor,
                        },
                    ]}
                >
                    <UiBodyCopy>{title}</UiBodyCopy>
                    {explainer && (
                        <UiExplainerCopy
                            style={{ marginTop: metrics.vertical / 8 }}
                        >
                            {explainer}
                        </UiExplainerCopy>
                    )}
                </View>
            </Highlight>
            <View
                style={{
                    height: StyleSheet.hairlineWidth,
                    backgroundColor: borderColor,
                }}
            />
        </>
    )
}

export const List = <D extends {}>({
    data,
    onPress,
}: {
    data: Item<D>[]
    onPress: OnPressHandler<D>
}) => {
    const { borderColor } = useAppAppearance()
    return (
        <FlatList
            style={[
                styles.list,
                {
                    borderColor,
                },
            ]}
            data={data}
            renderItem={({ item }) => (
                <ListItem onPress={onPress} item={item} />
            )}
        />
    )
}
