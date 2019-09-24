import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useArticle } from 'src/hooks/use-article'
import { metrics } from 'src/theme/spacing'
import { ImageResource } from '../image-resource'
import {
    ItemTappable,
    PropTypes,
    tappablePadding,
} from './helpers/item-tappable'
import {
    getImageHeight,
    isFullWidthItem,
    isSmallItem,
    isFullHeightItem,
} from './helpers/sizes'
import { SportItemBackground } from './helpers/sports'
import { TextBlock } from './helpers/text-block'
import { SmallItem } from './small-items'
import { Standfirst } from './helpers/standfirst'
import { useIsOpinionCard, useIsSportCard } from './helpers/types'

/*
Normal img on top + text
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
    standfirst: {
        ...tappablePadding,
        position: 'absolute',
        bottom: 0,
    },
})

const ImageItem = ({ article, size, ...tappableProps }: PropTypes) => {
    if (useIsOpinionCard() && isSmallItem(size)) {
        return <RoundImageItem {...{ article, size, ...tappableProps }} />
    }
    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            {'trailImage' in article && article.trailImage ? (
                <ImageResource
                    style={[
                        imageStyles.image,
                        { height: getImageHeight(size) },
                    ]}
                    image={article.trailImage}
                />
            ) : null}
            {useIsSportCard() && isFullWidthItem(size) ? (
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
            {isFullHeightItem(size) && (
                <Standfirst style={imageStyles.standfirst}>
                    {article.trail}
                </Standfirst>
            )}
        </ItemTappable>
    )
}
/*
The opinion cards with tha circles
*/
const RoundImageItem = ({ article, size, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            <TextBlock
                byline={article.byline}
                kicker={article.kicker}
                headline={article.headline}
                {...{ size }}
            />
            {'bylineImages' in article &&
            article.bylineImages &&
            article.bylineImages.cutout ? (
                <ImageResource
                    style={[imageStyles.roundImage]}
                    image={article.bylineImages.cutout}
                />
            ) : null}
        </ItemTappable>
    )
}

const squareStyles = StyleSheet.create({
    square: {
        position: 'absolute',
        top: '50%',
        right: '50%',
        left: 0,
        bottom: 0,
        ...tappablePadding,
    },
    cover: {
        flexGrow: 1,
        marginBottom: tappablePadding.paddingVertical,
    },
})

/*
A smaller hero
*/
const SidekickImageItem = ({ article, size, ...tappableProps }: PropTypes) => {
    const [colors, { pillar }] = useArticle()
    if (!article.trailImage) {
        return <SmallItem {...{ article, size, ...tappableProps }} />
    }
    if (pillar === 'sport') {
        return <ImageItem {...{ article, size, ...tappableProps }}></ImageItem>
    }

    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            <View style={squareStyles.cover}>
                <ImageResource
                    style={[StyleSheet.absoluteFill]}
                    image={article.trailImage}
                />
                <View
                    style={[
                        squareStyles.square,
                        { backgroundColor: colors.main },
                    ]}
                >
                    <TextBlock
                        byline={article.byline}
                        kicker={article.kicker}
                        headline={article.headline}
                        inverted
                        monotone
                        size={{
                            ...size,
                            story: {
                                ...size.story,
                                width: size.story.width / 2,
                                height: size.story.width / 2,
                            },
                        }}
                    />
                </View>
            </View>
        </ItemTappable>
    )
}

/*
50-50 split
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
                {'trailImage' in article && article.trailImage ? (
                    <ImageResource
                        style={[splitImageStyles.image]}
                        image={article.trailImage}
                    />
                ) : null}
            </View>
        </ItemTappable>
    )
}
export { ImageItem, SplitImageItem, SmallItem, SidekickImageItem }
