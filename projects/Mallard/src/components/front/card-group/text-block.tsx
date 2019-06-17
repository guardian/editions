import React from 'react'
import { View, ViewStyle, StyleProp } from 'react-native'
import { metrics } from '../../../theme/spacing'
import { HeadlineCardText, HeadlineKickerText } from '../../styled-text'

import { useArticleAppearance } from '../../../theme/appearance'
import { color } from 'src/theme/color'

type TextBlockAppearance = 'default' | 'highlight' | 'pillarColor'

const styles = {
    root: {
        paddingBottom: metrics.vertical,
        paddingTop: metrics.vertical / 3,
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
                    appearance.kicker,
                ],
            }
    }
}

const TextBlock = ({
    kicker,
    headline,
    textBlockAppearance,
    style,
}: {
    kicker: string
    headline: string
    textBlockAppearance: TextBlockAppearance
    style?: StyleProp<ViewStyle>
}) => {
    const { rootStyle, kickerStyle, headlineStyle } = useTextBlockStyles(
        textBlockAppearance,
    )

    return (
        <View style={[rootStyle, style]}>
            <HeadlineKickerText style={kickerStyle}>
                Kick {kicker}
            </HeadlineKickerText>
            <HeadlineCardText style={headlineStyle}>
                headline {headline}
            </HeadlineCardText>
        </View>
    )
}
export { TextBlock }
