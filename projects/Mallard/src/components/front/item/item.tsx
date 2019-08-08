import React, { ReactNode, useRef, useState } from 'react'
import {
    View,
    StyleSheet,
    StyleProp,
    ViewStyle,
    Image,
    Animated,
    Easing,
    TouchableWithoutFeedback,
} from 'react-native'
import { metrics } from 'src/theme/spacing'
import {
    withNavigation,
    NavigationInjectedProps,
    NavigationEvents,
    AnimatedValue,
} from 'react-navigation'

import { CAPIArticle } from 'src/common'
import {
    PathToArticle,
    ArticleTransitionProps,
    ArticleNavigator,
} from 'src/screens/article-screen'

import { TextBlock } from './text-block'
import { StandfirstText, HeadlineCardText } from 'src/components/styled-text'
import {
    getItemPosition,
    useCardBackgroundStyle,
    ItemSizes,
    PageLayoutSizes,
} from '../helpers'
import {
    setScreenPositionOfItem,
    getScreenPositionOfItem,
    setScreenPositionFromView,
} from 'src/helpers/positions'
import { getScaleForArticle } from 'src/navigation/interpolators'
import { color } from 'src/theme/color'
import { navigateToArticle } from 'src/navigation/helpers'
import { APIPaths } from 'src/paths'
import { getFont } from 'src/theme/typography'

interface TappablePropTypes {
    style?: StyleProp<ViewStyle>
    article: CAPIArticle
    path: PathToArticle
    articleNavigator: ArticleNavigator
}

export interface PropTypes extends TappablePropTypes {
    size: ItemSizes
}

/*
TAPPABLE
This just wraps every card to make it tappable
*/
const tappableStyles = StyleSheet.create({
    root: {
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: '100%',
    },
    padding: {
        padding: metrics.horizontal / 2,
        paddingVertical: metrics.vertical / 2,
    },
})

/*
To help smooth out the transition
we fade the card contents out on tap
and then back in when the view regains focus
*/
const fade = (opacity: AnimatedValue, direction: 'in' | 'out') =>
    direction === 'in'
        ? Animated.timing(opacity, {
              duration: 250,
              delay: 250,
              toValue: 1,
              easing: Easing.linear,
              useNativeDriver: true,
          }).start()
        : Animated.timing(opacity, {
              duration: 250,
              toValue: 0,
              useNativeDriver: true,
          }).start()

const ItemTappable = withNavigation(
    ({
        children,
        articleNavigator,
        style,
        article,
        path,
        navigation,
        hasPadding = true,
    }: {
        children: ReactNode
        hasPadding?: boolean
    } & TappablePropTypes &
        NavigationInjectedProps) => {
        const tappableRef = useRef<View>()
        const [opacity] = useState(() => new Animated.Value(1))
        return (
            <Animated.View
                style={[style, { opacity }]}
                ref={(view: any) => {
                    if (view) tappableRef.current = view._component as View
                }}
                onLayout={(ev: any) => {
                    setScreenPositionOfItem(article.key, ev.nativeEvent.layout)
                    tappableRef.current &&
                        setScreenPositionFromView(
                            article.key,
                            tappableRef.current,
                        )
                }}
                onTouchStart={() => {
                    tappableRef.current &&
                        setScreenPositionFromView(
                            article.key,
                            tappableRef.current,
                        )
                }}
            >
                <NavigationEvents
                    onWillFocus={() => {
                        fade(opacity, 'in')
                    }}
                />

                <TouchableWithoutFeedback
                    onPress={() => {
                        const { width, height } = getScreenPositionOfItem(
                            article.key,
                        )
                        const transitionProps: ArticleTransitionProps = {
                            startAtHeightFromFrontsItem:
                                height / getScaleForArticle(width),
                        }
                        fade(opacity, 'out')
                        navigateToArticle(navigation, {
                            path,
                            transitionProps,
                            articleNavigator,
                            prefersFullScreen: article.type === 'crossword',
                        })
                    }}
                >
                    <View
                        style={[
                            tappableStyles.root,
                            hasPadding && tappableStyles.padding,
                            useCardBackgroundStyle(),
                        ]}
                    >
                        {children}
                    </View>
                </TouchableWithoutFeedback>
            </Animated.View>
        )
    },
)

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
                    <Image
                        style={coverStyles.cover}
                        source={{
                            uri: `${APIPaths.mediaBackend}${APIPaths.media(
                                'article',
                                'phone',
                                article.image.source,
                                article.image.path,
                            )}`,
                        }}
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
        height: '50%',
        flex: 0,
    },
    heroImage: {
        height: '75%',
    },
    textBlock: {
        paddingTop: metrics.vertical / 3,
    },
})

const isHeroImage = ({ story, layout }: ItemSizes) => {
    return layout === PageLayoutSizes.tablet
        ? story.height > 2
        : story.height > 4
}

const ImageItem = ({ article, size, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }}>
            {'image' in article && article.image ? (
                <Image
                    style={[
                        imageStyles.image,
                        isHeroImage(size) && imageStyles.heroImage,
                    ]}
                    source={{
                        uri: `${APIPaths.mediaBackend}${APIPaths.media(
                            'issue',
                            'phone',
                            article.image.source,
                            article.image.path,
                        )}`,
                    }}
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

/*
IMAGE SPLIT
Text below image. To use in most heros
*/

const splitImageStyles = StyleSheet.create({
    image: {
        width: '50%',
        height: '100%',
        flex: 0.5,
    },
    card: {
        flexDirection: 'row',
        height: '100%',
    },
    textBlock: {
        flex: 0.5,
    },
})

const SplitImageItem = ({ article, size, ...tappableProps }: PropTypes) => {
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
                    <Image
                        style={[splitImageStyles.image]}
                        source={{
                            uri: `${APIPaths.mediaBackend}${APIPaths.media(
                                'issue',
                                'phone',
                                article.image.source,
                                article.image.path,
                            )}`,
                        }}
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
        height: getItemPosition(
            { width: 2, height: 4, top: 0, left: 0 },
            PageLayoutSizes.mobile,
        ).height,
    },
    textBlock: {
        ...tappableStyles.padding,
    },
    textStandBlock: {
        ...tappableStyles.padding,
        ...getFont('text', 0.9),
        color: color.palette.neutral[46],
        position: 'absolute',
        bottom: 0,
    },
})

const SuperHeroImageItem = ({ article, size, ...tappableProps }: PropTypes) => {
    return (
        <ItemTappable {...tappableProps} {...{ article }} hasPadding={false}>
            {'image' in article && article.image ? (
                <Image
                    style={[superHeroImageStyles.image]}
                    source={{
                        uri: `${APIPaths.mediaBackend}${APIPaths.media(
                            'issue',
                            'phone',
                            article.image.source,
                            article.image.path,
                        )}`,
                    }}
                />
            ) : null}
            <TextBlock
                style={[superHeroImageStyles.textBlock]}
                kicker={article.kicker}
                headline={article.headline}
                {...{ size }}
            />
            {'trail' in article && article.trail ? (
                <StandfirstText style={[superHeroImageStyles.textStandBlock]}>
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

const SplashImageItem = ({ article, ...tappableProps }: PropTypes) => {
    if (!article.image)
        return <SuperHeroImageItem {...tappableProps} {...{ article }} />
    return (
        <ItemTappable {...tappableProps} {...{ article }} hasPadding={false}>
            <Image
                style={[splashImageStyles.image]}
                source={{
                    uri: `${APIPaths.mediaBackend}${APIPaths.media(
                        'issue',
                        'phone',
                        article.image.source,
                        article.image.path,
                    )}`,
                }}
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

export {
    SplashImageItem,
    SuperHeroImageItem,
    ImageItem,
    SplitImageItem,
    SmallItem,
    CoverItem,
}
