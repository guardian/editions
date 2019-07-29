import React from 'react'
import { View, Animated, Alert, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { ArticleImage } from '../article-image'
import { getNavigationPosition } from 'src/helpers/positions'
import { animationStyles, newsHeaderStyles } from '../styles'
import { ArticleKicker } from '../article-kicker'
import { ArticleStandfirst } from '../article-standfirst'
import { ArticleHeaderProps } from './types'
import { ArticleByline } from '../article-byline'
import { ArticleHeadline } from '../article-headline'
import { ArticleMultiline } from '../article-multiline'

const styles = StyleSheet.create({
    bylineBackground: {
        marginTop: metrics.vertical,
        marginBottom: metrics.vertical,
        paddingTop: metrics.vertical / 4,
        width: '100%',
    },
})

const NewsHeader = ({
    byline,
    headline,
    image,
    kicker,
    standfirst,
}: ArticleHeaderProps) => {
    const navigationPosition = getNavigationPosition('article')
    return (
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

            {kicker ? <ArticleKicker kicker={kicker} type="news" /> : null}
            <Animated.View style={animationStyles(navigationPosition)}>
                <ArticleHeadline type="news">{headline}</ArticleHeadline>
            </Animated.View>
            <ArticleStandfirst
                style={styles.bylineBackground}
                {...{ byline, standfirst, navigationPosition }}
            />
            <ArticleMultiline />
            <ArticleByline style={newsHeaderStyles.byline}>
                {byline}
            </ArticleByline>
        </View>
    )
}

export { NewsHeader }
