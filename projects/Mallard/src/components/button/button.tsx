import React from 'react'
import { View, TouchableOpacity, TouchableOpacityProps } from 'react-native'
import { UiBodyCopy } from '../styled-text'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'

const Button = ({
    children,
    onPress,
}: {
    children: string
    onPress: TouchableOpacityProps['onPress']
}) => (
    <TouchableOpacity accessibilityRole="button" onPress={onPress}>
        <View
            style={{
                backgroundColor: 'tomato',
                borderRadius: 999,
                padding: metrics.horizontal * 2,
                paddingVertical: metrics.vertical,
            }}
        >
            <UiBodyCopy
                weight="bold"
                style={{
                    color: color.palette.neutral[100],
                }}
            >
                {children}
            </UiBodyCopy>
        </View>
    </TouchableOpacity>
)

export { Button }
