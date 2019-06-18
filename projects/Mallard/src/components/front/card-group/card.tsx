import React, { ReactNode } from 'react'
import { View, StyleSheet, StyleProp, ViewStyle, Image } from 'react-native'
import { metrics } from '../../../theme/spacing'
import { withNavigation, NavigationInjectedProps } from 'react-navigation'
import { Highlight } from '../../highlight'

import { useArticleAppearance } from '../../../theme/appearance'
import { FrontArticle } from '../../../common'

import { TextBlock } from './text-block'
import { Size } from './row'

interface PropTypes {
    style: StyleProp<ViewStyle>
    article: FrontArticle
    path: FrontArticle['path']
}

/*
TAPPABLE
This just wraps every card to make it tappable
*/
const tappableStyles = StyleSheet.create({
    root: {
        padding: metrics.horizontal / 2,
        paddingVertical: metrics.vertical / 2,
        flexGrow: 1,
        flexShrink: 0,
        flexBasis: '100%',
    },
})

const CardTappable = withNavigation(
    ({
        children,
        style,
        article,
        path,
        navigation,
    }: {
        children: ReactNode
    } & PropTypes &
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

const CoverCard = ({ style, article, path }: PropTypes) => {
    return (
        <CardTappable {...{ style, article, path }}>
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
        </CardTappable>
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

const ImageCard = ({ style, article, path }: PropTypes) => {
    return (
        <CardTappable {...{ style, article, path }}>
            <Image
                style={imageStyles.image}
                source={{
                    uri: article.image,
                }}
            />
            <TextBlock
                style={style.textBlock}
                kicker={article.kicker}
                headline={article.headline}
            />
        </CardTappable>
    )
}

const SmallCard = ({ style, article, path }: PropTypes) => {
    return (
        <CardTappable {...{ style, article, path }}>
            <TextBlock kicker={article.kicker} headline={article.headline} />
        </CardTappable>
    )
}

const Card = ({ size, ...props }: { size: Size } & PropTypes) => {
    /* this chooses the card type for us based on ummm MAGIC? */
    return size >= Size.hero ? (
        <CoverCard {...props} />
    ) : size >= Size.half ? (
        <ImageCard {...props} />
    ) : (
        <SmallCard {...props} />
    )
}
export { Card }
