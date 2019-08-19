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
    getItemRectanglePerc,
    useCardBackgroundStyle,
    ItemSizes,
    PageLayoutSizes,
    toPercentage,
} from '../helpers/helpers'
import {
    setScreenPositionOfItem,
    getScreenPositionOfItem,
    setScreenPositionFromView,
} from 'src/helpers/positions'
import { getScaleForArticle } from 'src/navigation/interpolators'
import { color } from 'src/theme/color'
import { navigateToArticle } from 'src/navigation/helpers'
import { getFont } from 'src/theme/typography'
import { ImageResource } from '../image-resource'

interface TappablePropTypes {
    style?: StyleProp<ViewStyle>
    article: CAPIArticle
    path: PathToArticle
    articleNavigator: ArticleNavigator
}

export interface PropTypes extends TappablePropTypes {
    size: ItemSizes
    issueID: string
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
})

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

const ImageItem = ({ article, issueID, size, ...tappableProps }: PropTypes) => {
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
