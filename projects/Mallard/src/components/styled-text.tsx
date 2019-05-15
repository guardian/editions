import React from 'react'
import { Text, View } from 'react-native'
import { color } from '../theme/color'
import { metrics } from '../theme/spacing'

export class HeadlineText extends React.Component<{ style?: any }> {
    render() {
        return (
            <Text
                {...this.props}
                style={{
                    fontSize: 24,
                }}
            />
        )
    }
}

export const UiBodyCopy = ({
    children,
    style,
    ...props
}: {
    children: string
    style?: {}
}) => <Text style={{ fontSize: 17, ...style }}>{children}</Text>

export const UiExplainerCopy = ({
    children,
    style,
    ...props
}: {
    children: string
    style?: any
}) => (
    <Text {...props} style={{ fontSize: 15, color: color.dimText, ...style }}>
        {children}
    </Text>
)

export const MonoTextBlock = ({
    children,
    style,
    ...props
}: {
    children: any
    style?: any
}) => (
    <View
        style={[
            style,
            {
                padding: metrics.vertical,
                paddingHorizontal: metrics.horizontal,
            },
        ]}
    >
        <UiExplainerCopy>{children}</UiExplainerCopy>
    </View>
)
