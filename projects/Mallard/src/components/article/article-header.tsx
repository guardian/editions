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
    background: {}
    headline: {}
    textBackground: {}
}

type PropTypes = {
    headline: string
    image?: string | null
}

const newsHeaderStyles: StyleSheet.NamedStyles<Style> = StyleSheet.create({
    background: {
        alignItems: 'flex-start',
        paddingHorizontal: metrics.horizontal,
        borderBottomWidth: StyleSheet.hairlineWidth,
        paddingBottom: metrics.vertical,
        paddingTop: metrics.headerHeight,
        ...articleAppearances.default.backgrounds,
    },
    textBackground: {},
    headline: {
        marginRight: metrics.horizontal * 2,
        ...articleAppearances.default.headline,
    },
})

const NewsHeader = ({ headline, image }: PropTypes) => {
    const { appearance } = useArticleAppearance()
    return (
        <View style={[newsHeaderStyles.background, appearance.backgrounds]}>
            {image && (
                <ArticleImage
                    style={{
                        aspectRatio: 1.5,
                        marginBottom: metrics.vertical / 2,
                    }}
                    image={image}
                />
            )}
            <HeadlineText
                style={[
                    newsHeaderStyles.headline,
                    appearance.text,
                    appearance.headline,
                ]}
            >
                {headline}
            </HeadlineText>
        </View>
    )
}

const longReadHeaderStyles: StyleSheet.NamedStyles<Style> = StyleSheet.create({
    background: {
        flexShrink: 0,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        height: 500,
        ...articleAppearances.default.backgrounds,
    },
    headline: {
        ...articleAppearances.default.headline,
    },
    textBackground: {
        ...articleAppearances.default.backgrounds,
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical / 2,
        marginEnd: metrics.horizontal * 2,
    },
})

const LongReadHeader = ({ headline, image }: PropTypes) => {
    const { appearance } = useArticleAppearance()
    return (
        <View style={[longReadHeaderStyles.background, appearance.backgrounds]}>
            {image && (
                <ArticleImage
                    style={StyleSheet.absoluteFillObject}
                    image={image}
                />
            )}
            <View
                style={[
                    longReadHeaderStyles.textBackground,
                    appearance.backgrounds,
                ]}
            >
                <HeadlineText
                    style={[
                        longReadHeaderStyles.headline,
                        appearance.text,
                        appearance.headline,
                    ]}
                >
                    {headline}
                </HeadlineText>
            </View>
        </View>
    )
}

export { NewsHeader, LongReadHeader }
