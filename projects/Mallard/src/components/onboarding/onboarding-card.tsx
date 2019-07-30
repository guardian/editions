import React from 'react'
import { View, ViewStyle, StyleProp, StyleSheet, TextStyle } from 'react-native'
import { TitlepieceText, UiExplainerCopy } from '../styled-text'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { Button, ButtonAppearance } from '../button/button'

export enum CardAppearance {
    tomato,
    apricot,
    blue,
}

const styles = StyleSheet.create({
    square: {
        aspectRatio: 1,
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    title: {
        ...getFont('titlepiece', 2.5),
    },
    subtitle: {
        ...getFont('titlepiece', 1.5),
    },
    explainer: {
        backgroundColor: color.background,
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    explainerTitle: {
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
    [CardAppearance.blue]: StyleSheet.create({
        background: { backgroundColor: '#5da8db' },
        text: { color: color.primary },
    }),
}

const OnboardingCard = ({
    children,
    title,
    subtitle,
    mainActions,
    explainerTitle,
    style,
    appearance,
}: {
    children: string
    title: string
    subtitle?: string
    mainActions?: { label: string; onPress: () => void }[]
    explainerTitle?: string
    style?: StyleProp<ViewStyle>
    appearance: CardAppearance
}) => (
    <View style={style}>
        <View style={[styles.square, appearances[appearance].background]}>
            <TitlepieceText
                accessibilityRole="header"
                style={[styles.title, appearances[appearance].text]}
            >
                {title}
            </TitlepieceText>
            {subtitle && (
                <TitlepieceText
                    style={[styles.subtitle, appearances[appearance].text]}
                >
                    {subtitle}
                </TitlepieceText>
            )}
            {mainActions && (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                    {mainActions.map(({ label, onPress }) => (
                        <Button
                            style={{
                                marginTop: 10,
                                marginRight: 10,
                            }}
                            appearance={ButtonAppearance.light}
                            key={label}
                            onPress={onPress}
                        >
                            {label}
                        </Button>
                    ))}
                </View>
            )}
        </View>
        {(explainerTitle || children) && (
            <View style={styles.explainer}>
                {explainerTitle && (
                    <TitlepieceText style={styles.explainerTitle}>
                        {explainerTitle}
                    </TitlepieceText>
                )}
                {children && <UiExplainerCopy>{children}</UiExplainerCopy>}
            </View>
        )}
    </View>
)
OnboardingCard.defaultProps = {
    appearance: CardAppearance.tomato,
}

export { OnboardingCard }
