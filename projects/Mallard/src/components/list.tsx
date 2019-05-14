import React from 'react'
import {
    Platform,
    FlatList,
    TouchableHighlight,
    TouchableNativeFeedback,
    SafeAreaView,
    View,
    Text,
} from 'react-native'
import { color } from '../theme/color'
import { metrics } from '../theme/spacing'

export class List extends React.Component<{
    data: any[]
    onPress: ({ key: any }) => void
}> {
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
                                <Text>{title || 'no title'}</Text>
                            </SafeAreaView>
                        </View>
                    </Highlight>
                )}
            />
        )
    }
}
