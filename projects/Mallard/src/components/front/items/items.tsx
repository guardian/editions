import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { HeadlineCardText } from 'src/components/styled-text'
import { useArticle } from 'src/hooks/use-article'
import { metrics } from 'src/theme/spacing'
import {
    ItemSizes,
    PageLayoutSizes,
    getPageLayoutSizeXY,
} from '../helpers/helpers'
import { ImageResource } from '../image-resource'
import {
    ItemTappable,
    PropTypes,
    tappablePadding,
} from './helpers/item-tappable'
import { TextBlock } from './helpers/text-block'
import { SuperHeroImageItem } from './super-items'
import { SportItemBackground } from './helpers/sports'

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

export const isFullWidthItem = (size: ItemSizes) => {
    const { width } = getPageLayoutSizeXY(size.layout)
    return size.story.width >= width
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

const CoverItem = ({ article, size, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            <View style={coverStyles.cover}>
                {'image' in article && article.image ? (
                    <ImageResource
                        style={coverStyles.cover}
                        image={article.image}
                    />
                ) : null}
                <TextBlock
                    byline={article.byline}
                    kicker={article.kicker}
                    headline={article.headline}
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
        paddingTop: metrics.vertical / 2,
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
                    style={[
                        imageStyles.image,
                        { height: getImageHeight(size) },
                    ]}
                    image={article.image}
                />
            ) : null}
            {pillar === 'sport' && isFullWidthItem(size) ? (
                <SportItemBackground
                    style={{
                        paddingHorizontal: tappablePadding.padding,
                        marginBottom: tappablePadding.paddingVertical,
                    }}
                >
                    <TextBlock
                        style={imageStyles.textBlock}
                        size={size}
                        monotone={true}
                        {...article}
                    />
                </SportItemBackground>
            ) : (
                <TextBlock
                    style={imageStyles.textBlock}
                    size={size}
                    {...article}
                />
            )}
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
        marginLeft: metrics.horizontal,
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

const SplitImageItem = ({ article, size, ...tappableProps }: PropTypes) => {
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

const SplashImageItem = ({ article, ...tappableProps }: PropTypes) => {
    if (!article.image)
        return <SuperHeroImageItem {...tappableProps} {...{ article }} />
    return (
        <ItemTappable {...tappableProps} {...{ article }} hasPadding={false}>
            <ImageResource
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
