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

export const ListHeading = ({ children }: { children: string }) => (
    <View
        style={{
            padding: metrics.horizontal,
            paddingTop: metrics.vertical * 2,
            paddingBottom: metrics.vertical / 2,
        }}
    >
        <SafeAreaView>
            <UiBodyCopy style={{ fontWeight: '700' }}>{children}</UiBodyCopy>
        </SafeAreaView>
    </View>
)

const ListItem = ({
    onPress,
    item: { title, explainer, data },
}: {
    item: Item
    onPress: OnPressHandler
}) => {
    const Highlight =
        Platform.OS === 'android' ? TouchableNativeFeedback : TouchableHighlight
    return (
        <Highlight onPress={() => onPress(data)}>
            <View
                style={{
                    padding: metrics.horizontal,
                    paddingVertical: metrics.vertical,
                    borderTopWidth: 0,
                    borderBottomWidth: StyleSheet.hairlineWidth,
                    borderColor: useAppAppearance().borderColor,
                    backgroundColor: useAppAppearance().backgroundColor,
                }}
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

export const List = ({ data, onPress }: PropTypes) => {
    return (
        <FlatList
            style={{
                borderTopWidth: StyleSheet.hairlineWidth,
                borderColor: useAppAppearance().borderColor,
            }}
            data={data}
            renderItem={({ item }) => (
                <ListItem onPress={onPress} item={item} />
            )}
        />
    )
}
