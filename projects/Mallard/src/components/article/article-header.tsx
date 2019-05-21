import React from 'react'
import { View, StyleSheet } from 'react-native'
import { HeadlineText } from '../../components/styled-text'
import { metrics } from '../../theme/spacing'
import {
    useArticleAppearance,
    articleAppearances,
} from '../../theme/appearance'
import { ArticleImage } from './article-image'

type Style = {
    card: {}
    headline: {}
    plaque: {}
}

type PropTypes = {
    headline: string
    image?: string
}

const newsStyles: StyleSheet.NamedStyles<Style> = StyleSheet.create({
    card: {
        alignItems: 'flex-start',
        paddingHorizontal: metrics.horizontal,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingBottom: metrics.vertical,
        paddingTop: metrics.headerHeight,
        ...articleAppearances.default.cardAndPlaque,
    },
    plaque: {},
    headline: {
        marginRight: metrics.horizontal * 2,
        ...articleAppearances.default.headline,
    },
})

const NewsHeader = ({ headline, image }: PropTypes) => {
    const { appearance } = useArticleAppearance()
    return (
        <View style={[newsStyles.card, appearance.cardAndPlaque]}>
            {image && (
                <ArticleImage
                    style={{
                        aspectRatio: 1.5,
                        marginBottom: metrics.vertical / 2,
                    }}
                    image={image}
                />
            )}
            <HeadlineText style={[newsStyles.headline, appearance.headline]}>
                {headline}
            </HeadlineText>
        </View>
    )
}

const longReadStyles: StyleSheet.NamedStyles<Style> = StyleSheet.create({
    card: {
        flexShrink: 0,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        height: 500,
        ...articleAppearances.default.cardAndPlaque,
    },
    headline: {
        ...articleAppearances.default.headline,
    },
    plaque: {
        ...articleAppearances.default.cardAndPlaque,
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical / 2,
        marginEnd: metrics.horizontal * 2,
    },
})

const LongReadHeader = ({ headline, image }: PropTypes) => {
    const { appearance } = useArticleAppearance()
    return (
        <View style={[longReadStyles.card, appearance.cardAndPlaque]}>
            {image && (
                <ArticleImage
                    style={StyleSheet.absoluteFillObject}
                    image={image}
                />
            )}
            <View style={[longReadStyles.plaque, appearance.cardAndPlaque]}>
                <HeadlineText
                    style={[longReadStyles.headline, appearance.headline]}
                >
                    {headline}
                </HeadlineText>
            </View>
        </View>
    )
}

export { NewsHeader, LongReadHeader }
