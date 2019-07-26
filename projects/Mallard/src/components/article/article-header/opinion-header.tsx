import React from 'react'
import { View, Animated } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { useArticleAppearance } from 'src/theme/appearance'
import { ArticleImage } from '../article-image'
import { getNavigationPosition } from 'src/helpers/positions'
import { animationStyles, newsHeaderStyles } from '../styles'
import { ArticleStandfirst } from '../article-standfirst'
import { ArticleHeaderProps } from './types'
import { Multiline } from '../../multiline'
import { ArticleByline } from '../article-byline'
import { ArticleHeadline } from '../article-headline'
import Quote from 'src/components/icons/Quote'

const OpinionHeader = ({
    byline,
    headline,
    image,
    standfirst,
}: ArticleHeaderProps) => {
    const { appearance } = useArticleAppearance()
    const navigationPosition = getNavigationPosition('article')
    return (
        <>
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
                <Animated.View style={animationStyles(navigationPosition)}>
                    <ArticleHeadline type="news">
                        <Quote />
                        {headline}
                    </ArticleHeadline>
                    <ArticleByline>{byline}</ArticleByline>
                </Animated.View>
            </View>
            <Multiline count={4} />
            <View style={[newsHeaderStyles.background, appearance.backgrounds]}>
                <ArticleStandfirst {...{ standfirst, navigationPosition }} />
            </View>
        </>
    )
}

export { OpinionHeader }
