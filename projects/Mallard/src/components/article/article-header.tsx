import React from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { HeadlineText, HeadlineKickerText } from 'src/components/styled-text'
import { metrics } from 'src/theme/spacing'
import { useArticleAppearance } from 'src/theme/appearance'
import { ArticleImage } from './article-image'
import { getNavigationPosition } from 'src/helpers/positions'
import { Image } from '../../common'

interface Style {
    /* kicker */
    kicker: {}
    /* outer container around the header. For spacing and background colour*/
    background: {}
    /* text styles for the headline `<Text>` element. Mainly for colours*/
    headline: {}
    /* optional container around the headline `<Text>` that adds a background colour*/
    textBackground: {}
}

export interface PropTypes {
    headline: string
    kicker?: string | null
    image?: Image | null
}

const newsHeaderStyles: StyleSheet.NamedStyles<Style> = StyleSheet.create({
    background: {
        alignItems: 'flex-start',
        paddingHorizontal: metrics.horizontal,
        paddingBottom: metrics.vertical,
    },
    kicker: {
        paddingBottom: metrics.vertical / 2,
        marginBottom: metrics.vertical / 4,
        borderBottomWidth: StyleSheet.hairlineWidth,
        width: '100%',
    },
    textBackground: {},
    headline: {
        marginRight: metrics.horizontal * 2,
    },
})

const NewsHeader = ({ headline, image, kicker }: PropTypes) => {
    const { appearance } = useArticleAppearance()
    const navigationPosition = getNavigationPosition('article')
    return (
        <View style={[newsHeaderStyles.background, appearance.backgrounds]}>
            {image ? (
                <ArticleImage
                    style={{
                        aspectRatio: 1.5,
                        marginBottom: metrics.vertical / 4,
                    }}
                    image={image}
                />
            ) : null}
            {kicker ? (
                <View style={[newsHeaderStyles.kicker, appearance.backgrounds]}>
                    <HeadlineKickerText style={[appearance.text]}>
                        {kicker}
                    </HeadlineKickerText>
                </View>
            ) : null}
            <Animated.View
                style={[
                    navigationPosition && {
                        opacity: navigationPosition.position.interpolate({
                            inputRange: [0.4, 1],
                            outputRange: [0, 1],
                        }),
                    },
                ]}
            >
                <HeadlineText
                    style={[
                        newsHeaderStyles.headline,
                        appearance.text,
                        appearance.headline,
                    ]}
                >
                    {headline}
                </HeadlineText>
            </Animated.View>
        </View>
    )
}

const longReadHeaderStyles: StyleSheet.NamedStyles<Style> = StyleSheet.create({
    background: {
        flexShrink: 0,
        alignItems: 'flex-start',
        justifyContent: 'flex-end',
        height: 500,
        marginTop: -10,
    },
    kicker: {
        ...newsHeaderStyles.kicker,
    },
    headline: {},
    textBackground: {
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical / 2,
        marginEnd: metrics.horizontal * 2,
    },
})

const LongReadHeader = ({ headline, image, kicker }: PropTypes) => {
    const { appearance } = useArticleAppearance()
    return (
        <View style={[longReadHeaderStyles.background, appearance.backgrounds]}>
            {image ? (
                <ArticleImage
                    style={StyleSheet.absoluteFillObject}
                    image={image}
                />
            ) : null}
            <View
                style={[
                    longReadHeaderStyles.textBackground,
                    appearance.backgrounds,
                ]}
            >
                {kicker ? (
                    <View
                        style={[
                            longReadHeaderStyles.kicker,
                            appearance.backgrounds,
                        ]}
                    >
                        <HeadlineKickerText style={[appearance.text]}>
                            {kicker}
                        </HeadlineKickerText>
                    </View>
                ) : null}
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
