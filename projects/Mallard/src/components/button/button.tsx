import React, { useMemo } from 'react'
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
import { AppAppearanceStyles, useAppAppearance } from 'src/theme/appearance'

export enum ButtonAppearance {
    default,
    skeleton,
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

interface ButtonAppearanceStyles {
    background: StyleProp<ViewStyle>
    text: StyleProp<TextStyle>
}

const getButtonAppearance = (
    appAppearance: AppAppearanceStyles,
): {
    [key in ButtonAppearance]: ButtonAppearanceStyles
} => ({
    [ButtonAppearance.default]: StyleSheet.create({
        background: { backgroundColor: color.palette.highlight.main },
        text: { color: color.palette.neutral[7] },
    }),
    [ButtonAppearance.skeleton]: StyleSheet.create({
        background: {
            backgroundColor: undefined,
            borderWidth: 1,
            borderColor: appAppearance.color,
        },
        text: { color: appAppearance.color },
    }),
    [ButtonAppearance.tomato]: StyleSheet.create({
        background: { backgroundColor: color.ui.tomato },
        text: { color: color.palette.neutral[100] },
    }),
    [ButtonAppearance.apricot]: StyleSheet.create({
        background: { backgroundColor: color.ui.apricot },
        text: { color: color.palette.neutral[100] },
    }),
})

const iconStyles = StyleSheet.create({
    root: {
        fontFamily: 'GuardianIcons-Regular',
        fontSize: 20,
        lineHeight: 20,
    },
})

const Icon = ({
    children,
    style,
}: {
    children: string
    style?: StyleProp<Pick<TextStyle, 'color'>>
}) => <Text style={[iconStyles.root, style]}>{children}</Text>

const Button = ({
    onPress,
    style,
    center,
    appearance,
    ...innards
}: {
    onPress: TouchableOpacityProps['onPress']
    style?: StyleProp<ViewStyle>
    center?: boolean
    appearance: ButtonAppearance
} & ({ children: string } | { icon: string; alt: string })) => {
    const appStyles = useAppAppearance()
    const buttonStyles = useMemo(() => getButtonAppearance(appStyles), [
        appStyles,
    ])[appearance]

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityHint={'icon' in innards ? innards.alt : undefined}
            onPress={onPress}
            style={style}
        >
            <View
                style={[
                    styles.background,
                    buttonStyles.background,
                    'icon' in innards && styles.withIcon,
                ]}
            >
                {'children' in innards ? (
                    <UiBodyCopy
                        weight="bold"
                        style={[
                            buttonStyles.text,
                            { textAlign: center ? 'center' : 'auto' },
                        ]}
                    >
                        {innards.children}
                    </UiBodyCopy>
                ) : (
                    <Icon style={buttonStyles.text}>{innards.icon}</Icon>
                )}
            </View>
        </TouchableOpacity>
    )
}
Button.defaultProps = {
    appearance: ButtonAppearance.default,
}

export { Button }
