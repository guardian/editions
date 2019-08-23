import React from 'react'
import { StyleSheet, View, Text, Image } from 'react-native'
import { HeadlineCardText, StandfirstText } from 'src/components/styled-text'
import { useArticle } from 'src/hooks/use-article'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont, getUnscaledFont } from 'src/theme/typography'
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
    PropTypes,
} from './base/item-tappable'
import { TextBlock } from './base/text-block'
import { TextWithIcon } from 'src/components/layout/text-with-icon'
import Quote from 'src/components/icons/Quote'
import { imagePath } from 'src/paths'
import { BylineCutout } from 'src/components/article/article-header/opinion-header'
import { SuperHeroImageItem } from './super-items'

/*
helpers
*/
export const getImageHeight = ({ story, layout }: ItemSizes) => {
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

export const isSmallItem = (size: ItemSizes) => {
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
                    byline={article.byline}
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
                byline={article.byline}
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
                byline={article.byline}
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
                    byline={article.byline}
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
SPLASH ITEM
Image only
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
                byline={article.byline}
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
                byline={article.byline}
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
