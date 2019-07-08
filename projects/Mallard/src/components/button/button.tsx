import React from 'react'
import {
    View,
    TouchableOpacity,
    TouchableOpacityProps,
    StyleSheet,
    StyleProp,
    ViewStyle,
    TextStyle,
    Text,
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
    withIcon: {
        paddingHorizontal: 0,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
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

const iconStyles = StyleSheet.create({
    root: {
        fontFamily: 'GuardianIcons-Regular',
        fontSize: 20,
        lineHeight: 20,
    },
})

const Icon = ({ children }: { children: string }) => (
    <Text style={iconStyles.root}>{children}</Text>
)

const Button = ({
    onPress,
    style,
    appearance,
    ...innards
}: {
    onPress: TouchableOpacityProps['onPress']
    style?: StyleProp<ViewStyle>
    appearance: ButtonAppearance
} & ({ children: string } | { icon: string; alt: string })) => (
    <TouchableOpacity
        accessibilityRole="button"
        accessibilityHint={'icon' in innards ? innards.alt : undefined}
        onPress={onPress}
        style={style}
    >
        <View
            style={[
                styles.background,
                appearances[appearance].background,
                'icon' in innards && styles.withIcon,
            ]}
        >
            {'children' in innards ? (
                <UiBodyCopy weight="bold" style={appearances[appearance].text}>
                    {innards.children}
                </UiBodyCopy>
            ) : (
                <Icon>{innards.icon}</Icon>
            )}
        </View>
    </TouchableOpacity>
)
Button.defaultProps = {
    appearance: ButtonAppearance.default,
}

export { Button }
