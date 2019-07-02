import React from 'react'
import {
    View,
    TouchableOpacity,
    TouchableOpacityProps,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
} from 'react-native'
import { UiBodyCopy } from '../styled-text'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'

export enum ButtonAppearance {
    default,
    tomato,
    apricot,
}

const styles = StyleSheet.create({
    background: {
        borderRadius: 999,
        padding: metrics.horizontal * 2,
        paddingVertical: metrics.vertical,
    },
})

const appearances: {
    [key in ButtonAppearance]: {
        background: StyleProp<ViewStyle>
        text: StyleProp<TextStyle>
    }
} = {
    [ButtonAppearance.default]: StyleSheet.create({
        background: { backgroundColor: color.palette.highlight.main },
        text: { color: color.palette.neutral[7] },
    }),
    [ButtonAppearance.tomato]: StyleSheet.create({
        background: { backgroundColor: color.ui.tomato },
        text: { color: color.palette.neutral[100] },
    }),
    [ButtonAppearance.apricot]: StyleSheet.create({
        background: { backgroundColor: color.ui.apricot },
        text: { color: color.palette.neutral[100] },
    }),
}

const Button = ({
    children,
    onPress,
    style,
    appearance,
}: {
    children: string
    onPress: TouchableOpacityProps['onPress']
    style?: StyleProp<ViewStyle>
    appearance: ButtonAppearance
}) => (
    <TouchableOpacity
        accessibilityRole="button"
        onPress={onPress}
        style={style}
    >
        <View style={[styles.background, appearances[appearance].background]}>
            <UiBodyCopy weight="bold" style={appearances[appearance].text}>
                {children}
            </UiBodyCopy>
        </View>
    </TouchableOpacity>
)
Button.defaultProps = {
    appearance: ButtonAppearance.default,
}

export { Button }
