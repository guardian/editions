import React from 'react'
import {
    Platform,
    FlatList,
    TouchableHighlight,
    TouchableNativeFeedback,
    SafeAreaView,
    View,
    Text,
    StyleSheet,
} from 'react-native'
import { metrics } from '../../theme/spacing'
import { PropTypes, Item, OnPressHandler } from './helpers'
import { UiBodyCopy, UiExplainerCopy } from '../styled-text'
import { useAppAppearance } from '../../theme/appearance'

const styles = StyleSheet.create({
    heading: {
        padding: metrics.horizontal,
        paddingTop: metrics.vertical * 2,
        paddingBottom: metrics.vertical / 2,
    },
    item: {
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
        borderTopWidth: 0,
        borderBottomWidth: StyleSheet.hairlineWidth,
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

const Highlight =
    Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight

const ListItem = <ItemData extends {}>({
    onPress,
    item: { title, explainer, data },
}: {
    item: Item<ItemData>
    onPress: OnPressHandler<ItemData>
}) => {
    const { borderColor, backgroundColor } = useAppAppearance()

    return (
        <Highlight
            onPress={() => {
                if (data) onPress(data)
            }}
        >
            <View
                style={[
                    styles.item,
                    {
                        borderColor,
                        backgroundColor,
                    },
                ]}
            >
                <SafeAreaView>
                    <UiBodyCopy>{title}</UiBodyCopy>
                    {explainer && (
                        <UiExplainerCopy
                            style={{ marginTop: metrics.vertical / 8 }}
                        >
                            {explainer}
                        </UiExplainerCopy>
                    )}
                </SafeAreaView>
            </View>
        </Highlight>
    )
}

export const List = <ItemData extends {}>({
    data,
    onPress,
}: PropTypes<ItemData>) => {
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
