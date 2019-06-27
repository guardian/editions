import React from 'react'
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native'
import { TitlepieceText } from '../styled-text'
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
        fontSize: 50,
        lineHeight: 50,
    },
    explainer: {
        backgroundColor: color.background,
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
})

const OnboardingCard = ({
    children,
    title,
    style,
}: {
    children: string
    title: string
    style: StyleProp<ViewStyle>
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
            <UiBodyCopy>{children}</UiBodyCopy>
        </View>
    </View>
)

export { OnboardingCard }
