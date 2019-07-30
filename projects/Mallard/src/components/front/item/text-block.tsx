import React from 'react'
import { View, ViewStyle, StyleProp } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { HeadlineCardText, HeadlineKickerText } from '../../styled-text'

import { useArticleAppearance } from 'src/theme/appearance'
import { color } from 'src/theme/color'
import { RowSize } from '../helpers'
import { getFont } from 'src/theme/typography'

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
                kickerStyle: [
                    appearance.text,
                    appearance.kicker,
                    appearance.cardKicker,
                ],
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
    const { fontSize } = getFont(
        'headline',
        size >= RowSize.superhero ? 1.5 : size >= RowSize.hero ? 1.25 : 1,
    )

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
