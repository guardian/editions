import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { BylineCutout } from './helpers/opinion'
import Quote from 'src/components/icons/Quote'
import { useArticle } from 'src/hooks/use-article'
import { color } from 'src/theme/color'
import { getFont } from 'src/theme/typography'
import {
    ItemTappable,
    PropTypes,
    tappablePadding,
} from './helpers/item-tappable'
import { TextBlock } from './helpers/text-block'
import { Standfirst } from './helpers/standfirst'
import { metrics } from 'src/theme/spacing'
import { useIsOpinionCard } from './helpers/types'
import { PageLayoutSizes } from '../../../common'
import { TrailImageView } from './trail-image-view'
import { getImageHeight } from './helpers/sizes'

/*
SUPERHERO IMAGE ITEM
Text below image. To use in news & sport supers
*/
const superHeroImageStyles = StyleSheet.create({
    textBlock: {
        ...tappablePadding,
    },
    textStandBlock: {
        ...tappablePadding,
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
})

const NormalSuper = ({ article, size, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }} hasPadding={false}>
            <TrailImageView
                article={article}
                style={{ height: getImageHeight(size) }}
            />
            <TextBlock
                byline={article.byline}
                type={article.type}
                style={[superHeroImageStyles.textBlock]}
                kicker={article.kicker}
                headline={article.headline}
                {...{ size }}
            />
            <Standfirst
                style={[
                    superHeroImageStyles.textStandBlock,
                    size.layout === PageLayoutSizes.tablet && {
                        width: '80%',
                    },
                ]}
            >
                {article.trail}
            </Standfirst>
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
            <TrailImageView
                article={article}
                style={{ height: getImageHeight(size) }}
            />
            <TextBlock
                byline={article.byline}
                type={article.type}
                style={[superHeroImageStyles.textBlock]}
                kicker={article.kicker}
                headline={article.headline}
                {...{ size }}
            />
            <View
                style={[
                    superHeroImageStyles.textStandBlock,
                    sportSuperStyles.card,
                ]}
            >
                <Standfirst
                    style={[
                        size.layout === PageLayoutSizes.tablet && {
                            width: '80%',
                        },
                    ]}
                >
                    {article.trail}
                </Standfirst>
            </View>
        </ItemTappable>
    )
}

const opinionStyles = StyleSheet.create({
    block: {
        height: '33.333333%',
        overflow: 'hidden',
        ...tappablePadding,
        paddingRight: tappablePadding.padding * 2,
    },
    topBlock: {
        paddingTop: tappablePadding.paddingVertical / 2,
        height: '66.66666%',
    },
    titleText: {
        ...getFont('headline', 2.5, 'light'),
        paddingTop: metrics.vertical / 2,
        color: color.text,
    },
    trailText: {
        ...getFont('headline', 1.25, 'light'),
        color: color.textOverDarkBackground,
    },
    trailTextPadding: {
        paddingRight: '40%',
    },
    bylineText: {
        ...getFont('headline', 2.5),
        fontFamily: getFont('titlepiece', 2).fontFamily,
        color: color.textOverDarkBackground,
    },
    cutout: {
        position: 'absolute',
        bottom: 0,
        right: -20,
        width: '53%',
    },
    borderStyles: {
        borderTopColor: color.textOverDarkBackground,
        borderWidth: 0.5,
        borderColor: '#d6d7da',
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
                        backgroundColor: colors.faded,
                    },
                ]}
            >
                <View
                    style={{
                        height: 60,
                        marginLeft: -18,
                        marginBottom: -8,
                        alignItems: 'flex-start',
                        justifyContent: 'flex-end',
                    }}
                >
                    <Quote scale={2} fill={colors.main} />
                </View>
                <Text style={opinionStyles.titleText}>{article.headline}</Text>

                <Text
                    style={[opinionStyles.bylineText, { color: colors.main }]}
                >
                    {article.byline}
                </Text>
            </View>
            <View
                style={[
                    opinionStyles.block,
                    {
                        backgroundColor: colors.main,
                    },
                ]}
            >
                <Text
                    style={[
                        opinionStyles.trailText,
                        article.bylineImages &&
                            article.bylineImages.cutout &&
                            opinionStyles.trailTextPadding,
                    ]}
                    allowFontScaling={false}
                >
                    {article.trail}
                </Text>
            </View>
            {article.bylineImages && article.bylineImages.cutout ? (
                <View style={opinionStyles.cutout}>
                    <BylineCutout cutout={article.bylineImages.cutout} />
                </View>
            ) : null}
        </ItemTappable>
    )
}

const SuperHeroImageItem = (props: PropTypes) => {
    const [, { pillar }] = useArticle()
    if (useIsOpinionCard()) {
        return <OpinionSuper {...props} />
    }
    if (pillar === 'sport') {
        return <SportSuper {...props} />
    }
    return <NormalSuper {...props} />
}

export { SuperHeroImageItem }
