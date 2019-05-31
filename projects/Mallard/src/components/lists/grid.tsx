import React from 'react'
import { FlatList, TouchableOpacity, View, StyleSheet } from 'react-native'
import { color } from '../../theme/color'
import { PropTypes } from './helpers'
import { metrics } from '../../theme/spacing'
import { HeadlineCardText } from '../styled-text'

export class Grid<T> extends React.Component<PropTypes<T>> {
    render() {
        const { data, onPress } = this.props
        return (
            <FlatList
                numColumns={2}
                style={{
                    margin: metrics.horizontal - metrics.horizontal / 4,
                }}
                scrollEnabled={false}
                data={data}
                renderItem={({ item }) => (
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
                                borderTopWidth: Math.ceil(
                                    StyleSheet.hairlineWidth,
                                ),
                            }}
                        >
                            <HeadlineCardText>{item.title}</HeadlineCardText>
                        </View>
                    </TouchableOpacity>
                )}
            />
        )
    }
}
