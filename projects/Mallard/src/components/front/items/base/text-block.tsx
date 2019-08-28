import React from 'react'
import { StyleProp, View, ViewStyle } from 'react-native'
import Quote from 'src/components/icons/Quote'
import { TextWithIcon } from 'src/components/layout/text-with-icon'
import { useArticle } from 'src/hooks/use-article'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import {
    applyScale,
    FontSizes,
    getFont,
    getUnscaledFont,
} from 'src/theme/typography'
import { HeadlineCardText, HeadlineKickerText } from '../../../styled-text'
import { ItemSizes, PageLayoutSizes } from '../../helpers/helpers'

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
    opinionHeadline: {
        color: color.dimText,
        fontFamily: getFont('headline', 1, 'light').fontFamily,
    },
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
    style,
    byline,
    monotone = false,
    ...sizes
}: {
    kicker: string
    byline?: string
    headline: string
    style?: StyleProp<ViewStyle>
    monotone?: boolean
} & ({ size: ItemSizes } | { fontSize: FontSizes<'headline'> })) => {
    const font = getUnscaledFont(
        'headline',
        'fontSize' in sizes ? sizes.fontSize : getFontSize(sizes.size),
    )

    const fontSize = applyScale(font).fontSize
    const [colors, { pillar }] = useArticle()

    const kickerColor = colors.main

    return (
        <View style={[styles.root, style]}>
            {pillar === 'opinion' ? (
                <>
                    <TextWithIcon
                        unscaledFont={font}
                        style={styles.opinionHeadline}
                        icon={{
                            width: 40,
                            element: scale => (
                                <Quote
                                    scale={
                                        (0.67 / scale) *
                                        (fontSize /
                                            getFont('headline', 1).fontSize)
                                    }
                                    fill={colors.main}
                                />
                            ),
                        }}
                    >
                        {headline}
                    </TextWithIcon>
                    <HeadlineKickerText
                        allowFontScaling={false}
                        style={[
                            {
                                color: kickerColor,
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
                    style={[
                        styles.headline,
                        { fontSize, lineHeight: fontSize },
                    ]}
                >
                    <HeadlineKickerText
                        allowFontScaling={false}
                        style={[
                            !monotone && {
                                color: kickerColor,
                            },
                            {
                                fontSize,
                                lineHeight: fontSize,
                            },
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
