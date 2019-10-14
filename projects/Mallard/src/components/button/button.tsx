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
import { getFont } from 'src/theme/typography'

export enum ButtonAppearance {
    default,
    skeleton,
    skeletonBlue,
    tomato,
    apricot,
    skeletonLight,
    skeletonActive,
    light,
    dark,
}

const height = metrics.buttonHeight

const styles = StyleSheet.create({
    background: {
        borderRadius: 999,
        paddingHorizontal: metrics.horizontal * 1.5,
        alignItems: 'center',
        justifyContent: 'center',
        height,
    },
    text: {
        flexShrink: 0,
        ...getFont('sans', 1, 'bold'),
    },
    withIcon: {
        paddingHorizontal: 0,
        aspectRatio: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: height,
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
    [ButtonAppearance.skeletonBlue]: StyleSheet.create({
        background: {
            backgroundColor: undefined,
            borderWidth: 1,
            borderColor: color.primary,
        },
        text: { color: color.primary },
    }),
    [ButtonAppearance.skeletonActive]: StyleSheet.create({
        background: {
            backgroundColor: appAppearance.color,
            borderWidth: 1,
            borderColor: appAppearance.color,
        },
        text: { color: appAppearance.cardBackgroundColor },
    }),
    [ButtonAppearance.skeletonLight]: StyleSheet.create({
        background: {
            backgroundColor: undefined,
            borderWidth: 1,
            borderColor: color.palette.neutral[100],
        },
        text: { color: color.palette.neutral[100] },
    }),
    [ButtonAppearance.light]: StyleSheet.create({
        background: { backgroundColor: color.palette.neutral[100] },
        text: { color: color.primary },
    }),
    [ButtonAppearance.dark]: StyleSheet.create({
        background: { backgroundColor: color.primary },
        text: { color: color.palette.neutral[100] },
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
        ...getFont('icon', 1),
    },
})

const Icon = ({
    children,
    style,
}: {
    children: string
    style?: StyleProp<Pick<TextStyle, 'color'>>
}) => (
    <Text allowFontScaling={false} style={[iconStyles.root, style]}>
        {children}
    </Text>
)

const Button = ({
    onPress,
    style,
    buttonStyles,
    textStyles,
    center,
    appearance,
    iconPosition = 'left',
    ...innards
}: {
    style?: StyleProp<ViewStyle>
    buttonStyles?: StyleProp<ViewStyle>
    textStyles?: StyleProp<TextStyle>
    center?: boolean
    alt?: string
    iconPosition?: 'left' | 'right'
    appearance: ButtonAppearance
} & (
    | { children: string }
    | { children: string; icon: string | React.ReactNode }
    | { alt: string; icon: string | React.ReactNode }) &
    TouchableOpacityProps) => {
    const appStyles = useAppAppearance()
    const defaultButtonStyles = useMemo(() => getButtonAppearance(appStyles), [
        appStyles,
    ])[appearance]

    const icon =
        'icon' in innards &&
        (typeof innards.icon === 'string' ? (
            <Icon style={[defaultButtonStyles.text, textStyles]}>
                {innards.icon}
            </Icon>
        ) : (
            <View style={{ flex: 0 }}>{innards.icon}</View>
        ))

    return (
        <TouchableOpacity
            accessibilityRole="button"
            accessibilityHint={'alt' in innards ? innards.alt : undefined}
            onPress={onPress}
            style={style}
            {...innards}
        >
            <View
                style={[
                    styles.background,
                    defaultButtonStyles.background,
                    !('children' in innards) && styles.withIcon,
                    buttonStyles,
                ]}
            >
                {iconPosition === 'left' && icon}
                {'children' in innards && (
                    <UiBodyCopy
                        style={[
                            styles.text,
                            { textAlign: center ? 'center' : 'auto' },
                            defaultButtonStyles.text,
                            textStyles,
                        ]}
                    >
                        {innards.children}
                    </UiBodyCopy>
                )}
                {iconPosition === 'right' && icon}
            </View>
        </TouchableOpacity>
    )
}
Button.defaultProps = {
    appearance: ButtonAppearance.default,
}

export { Button }
