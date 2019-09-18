import React from 'react'
import { StyleSheet, View } from 'react-native'
import { HeadlineCardText } from 'src/components/styled-text'
import { metrics } from 'src/theme/spacing'
import { ImageResource } from '../image-resource'
import { ItemTappable, PropTypes } from './helpers/item-tappable'
import { TextBlock } from './helpers/text-block'
import { ImageItem, SplitImageItem, SidekickImageItem } from './image-items'
import { SmallItem, SmallItemLargeText } from './small-items'
import { SuperHeroImageItem } from './super-items'
import { WithBreakpoints } from 'src/components/layout/ui/sizing/with-breakpoints'
import { Breakpoints } from 'src/theme/breakpoints'
import { Image } from '../../../../../common/src'

/*
helpers
*/

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
    if (!article.cardImage || !article.cardImageTablet)
        return <SuperHeroImageItem {...tappableProps} {...{ article }} />

    const cardImage: Image = {
        source: (article.cardImage && article.cardImage.source) || '',
        path: (article.cardImage && article.cardImage.path) || '',
    }

    const cardImageTablet: Image = {
        source:
            (article.cardImageTablet && article.cardImageTablet.source) || '',
        path: (article.cardImageTablet && article.cardImageTablet.path) || '',
    }

    return (
        <WithBreakpoints>
            {{
                0: ({ width }) => (
                    <ItemTappable
                        {...tappableProps}
                        {...{ article }}
                        hasPadding={false}
                    >
                        <ImageResource
                            style={[splashImageStyles.image]}
                            image={cardImage}
                        />
                        <HeadlineCardText style={[splashImageStyles.hidden]}>
                            {article.kicker}
                        </HeadlineCardText>
                    </ItemTappable>
                ),
                [Breakpoints.tabletVertical]: () => (
                    <ItemTappable
                        {...tappableProps}
                        {...{ article }}
                        hasPadding={false}
                    >
                        <ImageResource
                            style={[splashImageStyles.image]}
                            image={cardImageTablet}
                        />
                        <HeadlineCardText style={[splashImageStyles.hidden]}>
                            {article.kicker}
                        </HeadlineCardText>
                    </ItemTappable>
                ),
            }}
        </WithBreakpoints>
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
    SidekickImageItem,
}
