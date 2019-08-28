import React from 'react'
import { View, ViewStyle, StyleProp } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { HeadlineCardText, HeadlineKickerText } from '../../../styled-text'

import { color } from 'src/theme/color'
import {
    useKickerColorStyle,
    ItemSizes,
    PageLayoutSizes,
} from '../../helpers/helpers'
import {
    getFont,
    FontSizes,
    getUnscaledFont,
    applyScale,
} from 'src/theme/typography'
import { useArticle } from 'src/hooks/use-article'
import { TextWithIcon } from 'src/components/layout/text-with-icon'
import Quote from 'src/components/icons/Quote'

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
    const [color, { pillar }] = useArticle()
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
                headlineStyle: [
                    styles.headline,
                    pillar === 'opinion' && {
                        fontFamily: getFont('headline', 1, 'light').fontFamily,
                    },
                ],
            }
    }
}

const getFontSize = ({ layout, story }: ItemSizes) => {
    if (layout === PageLayoutSizes.tablet) {
        if (story.width >= 3) {
            if (story.height >= 3) return 1.5
            if (story.height >= 2) return 1
        }
        if (story.width >= 2) {
            if (story.height >= 3) return 1.25
            return 0.75
        }
        return 0.75
    }
    return story.height >= 6 ? 1.5 : story.height >= 4 ? 1.25 : 1
}

const TextBlock = ({
    kicker,
    headline,
    textBlockAppearance,
    style,
    byline,
    ...sizes
}: {
    kicker: string
    byline?: string
    headline: string
    textBlockAppearance: TextBlockAppearance
    style?: StyleProp<ViewStyle>
} & ({ size: ItemSizes } | { fontSize: FontSizes<'headline'> })) => {
    const { rootStyle, kickerStyle, headlineStyle } = useTextBlockStyles(
        textBlockAppearance,
    )

    const font = getUnscaledFont(
        'headline',
        'fontSize' in sizes ? sizes.fontSize : getFontSize(sizes.size),
    )

    const fontSize = applyScale(font).fontSize
    const [color, { pillar }] = useArticle()
    return (
        <View style={[rootStyle, style]}>
            {pillar === 'opinion' ? (
                <>
                    <TextWithIcon
                        unscaledFont={font}
                        style={headlineStyle}
                        icon={{
                            width: 40,
                            element: scale => (
                                <Quote
                                    scale={
                                        (0.67 / scale) *
                                        (fontSize /
                                            getFont('headline', 1).fontSize)
                                    }
                                    fill={color.main}
                                />
                            ),
                        }}
                    >
                        {headline}
                    </TextWithIcon>
                    <HeadlineKickerText
                        allowFontScaling={false}
                        style={[
                            kickerStyle,
                            {
                                marginTop: 4,
                                fontSize,
                                lineHeight: fontSize,
                            },
                        ]}
                    >
                        {byline}
                    </HeadlineKickerText>
                </>
            ) : (
                <HeadlineCardText
                    allowFontScaling={false}
                    style={[headlineStyle, { fontSize, lineHeight: fontSize }]}
                >
                    <HeadlineKickerText
                        allowFontScaling={false}
                        style={[
                            kickerStyle,
                            { fontSize, lineHeight: fontSize },
                        ]}
                    >
                        {kicker + ' '}
                    </HeadlineKickerText>
                    {headline}
                </HeadlineCardText>
            )}
        </View>
    )
}
TextBlock.defaultProps = {
    textBlockAppearance: 'default',
}

export { TextBlock }
