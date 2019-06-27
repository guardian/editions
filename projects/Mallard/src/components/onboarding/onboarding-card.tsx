import React from 'react'
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native'
import { TitlepieceText, UiExplainerCopy } from '../styled-text'
import { UiBodyCopy } from 'src/components/styled-text'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'

const styles = StyleSheet.create({
    square: {
        backgroundColor: color.palette.news.bright,
        aspectRatio: 1,
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    squareText: {
        color: color.palette.neutral[100],
        fontSize: 60,
        lineHeight: 60,
    },
    explainer: {
        backgroundColor: color.background,
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    subtitle: {
        marginBottom: metrics.vertical,
    },
})

const OnboardingCard = ({
    children,
    title,
    subtitle,
    style,
}: {
    children: string
    title: string
    subtitle?: string
    style?: StyleProp<ViewStyle>
}) => (
    <View style={style}>
        <View style={styles.square}>
            <TitlepieceText
                accessibilityRole="header"
                style={styles.squareText}
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

export { OnboardingCard }
