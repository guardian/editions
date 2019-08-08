import React from 'react'
import { View, ViewStyle, StyleProp } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { HeadlineCardText, HeadlineKickerText } from '../../styled-text'

import { color } from 'src/theme/color'
import { useKickerColorStyle, ItemSizes, PageLayoutSizes } from '../helpers'
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

const getFontSize = ({ layout, story }: ItemSizes) => {
    if (layout === PageLayoutSizes.tablet) {
        if (story.width >= 3) {
            if (story.height >= 3) return 2
            if (story.height >= 2) return 1.5
        }
        if (story.width >= 2) {
            if (story.height >= 3) return 1.75
            // 2x1s are text only so we bump them up
            if (story.height === 1) return 1.5
            return 1.25
        }
        return 1.25
    }
    return story.height >= 6 ? 1.5 : story.height >= 4 ? 1.25 : 1
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
    size: ItemSizes
    style?: StyleProp<ViewStyle>
}) => {
    const { rootStyle, kickerStyle, headlineStyle } = useTextBlockStyles(
        textBlockAppearance,
    )

    const { fontSize } = getFont('headline', getFontSize(size))

    return (
        <View style={[rootStyle, style]}>
            <HeadlineKickerText
                style={[kickerStyle, { fontSize, lineHeight: fontSize }]}
            >
                {kicker}
                <HeadlineCardText
                    style={[headlineStyle, { fontSize, lineHeight: fontSize }]}
                >
                    {' ' + headline}
                </HeadlineCardText>
            </HeadlineKickerText>
        </View>
    )
}
TextBlock.defaultProps = {
    textBlockAppearance: 'default',
}

export { TextBlock }
