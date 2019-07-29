import React from 'react'
import { View, Animated, Text, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { ArticleImage } from '../article-image'
import { getNavigationPosition } from 'src/helpers/positions'
import { animationStyles, newsHeaderStyles } from '../styles'
import { ArticleStandfirst } from '../article-standfirst'
import { ArticleHeaderProps } from './types'
import { Multiline } from '../../multiline'
import { ArticleByline } from '../article-byline'
import { ArticleHeadline } from '../article-headline'
import Quote from 'src/components/icons/Quote'
import { getFont } from 'src/theme/typography'
import { color } from 'src/theme/color'
import { useArticle } from 'src/hooks/use-article'

const styles = StyleSheet.create({
    background: {
        backgroundColor: color.palette.opinion.faded,
    },
    byline: {
        fontFamily: getFont('titlepiece', 1).fontFamily,
        width: '100%',
    },
})

const OpinionHeader = ({
    byline,
    headline,
    image,
    standfirst,
}: ArticleHeaderProps) => {
    const [color] = useArticle()
    const navigationPosition = getNavigationPosition('article')
    return (
        <View style={[styles.background]}>
            <View style={[newsHeaderStyles.background]}>
                {image ? (
                    <ArticleImage
                        style={{
                            aspectRatio: 1.5,
                            marginBottom: metrics.vertical / 4,
                        }}
                        image={image}
                    />
                ) : null}
                <Animated.View style={animationStyles(navigationPosition)}>
                    <ArticleHeadline type="news">
                        <Quote fill={color.main} />
                        {headline}
                        <Text style={[{ color: color.main }, styles.byline]}>
                            {'\n'}
                            {byline}
                        </Text>
                    </ArticleHeadline>
                </Animated.View>
            </View>
            <Multiline count={4} />
            <View style={[newsHeaderStyles.background]}>
                <ArticleStandfirst {...{ standfirst, navigationPosition }} />
            </View>
        </View>
    )
}

export { OpinionHeader }
