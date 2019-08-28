import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BylineCutout } from 'src/components/article/article-header/opinion-header'
import Quote from 'src/components/icons/Quote'
import { TextWithIcon } from 'src/components/layout/text-with-icon'
import { StandfirstText } from 'src/components/styled-text'
import { useArticle } from 'src/hooks/use-article'
import { color } from 'src/theme/color'
import { getFont, getUnscaledFont } from 'src/theme/typography'
import {
    getItemRectanglePerc,
    PageLayoutSizes,
    toPercentage,
} from '../helpers/helpers'
import { ImageResource } from '../image-resource'
import {
    ItemTappable,
    PropTypes,
    tappablePadding,
} from './helpers/item-tappable'
import { TextBlock } from './helpers/text-block'

/*
SUPERHERO IMAGE ITEM
Text below image. To use in news & sport supers
*/
const superHeroImageStyles = StyleSheet.create({
    image: {
        width: '100%',
        flex: 0,
        height: toPercentage(
            getItemRectanglePerc(
                { width: 2, height: 4, top: 0, left: 0 },
                PageLayoutSizes.mobile,
            ).height,
        ),
    },
    textBlock: {
        ...tappablePadding,
    },
    textStandBlock: {
        ...tappablePadding,
        ...getFont('text', 0.9),
        color: color.palette.neutral[46],
        position: 'absolute',
        bottom: 0,
    },
})

const NormalSuper = ({ article, size, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }} hasPadding={false}>
            {'image' in article && article.image ? (
                <ImageResource
                    style={[superHeroImageStyles.image]}
                    image={article.image}
                />
            ) : null}
            <TextBlock
                byline={article.byline}
                style={[superHeroImageStyles.textBlock]}
                kicker={article.kicker}
                headline={article.headline}
                {...{ size }}
            />
            <StandfirstText
                allowFontScaling={false}
                style={[superHeroImageStyles.textStandBlock]}
            >
                {article.trail}
            </StandfirstText>
        </ItemTappable>
    )
}
const sportSuperStyles = StyleSheet.create({
    card: {
        backgroundColor: color.palette.highlight.main,
        flexGrow: 1,
    },
})
const SportSuper = ({ article, size, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }} hasPadding={false}>
            {'image' in article && article.image ? (
                <ImageResource
                    style={[superHeroImageStyles.image]}
                    image={article.image}
                />
            ) : null}
            <View style={sportSuperStyles.card}>
                <TextBlock
                    byline={article.byline}
                    style={[superHeroImageStyles.textBlock]}
                    kicker={article.kicker}
                    headline={article.headline}
                    monotone
                    {...{ size }}
                />
                <StandfirstText
                    allowFontScaling={false}
                    style={[
                        superHeroImageStyles.textStandBlock,
                        { color: color.text },
                    ]}
                >
                    {article.trail}
                </StandfirstText>
            </View>
        </ItemTappable>
    )
}

const opinionStyles = StyleSheet.create({
    block: {
        height: '33.333333%',
        overflow: 'hidden',
        ...tappablePadding,
    },
    topBlock: {
        paddingTop: tappablePadding.paddingVertical / 2,
    },
    titleText: {
        ...getFont('headline', 1.5, 'light'),
        color: color.textOverDarkBackground,
    },
    trailText: {
        ...getFont('headline', 1.25, 'light'),
        color: color.textOverDarkBackground,
    },
    bylineText: {
        ...getFont('headline', 1.5),
        fontFamily: getFont('titlepiece', 1.5).fontFamily,
    },
    cutout: {
        position: 'absolute',
        bottom: 0,
        right: -20,
        width: '65%',
    },
})
const OpinionSuper = ({ article, ...tappableProps }: PropTypes) => {
    const [colors] = useArticle()
    return (
        <ItemTappable {...tappableProps} {...{ article }} hasPadding={false}>
            <View
                style={[
                    opinionStyles.block,
                    opinionStyles.topBlock,
                    {
                        backgroundColor: colors.main,
                    },
                ]}
            >
                <TextWithIcon
                    unscaledFont={getUnscaledFont('headline', 1.5)}
                    style={opinionStyles.titleText}
                    icon={{
                        width: 35,
                        element: scale => (
                            <Quote
                                scale={0.9 / scale}
                                fill={opinionStyles.titleText.color}
                            />
                        ),
                    }}
                >
                    {article.headline}
                </TextWithIcon>
            </View>
            <View
                style={[
                    opinionStyles.block,
                    {
                        backgroundColor: colors.bright,
                    },
                ]}
            >
                {'trail' in article && article.trail ? (
                    <Text
                        style={opinionStyles.trailText}
                        allowFontScaling={false}
                    >
                        {article.trail}
                    </Text>
                ) : null}
            </View>
            <View
                style={[
                    opinionStyles.block,
                    {
                        backgroundColor: colors.faded,
                    },
                ]}
            >
                <Text
                    style={[opinionStyles.bylineText, { color: colors.main }]}
                >
                    {[
                        article.bylineImages &&
                            article.bylineImages.cutout &&
                            'by',
                        article.byline,
                    ]
                        .filter(Boolean)
                        .join(' ')}
                </Text>
                {article.bylineImages && article.bylineImages.cutout ? (
                    <View style={opinionStyles.cutout}>
                        <BylineCutout cutout={article.bylineImages.cutout} />
                    </View>
                ) : null}
            </View>
        </ItemTappable>
    )
}

const SuperHeroImageItem = (props: PropTypes) => {
    const [, { pillar }] = useArticle()
    if (pillar === 'opinion') {
        return <OpinionSuper {...props} />
    }
    if (pillar === 'sport') {
        return <SportSuper {...props} />
    }
    return <NormalSuper {...props} />
}

export { SuperHeroImageItem }
