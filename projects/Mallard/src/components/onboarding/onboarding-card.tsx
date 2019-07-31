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
        flexDirection: 'column',
        justifyContent: 'space-around',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
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
    size = 'big',
}: {
    children?: string
    title: string
    subtitle?: string
    mainActions?: { label: string; onPress: () => void }[]
    explainerTitle?: string
    style?: StyleProp<ViewStyle>
    appearance: CardAppearance
    size?: 'big' | 'small'
}) => (
    <View style={style}>
        <View style={[styles.square, appearances[appearance].background]}>
            <View style={{ flexGrow: 1 }}>
                <TitlepieceText
                    accessibilityRole="header"
                    style={[
                        getFont('titlepiece', size === 'big' ? 2.5 : 2.0),
                        { marginBottom: size === 'big' ? 16 : 8 },
                        appearances[appearance].text,
                    ]}
                >
                    {title}
                </TitlepieceText>
                {subtitle && (
                    <TitlepieceText
                        style={[
                            getFont('titlepiece', size === 'big' ? 1.5 : 1.25),
                            appearances[appearance].text,
                        ]}
                    >
                        {subtitle}
                    </TitlepieceText>
                )}
            </View>
            <View>
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
