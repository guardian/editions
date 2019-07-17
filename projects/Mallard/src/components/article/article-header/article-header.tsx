import React from 'react'
import { View, StyleSheet, Animated } from 'react-native'
import { HeadlineText, HeadlineKickerText } from 'src/components/styled-text'
import { metrics } from 'src/theme/spacing'
import { useArticleAppearance } from 'src/theme/appearance'
import { ArticleImage } from '../article-image'
import { getNavigationPosition } from 'src/helpers/positions'
import { newsHeaderStyles, longReadHeaderStyles } from './article-header-styles'
import { ArticleKicker } from './article-kicker'
import { Image } from '../../../common'

export interface PropTypes {
    headline: string
    kicker?: string | null
    image?: Image | null
}

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
            {kicker ? <ArticleKicker kicker={kicker} /> : null}
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
                    <ArticleKicker kicker={kicker} type="longRead" />
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
