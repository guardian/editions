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
import { UiBodyCopy, UiExplainerCopy } from '../styled-text'

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
                renderItem={({ item: { title, explainer, data } }: any) => (
                    <Highlight onPress={() => onPress(data)}>
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
                                <UiBodyCopy>{title}</UiBodyCopy>
                                {explainer && (
                                    <UiExplainerCopy>
                                        {explainer}
                                    </UiExplainerCopy>
                                )}
                            </SafeAreaView>
                        </View>
                    </Highlight>
                )}
            />
        )
    }
}
