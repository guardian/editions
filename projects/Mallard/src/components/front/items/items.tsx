import React from 'react'
import { StyleSheet, View } from 'react-native'
import { HeadlineCardText, StandfirstText } from 'src/components/styled-text'
import { useArticle } from 'src/hooks/use-article'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import {
    getItemRectanglePerc,
    ItemSizes,
    PageLayoutSizes,
    toPercentage,
} from '../helpers/helpers'
import { ImageResource } from '../image-resource'
import {
    ItemTappable,
    TappablePropTypes,
    tappablePadding,
} from './item-tappable'
import { TextBlock } from './text-block'

export interface PropTypes extends TappablePropTypes {
    size: ItemSizes
    issueID: string
}

/*
helpers
*/
const getImageHeight = ({ story, layout }: ItemSizes) => {
    if (layout === PageLayoutSizes.tablet) {
        if (story.height >= 4) {
            return '50%'
        }
        if (story.height >= 3) {
            return '66.66%'
        }
        if (story.height >= 2) {
            return '50%'
        }
        return '75.5%'
    }
    if (layout === PageLayoutSizes.mobile) {
        if (story.height > 4) {
            return '75.5%'
        }
        return '50%'
    }
}

const isSmallItem = (size: ItemSizes) => {
    return size.story.width <= 1
}

/*
COVER ITEM
Text over image. To use in lifestyle & art heros
*/
const coverStyles = StyleSheet.create({
    cover: {
        width: '100%',
        height: '100%',
        flex: 1,
    },
    text: {
        width: '50%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        top: '50%',
        paddingTop: metrics.vertical / 3,
    },
})

const CoverItem = ({ article, issueID, size, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            <View style={coverStyles.cover}>
                {'image' in article && article.image ? (
                    <ImageResource
                        issueID={issueID}
                        style={coverStyles.cover}
                        image={article.image}
                    />
                ) : null}
                <TextBlock
                    kicker={article.kicker}
                    headline={article.headline}
                    textBlockAppearance={'pillarColor'}
                    style={coverStyles.text}
                    {...{ size }}
                />
            </View>
        </ItemTappable>
    )
}

/*
IMAGE ITEM
Text below image. To use in most heros
*/
const imageStyles = StyleSheet.create({
    image: {
        width: '100%',
        flex: 0,
    },
    textBlock: {
        paddingTop: metrics.vertical / 3,
    },
    roundImage: {
        width: '75%',
        aspectRatio: 1,
        borderRadius: 999999,
        position: 'absolute',
        right: tappablePadding.padding,
        bottom: tappablePadding.paddingVertical * 2,
    },
})

const ImageItem = ({ article, issueID, size, ...tappableProps }: PropTypes) => {
    const [, { pillar }] = useArticle()
    if (pillar === 'opinion' && isSmallItem(size)) {
        return (
            <RoundImageItem {...{ article, issueID, size, ...tappableProps }} />
        )
    }
    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            {'image' in article && article.image ? (
                <ImageResource
                    issueID={issueID}
                    style={[
                        imageStyles.image,
                        { height: getImageHeight(size) },
                    ]}
                    image={article.image}
                />
            ) : null}
            <TextBlock
                style={imageStyles.textBlock}
                kicker={article.kicker}
                headline={article.headline}
                {...{ size }}
            />
        </ItemTappable>
    )
}
const RoundImageItem = ({
    article,
    issueID,
    size,
    ...tappableProps
}: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            <TextBlock
                kicker={article.kicker}
                headline={article.headline}
                {...{ size }}
            />
            {'image' in article && article.image ? (
                <ImageResource
                    issueID={issueID}
                    style={[imageStyles.roundImage]}
                    image={article.image}
                />
            ) : null}
        </ItemTappable>
    )
}

/*
IMAGE SPLIT
Text below image. To use in most heros
*/

const splitImageStyles = StyleSheet.create({
    image: {
        width: '50%',
        height: '100%',
        flex: 0,
    },
    wideImage: {
        width: '33.33333%',
    },
    card: {
        flexDirection: 'row',
        height: '100%',
    },
    textBlock: {
        flex: 1,
    },
})

const SplitImageItem = ({
    article,
    issueID,
    size,
    ...tappableProps
}: PropTypes) => {
    return (
        <ItemTappable {...{ article }} {...tappableProps}>
            <View style={splitImageStyles.card}>
                <TextBlock
                    style={splitImageStyles.textBlock}
                    kicker={article.kicker}
                    headline={article.headline}
                    {...{ size }}
                />
                {'image' in article && article.image ? (
                    <ImageResource
                        issueID={issueID}
                        style={[splitImageStyles.image]}
                        image={article.image}
                    />
                ) : null}
            </View>
        </ItemTappable>
    )
}

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

const SuperHeroImageItem = ({
    article,
    issueID,
    size,
    ...tappableProps
}: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }} hasPadding={false}>
            {'image' in article && article.image ? (
                <ImageResource
                    issueID={issueID}
                    style={[superHeroImageStyles.image]}
                    image={article.image}
                />
            ) : null}
            <TextBlock
                style={[superHeroImageStyles.textBlock]}
                kicker={article.kicker}
                headline={article.headline}
                {...{ size }}
            />
            {'trail' in article && article.trail ? (
                <StandfirstText
                    allowFontScaling={false}
                    style={[superHeroImageStyles.textStandBlock]}
                >
                    {article.trail}
                </StandfirstText>
            ) : null}
        </ItemTappable>
    )
}

/*
SUPERHERO IMAGE ITEM
Text below image. To use in news & sport supers
*/
const splashImageStyles = StyleSheet.create({
    image: {
        width: 'auto',
        flex: 0,
        height: '100%',
    },
    hidden: {
        opacity: 0,
    },
})

const SplashImageItem = ({ article, issueID, ...tappableProps }: PropTypes) => {
    if (!article.image)
        return (
            <SuperHeroImageItem {...tappableProps} {...{ article, issueID }} />
        )
    return (
        <ItemTappable {...tappableProps} {...{ article }} hasPadding={false}>
            <ImageResource
                issueID={issueID}
                style={[splashImageStyles.image]}
                image={article.image}
            />
            <HeadlineCardText style={[splashImageStyles.hidden]}>
                {article.kicker}
            </HeadlineCardText>
        </ItemTappable>
    )
}

const SmallItem = ({ article, size, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            <TextBlock
                kicker={article.kicker}
                headline={article.headline}
                {...{ size }}
            />
        </ItemTappable>
    )
}

const SmallItemLargeText = ({ article, size, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            <TextBlock
                kicker={article.kicker}
                headline={article.headline}
                fontSize={1.25}
            />
        </ItemTappable>
    )
}

export {
    SplashImageItem,
    SuperHeroImageItem,
    ImageItem,
    SplitImageItem,
    SmallItem,
    SmallItemLargeText,
    CoverItem,
}
