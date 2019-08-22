import React from 'react'
import { View, ViewStyle, StyleProp, StyleSheet, TextStyle } from 'react-native'
import { TitlepieceText, UiExplainerCopy } from '../styled-text'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { minScreenSize } from 'src/helpers/screen'

export enum CardAppearance {
    tomato,
    apricot,
    blue,
}

const styles = StyleSheet.create({
    container: {
        flex: 0,
        flexDirection: 'column',
    },
    top: {
        aspectRatio: 1,
        flexDirection: 'column',
        justifyContent: 'space-around',
        flexGrow: 0,
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
        width: '100%',
    },
    explainer: {
        backgroundColor: color.background,
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    explainerTitle: {
        marginBottom: metrics.vertical * 2,
    },
    explainerSubtitle: {
        ...getFont('titlepiece', 1.25),
        marginBottom: metrics.vertical * 1.5,
    },
})

const appearances: {
    [key in CardAppearance]: {
        background: StyleProp<ViewStyle>
        titleText: StyleProp<TextStyle>
        subtitleText: StyleProp<TextStyle>
    }
} = {
    [CardAppearance.tomato]: StyleSheet.create({
        background: { backgroundColor: color.ui.tomato },
        titleText: { color: color.palette.neutral[100] },
        subtitleText: { color: color.palette.neutral[100] },
    }),
    [CardAppearance.apricot]: StyleSheet.create({
        background: { backgroundColor: color.ui.apricot },
        titleText: { color: color.palette.neutral[100] },
        subtitleText: { color: color.palette.neutral[100] },
    }),
    [CardAppearance.blue]: StyleSheet.create({
        background: { backgroundColor: color.ui.sea },
        titleText: { color: color.palette.neutral[100] },
        subtitleText: { color: color.primary },
    }),
}

const OnboardingCard = ({
    children,
    title,
    subtitle,
    bottomContent,
    explainerTitle,
    explainerSubtitle,
    style,
    appearance,
    size = 'big',
    maxSize = 500,
}: {
    children?: string
    title: string
    subtitle?: string
    bottomContent?: React.ReactNode
    explainerTitle?: string
    explainerSubtitle?: string
    style?: StyleProp<ViewStyle>
    appearance: CardAppearance
    size?: 'big' | 'small'
    maxSize?: number
}) => {
    const max = Math.min(minScreenSize() * 0.9, maxSize)
    return (
        <View
            style={[
                appearances[appearance].background,
                styles.container,
                {
                    width: max,
                },
                style,
            ]}
        >
            <View style={[styles.top, appearances[appearance].background]}>
                <View style={{ flexGrow: 1 }}>
                    <TitlepieceText
                        accessibilityRole="header"
                        style={[
                            getFont('titlepiece', size === 'big' ? 2.5 : 2.0),
                            { marginBottom: size === 'big' ? 16 : 8 },
                            appearances[appearance].titleText,
                        ]}
                    >
                        {title}
                    </TitlepieceText>
                    {subtitle && (
                        <TitlepieceText
                            style={[
                                getFont(
                                    'titlepiece',
                                    size === 'big' ? 1.5 : 1.25,
                                ),
                                appearances[appearance].subtitleText,
                            ]}
                        >
                            {subtitle}
                        </TitlepieceText>
                    )}
                </View>
                <View>
                    {bottomContent && (
                        <View
                            style={{ flexDirection: 'row', flexWrap: 'wrap' }}
                        >
                            {bottomContent}
                        </View>
                    )}
                </View>
            </View>
            {(explainerTitle || explainerSubtitle || children) && (
                <View style={styles.explainer}>
                    {explainerTitle && (
                        <TitlepieceText style={styles.explainerTitle}>
                            {explainerTitle}
                        </TitlepieceText>
                    )}
                    {explainerSubtitle && (
                        <TitlepieceText style={styles.explainerSubtitle}>
                            {explainerSubtitle}
                        </TitlepieceText>
                    )}
                    {children && <UiExplainerCopy>{children}</UiExplainerCopy>}
                </View>
            )}
        </View>
    )
}

OnboardingCard.defaultProps = {
    appearance: CardAppearance.tomato,
}

export { OnboardingCard }
