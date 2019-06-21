import React, { ReactNode } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle, Image } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'
import { Highlight } from '../../highlight'

import { useArticleAppearance } from 'src/theme/appearance'
import { Article } from 'src/common'
import { PathToArticle } from 'src/screens/article-screen'

import { TextBlock } from './text-block'
import { RowSize, getRowHeightForSize } from '../helpers'

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
        return (
            <View style={style}>
                <Highlight
                    onPress={() => {
                        navigation.navigate('Article', {
                            article,
                            path,
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
COVER CARD
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

const CoverItem = ({ style, article, path }: PropTypes) => {
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
                />
            </View>
        </ItemTappable>
    )
}

const imageStyles = StyleSheet.create({
    image: {
        width: '100%',
        flex: 1,
    },
    textBlock: {
        paddingTop: metrics.vertical / 3,
    },
})

const ImageItem = ({ style, article, path }: PropTypes) => {
    return (
        <ItemTappable {...{ style, article, path }}>
            <Image
                style={imageStyles.image}
                source={{
                    uri: article.image,
                }}
            />
            <TextBlock
                style={imageStyles.textBlock}
                kicker={article.kicker}
                headline={article.headline}
            />
        </ItemTappable>
    )
}

const superHeroImageStyles = StyleSheet.create({
    image: {
        width: '100%',
        flex: 0,
        height: getRowHeightForSize(RowSize.hero),
    },
    textBlock: {
        ...tappableStyles.padding,
    },
})

const SuperHeroImageItem = ({ style, article, path }: PropTypes) => {
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
            />
        </ItemTappable>
    )
}

const SmallItem = ({ style, article, path }: PropTypes) => {
    return (
        <ItemTappable {...{ style, article, path }}>
            <TextBlock kicker={article.kicker} headline={article.headline} />
        </ItemTappable>
    )
}

export { SuperHeroImageItem, ImageItem, SmallItem, CoverItem }
