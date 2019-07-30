import React from 'react'
import { View, ViewStyle, StyleProp } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { HeadlineCardText, HeadlineKickerText } from '../../styled-text'

import { color } from 'src/theme/color'
import { RowSize, useKickerColorStyle } from '../helpers'
import { getFont } from 'src/theme/typography'
import { useArticle } from 'src/hooks/use-article'

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
    const [color, {}] = useArticle()
    const kickerStyle = useKickerColorStyle()

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
                    { backgroundColor: color.main },
                ],
                kickerStyle: styles.contrastText,
                headlineStyle: styles.contrastText,
            }
        default:
            return {
                rootStyle: styles.root,
                kickerStyle,
                headlineStyle: [styles.headline],
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
                <HeadlineCardText
                    style={[headlineStyle, { fontSize, lineHeight: fontSize }]}
                >
                    {' '}
                    {headline}
                </HeadlineCardText>
            </HeadlineKickerText>
        </View>
    )
}
TextBlock.defaultProps = {
    textBlockAppearance: 'default',
}

export { TextBlock }
