import React from 'react'
import { FlatList, TouchableOpacity, View, Text } from 'react-native'
import { Transition } from 'react-navigation-fluid-transitions'
import { color } from '../../theme/color'
import { PropTypes } from './helpers'
import { metrics } from '../../theme/spacing'

export class Grid extends React.Component<PropTypes> {
    render() {
        const { data, onPress } = this.props
        return (
            <FlatList
                numColumns={2}
                style={{
                    margin: metrics.horizontal - metrics.horizontal / 4,
                }}
                data={data}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={{
                            flex: 1,
                        }}
                        onPress={() => onPress(item)}
                    >
                        <View style={{ backgroundColor: '#fff' }}>
                            <Transition shared={`item-${item.key}`}>
                                <View
                                    style={{
                                        flex: 1,
                                        height: 100,
                                        backgroundColor:
                                            color.palette.highlight.main,
                                        margin: metrics.horizontal / 4,
                                        padding: 16,
                                    }}
                                >
                                    <Transition
                                        shared={`item-text-${item.key}`}
                                    >
                                        <Text>{item.title}</Text>
                                    </Transition>
                                </View>
                            </Transition>
                        </View>
                    </TouchableOpacity>
                )}
            />
        )
    }
}
