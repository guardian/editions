import React, { ReactNode, useRef, useCallback } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle, Image } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'
import { Highlight } from '../../highlight'

import { useArticleAppearance } from 'src/theme/appearance'
import { Article } from 'src/common'
import {
    PathToArticle,
    ArticleTransitionProps,
} from 'src/screens/article-screen'

import { TextBlock } from './text-block'
import { StandfirstText, HeadlineText } from 'src/components/styled-text'
import { RowSize, getRowHeightForSize } from '../helpers'
import {
    setScreenPositionOfItem,
    getScreenPositionOfItem,
} from 'src/helpers/positions'
import { getScaleForArticle } from 'src/navigation/interpolators'

interface TappablePropTypes {
    style: StyleProp<ViewStyle>
    article: Article
    path: PathToArticle
}

export interface PropTypes extends TappablePropTypes {
    size: RowSize
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

const ItemTappable = withNavigation(
    ({
        children,
        style,
        article,
        path,
        navigation,
        hasPadding,
    }: {
        children: ReactNode
        hasPadding?: boolean
    } & TappablePropTypes &
        NavigationInjectedProps) => {
        const { appearance } = useArticleAppearance()
        const tappableRef = useRef<View>()

        const measure = useCallback(() => {
            if (tappableRef.current) {
                tappableRef.current.measureInWindow((x, y, width, height) => {
                    setScreenPositionOfItem(article.key, {
                        x,
                        y,
                        width,
                        height,
                    })
                })
            }
        }, [article.key])

        return (
            <View
                style={style}
                ref={(view: View) => (tappableRef.current = view)}
                onLayout={ev => {
                    setScreenPositionOfItem(article.key, ev.nativeEvent.layout)
                    measure()
                }}
                onTouchStart={() => {
                    measure()
                }}
            >
                <Highlight
                    onPress={() => {
                        const { width, height } = getScreenPositionOfItem(
                            article.key,
                        )
                        const transitionProps: ArticleTransitionProps = {
                            startAtHeightFromFrontsItem:
                                height / getScaleForArticle(width),
                        }
                        navigation.navigate('Article', {
                            article,
                            path,
                            transitionProps,
                        })
                    }}
                >
                    <View
                        style={[
                            tappableStyles.root,
                            hasPadding && tappableStyles.padding,
                            appearance.backgrounds,
                            appearance.cardBackgrounds,
                        ]}
                    >
                        {children}
                    </View>
                </Highlight>
            </View>
        )
    },
)
ItemTappable.defaultProps = {
    hasPadding: true,
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

const CoverItem = ({ style, article, path, size }: PropTypes) => {
    return (
        <ItemTappable {...{ style, article, path }}>
            <View style={coverStyles.cover}>
                <Image
                    style={coverStyles.cover}
                    source={{
                        uri: article.image,
                    }}
                />
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

const ImageItem = ({ style, article, path, size }: PropTypes) => {
    return (
        <ItemTappable {...{ style, article, path }}>
            <Image
                style={[
                    imageStyles.image,
                    size >= RowSize.hero && imageStyles.heroImage,
                ]}
                source={{
                    uri: article.image,
                }}
            />
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
    }
})

const SplitImageItem = ({ style, article, path, size }: PropTypes) => {
    return (
        <ItemTappable {...{ style, article, path }}>
            <View style={splitImageStyles.card}>
              <TextBlock
                  style={splitImageStyles.textBlock}
                  kicker={article.kicker}
                  headline={article.headline}
                  {...{ size }}
              />
              <Image
                  style={[
                      splitImageStyles.image,
                  ]}
                  source={{
                      uri: article.image,
                  }}
              />
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
        height: getRowHeightForSize(RowSize.hero),
    },
    textBlock: {
        ...tappableStyles.padding,
    },
    textStandBlock: {
        ...tappableStyles.padding,
        fontSize: 14,
        lineHeight: 18,
        color: '#6B6666',
        position: 'absolute',
        bottom: 0,

    }
})

const SuperHeroImageItem = ({ style, article, path, size }: PropTypes) => {
    return (
        <ItemTappable {...{ article, path, style }} hasPadding={false}>
            <Image
                style={[superHeroImageStyles.image]}
                source={{
                    uri: article.image,
                }}
            />
            <TextBlock
                style={[superHeroImageStyles.textBlock]}
                kicker={article.kicker}
                headline={article.headline}
                {...{ size }}
            />
            <StandfirstText
                style={[superHeroImageStyles.textStandBlock]}
            >{article.standfirst}</StandfirstText>
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
    textBlock: {
        fontSize:40,
        lineHeight: 30,
        color:'#ffffff',
    },
    splashHeadline: {
      position: 'absolute',
      bottom: 0,
      flex: 0,
      zIndex: 10000,
      width: '50%',
      color:'#ffffff',
    },
    textStandBlock: {
        ...tappableStyles.padding,
        fontSize: 14,
        lineHeight: 18,
        color: '#fff',
    }
})

const SplashImageItem = ({ style, article, path, size }: PropTypes) => {
    return (
        <ItemTappable {...{ article, path, style }} hasPadding={false}>
            <Image
                style={[splashImageStyles.image]}
                source={{
                    uri: article.image,
                }}
            />
            <View style={[splashImageStyles.splashHeadline]}>
              <StandfirstText
                  style={[splashImageStyles.textBlock]}
              >{article.kicker}</StandfirstText>
              <StandfirstText
                  style={[splashImageStyles.textStandBlock]}
              >{article.standfirst}</StandfirstText>
            </View>
        </ItemTappable>
    )
}

const SmallItem = ({ style, article, path, size }: PropTypes) => {
    return (
        <ItemTappable {...{ style, article, path }}>
            <TextBlock
                kicker={article.kicker}
                headline={article.headline}
                {...{ size }}
            />
        </ItemTappable>
    )
}

export {SplashImageItem, SuperHeroImageItem, ImageItem, SplitImageItem, SmallItem, CoverItem }
