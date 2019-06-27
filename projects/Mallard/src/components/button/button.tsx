import React from 'react'
import {
    View,
    TouchableOpacity,
    TouchableOpacityProps,
    StyleSheet,
    StyleProp,
    ViewStyle,
} from 'react-native'
import { UiBodyCopy } from '../styled-text'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'

const styles = StyleSheet.create({
    background: {
        backgroundColor: color.palette.news.bright,
        borderRadius: 999,
        padding: metrics.horizontal * 2,
        paddingVertical: metrics.vertical,
    },
    text: {
        color: color.palette.neutral[100],
    },
})

const Button = ({
    children,
    onPress,
    style,
}: {
    children: string
    onPress: TouchableOpacityProps['onPress']
    style?: StyleProp<ViewStyle>
}) => (
    <TouchableOpacity
        accessibilityRole="button"
        onPress={onPress}
        style={style}
    >
        <View style={styles.background}>
            <UiBodyCopy weight="bold" style={styles.text}>
                {children}
            </UiBodyCopy>
        </View>
    </TouchableOpacity>
)

export { Button }
