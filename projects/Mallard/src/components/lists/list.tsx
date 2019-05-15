import React, { ReactNode } from 'react'
import {
    Platform,
    FlatList,
    TouchableHighlight,
    TouchableNativeFeedback,
    SafeAreaView,
    View,
    Text,
} from 'react-native'
import { color } from '../../theme/color'
import { metrics } from '../../theme/spacing'
import { PropTypes } from './helpers'

export const ListHeading = ({ children }: { children: ReactNode }) => (
    <View
        style={{
            padding: metrics.horizontal,
            paddingTop: metrics.vertical * 2,
            paddingBottom: metrics.vertical / 2,
            backgroundColor: color.background,
        }}
    >
        <SafeAreaView>
            <Text style={{ fontSize: 17, fontWeight: '900' }}>{children}</Text>
        </SafeAreaView>
    </View>
)
export class List extends React.Component<PropTypes> {
    render() {
        const { data, onPress } = this.props
        const Highlight =
            Platform.OS === 'android'
                ? TouchableNativeFeedback
                : TouchableHighlight
        return (
            <FlatList
                style={{
                    borderTopWidth: 1,
                    borderColor: '#ddd',
                }}
                data={data}
                renderItem={({ item: { title, ...item } }: any) => (
                    <Highlight onPress={() => onPress(item)}>
                        <View
                            style={{
                                padding: metrics.horizontal,
                                paddingVertical: metrics.vertical,
                                backgroundColor: color.background,
                                borderBottomWidth: 1,
                                borderColor: color.line,
                            }}
                        >
                            <SafeAreaView>
                                <Text style={{ fontSize: 17 }}>
                                    {title || 'no title'}
                                </Text>
                            </SafeAreaView>
                        </View>
                    </Highlight>
                )}
            />
        )
    }
}
