import React from 'react'
import { View, ViewStyle, StyleProp, StyleSheet, TextStyle } from 'react-native'
import { TitlepieceText } from '../styled-text'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { CloseButton } from '../Button/CloseButton'
import { ButtonAppearance } from '../Button/Button'

export enum CardAppearance {
    apricot,
    blue,
}

const styles = StyleSheet.create({
    flexRow: {
        flexDirection: 'row',
    },
    container: {
        flex: 0,
        flexDirection: 'column',
        borderRadius: 5,
    },
    top: {
        alignContent: 'space-between',
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical,
    },
    dismissIconContainer: {
        alignItems: 'flex-end',
        marginBottom: metrics.vertical / 2,
    },
    titlePieceContainer: {
        alignItems: 'flex-start',
        flex: 1,
    },
    wrapper: {
        borderRadius: 5,
    },
    bubbleEdge: {
        position: 'absolute',
        top: 0,
        left: '50%',
        width: 0,
        height: 0,
        borderBottomColor: '#00aabb',
        marginLeft: -11,
        marginTop: -22,
    },
})

const appearances: {
    [key in CardAppearance]: {
        background: StyleProp<ViewStyle>
        titleText: StyleProp<TextStyle>
        subtitleText: StyleProp<TextStyle>
    }
} = {
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

const NewEditionCard = ({
    title,
    subtitle,
    onDismissThisCard,
    style,
    size = 'big',
}: {
    title: string
    subtitle?: string
    onDismissThisCard?: () => void
    style?: StyleProp<ViewStyle>
    size?: 'big' | 'medium' | 'small'
}) => {
    const appearance = CardAppearance.apricot
    return (
        <View style={styles.wrapper}>
            <View
                style={[
                    appearances[appearance].background,
                    styles.container,
                    style,
                ]}
            >
                <View style={[styles.top, appearances[appearance].background]}>
                    <View style={styles.flexRow}>
                        <View style={styles.titlePieceContainer}>
                            <TitlepieceText
                                accessibilityRole="header"
                                style={[
                                    getFont('titlepiece', 2.5),
                                    { marginBottom: 16 },
                                    appearances[appearance].titleText,
                                ]}
                            >
                                {title}
                            </TitlepieceText>
                        </View>
                        {onDismissThisCard && (
                            <View style={styles.dismissIconContainer}>
                                <CloseButton
                                    onPress={onDismissThisCard}
                                    accessibilityHint="This will dismiss the onboarding card"
                                    accessibilityLabel={`Dismiss the ${title} onboarding card`}
                                    appearance={ButtonAppearance.skeletonBlue}
                                />
                            </View>
                        )}
                    </View>
                    <View>
                        {subtitle && (
                            <TitlepieceText
                                style={[
                                    getFont('titlepiece', 1.5),
                                    appearances[appearance].subtitleText,
                                ]}
                            >
                                {subtitle}
                            </TitlepieceText>
                        )}
                    </View>
                </View>
            </View>
            <View style={styles.bubbleEdge}></View>
        </View>
    )
}

export { NewEditionCard }
