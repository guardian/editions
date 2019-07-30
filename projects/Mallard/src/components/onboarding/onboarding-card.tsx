import React from 'react'
import { View, ViewStyle, StyleProp, StyleSheet, TextStyle } from 'react-native'
import { TitlepieceText, UiExplainerCopy } from '../styled-text'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'

export enum CardAppearance {
    tomato,
    apricot,
}

const styles = StyleSheet.create({
    square: {
        aspectRatio: 1,
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    squareText: {
        ...getFont('titlepiece', 2.5),
    },
    explainer: {
        backgroundColor: color.background,
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    subtitle: {
        marginBottom: metrics.vertical * 2,
    },
})

const appearances: {
    [key in CardAppearance]: {
        background: StyleProp<ViewStyle>
        text: StyleProp<TextStyle>
    }
} = {
    [CardAppearance.tomato]: StyleSheet.create({
        background: { backgroundColor: color.ui.tomato },
        text: { color: color.palette.neutral[100] },
    }),
    [CardAppearance.apricot]: StyleSheet.create({
        background: { backgroundColor: color.ui.apricot },
        text: { color: color.palette.neutral[100] },
    }),
}

const OnboardingCard = ({
    children,
    title,
    subtitle,
    style,
    appearance,
}: {
    children: string
    title: string
    subtitle?: string
    style?: StyleProp<ViewStyle>
    appearance: CardAppearance
}) => (
    <View style={style}>
        <View style={[styles.square, appearances[appearance].background]}>
            <TitlepieceText
                accessibilityRole="header"
                style={[styles.squareText, appearances[appearance].text]}
            >
                {title}
            </TitlepieceText>
        </View>
        <View style={styles.explainer}>
            {subtitle && (
                <TitlepieceText style={styles.subtitle}>
                    {subtitle}
                </TitlepieceText>
            )}
            <UiExplainerCopy>{children}</UiExplainerCopy>
        </View>
    </View>
)
OnboardingCard.defaultProps = {
    appearance: CardAppearance.tomato,
}

export { OnboardingCard }
