import React from 'react'
import { View, ViewStyle, StyleProp } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { HeadlineCardText, HeadlineKickerText } from '../../styled-text'

import { useArticleAppearance } from 'src/theme/appearance'
import { color } from 'src/theme/color'
import { RowSize } from '../helpers'

type TextBlockAppearance = 'default' | 'highlight' | 'pillarColor'

const styles = {
    root: {
        paddingBottom: metrics.vertical,
    },
    rootWithHighlight: {
        backgroundColor: color.palette.highlight.main,
        paddingHorizontal: metrics.horizontal / 2,
    },
    contrastText: {
        color: color.palette.neutral[100],
    },
    headline: {
        color: color.dimText,
    },
}

const useTextBlockStyles = (textBlockAppearance: TextBlockAppearance) => {
    const { appearance } = useArticleAppearance()
    switch (textBlockAppearance) {
        case 'highlight':
            return {
                rootStyle: [styles.root, styles.rootWithHighlight],
                kickerStyle: null,
                headlineStyle: styles.headline,
            }
        case 'pillarColor':
            return {
                rootStyle: [
                    styles.root,
                    styles.rootWithHighlight,
                    appearance.contrastCardBackgrounds,
                ],
                kickerStyle: styles.contrastText,
                headlineStyle: styles.contrastText,
            }
        default:
            return {
                rootStyle: styles.root,
                kickerStyle: [appearance.text, appearance.kicker],
                headlineStyle: [
                    styles.headline,
                    appearance.text,
                    appearance.headline,
                ],
            }
    }
}

const TextBlock = ({
    kicker,
    headline,
    textBlockAppearance,
    size,
    style,
}: {
    kicker: string
    headline: string
    textBlockAppearance: TextBlockAppearance
    size: RowSize
    style?: StyleProp<ViewStyle>
}) => {
    const { rootStyle, kickerStyle, headlineStyle } = useTextBlockStyles(
        textBlockAppearance,
    )
    const fontSize = size >= RowSize.hero ? 24 : 18

    return (
        <View style={[rootStyle, style]}>
            <HeadlineKickerText
                style={[kickerStyle, { fontSize, lineHeight: fontSize }]}
            >
                {kicker}
            </HeadlineKickerText>
            <HeadlineCardText
                style={[headlineStyle, { fontSize, lineHeight: fontSize }]}
            >
                {headline}
            </HeadlineCardText>
        </View>
    )
}
TextBlock.defaultProps = {
    textBlockAppearance: 'default',
}

export { TextBlock }
