import React from 'react'
import { View, Animated, Alert } from 'react-native'
import { HeadlineText } from 'src/components/styled-text'
import { metrics } from 'src/theme/spacing'
import { useArticleAppearance } from 'src/theme/appearance'
import { ArticleImage } from '../article-image'
import { getNavigationPosition } from 'src/helpers/positions'
import { animationStyles, newsHeaderStyles } from '../styles'
import { ArticleKicker } from '../article-kicker'
import { ArticleStandfirst } from '../article-standfirst'
import { ArticleHeaderProps } from './types'
import { Multiline } from '../../multiline'
import { ArticleByline } from '../article-byline'
import { ArticleHeadline } from '../article-headline'

const NewsHeader = ({
    byline,
    headline,
    image,
    kicker,
    standfirst,
}: ArticleHeaderProps) => {
    const { appearance } = useArticleAppearance()
    const navigationPosition = getNavigationPosition('article')
    Alert.alert(JSON.stringify(image))
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
            {kicker ? <ArticleKicker kicker={kicker} type="news" /> : null}
            <Animated.View style={animationStyles(navigationPosition)}>
                <ArticleHeadline type="news">{headline}</ArticleHeadline>
            </Animated.View>
            <ArticleStandfirst
                {...{ byline, standfirst, navigationPosition }}
            />
            <Multiline count={4} />
            <ArticleByline>{byline}</ArticleByline>
        </View>
    )
}

export { NewsHeader }
