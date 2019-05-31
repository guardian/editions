import React from 'react'
import { FlatList, TouchableOpacity, View, StyleSheet } from 'react-native'
import { color } from '../../theme/color'
import { metrics } from '../../theme/spacing'
import { HeadlineCardText } from '../styled-text'

/*
TODO: Delete this, replace with proper fronts grid view
*/

export const Grid = ({ data, onPress }: any) => {
    return (
        <FlatList
            numColumns={2}
            style={{
                margin: metrics.horizontal - metrics.horizontal / 4,
            }}
            data={data}
            renderItem={({ item }: { item: any }) => (
                <TouchableOpacity
                    style={{
                        flex: 1,
                    }}
                    onPress={() => onPress(item)}
                >
                    <View
                        style={{
                            flex: 1,
                            height: 100,
                            backgroundColor: color.background,
                            margin: metrics.horizontal / 4,
                            padding: metrics.horizontal / 2,
                            paddingVertical: metrics.vertical / 4,
                            borderTopColor: color.line,
                            borderTopWidth: Math.ceil(StyleSheet.hairlineWidth),
                        }}
                    >
                        <HeadlineCardText>{item.title}</HeadlineCardText>
                    </View>
                </TouchableOpacity>
            )}
        />
    )
}
