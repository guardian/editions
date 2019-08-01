import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { ArticleImage } from '../article-image'
import { getNavigationPosition } from 'src/helpers/positions'
import { newsHeaderStyles } from '../styles'
import { ArticleStandfirst } from '../article-standfirst'
import { ArticleHeaderProps } from './types'
import { Multiline } from '../../multiline'
import { ArticleHeadline } from '../article-headline'
import Quote from 'src/components/icons/Quote'
import { getFont } from 'src/theme/typography'
import { color } from 'src/theme/color'
import { useArticle } from 'src/hooks/use-article'
import { getFader } from 'src/components/layout/animators/fader'

const ArticleFader = getFader('article')

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
    return (
        <View style={[styles.background]}>
            <View style={[newsHeaderStyles.background]}>
                {image ? (
                    <ArticleFader buildOrder={1}>
                        <ArticleImage
                            style={{
                                aspectRatio: 1.5,
                                marginBottom: metrics.vertical / 4,
                            }}
                            image={image}
                        />
                    </ArticleFader>
                ) : null}
                <ArticleFader buildOrder={2}>
                    <ArticleHeadline>
                        <Quote fill={color.main} />
                        {headline}
                        <Text style={[{ color: color.main }, styles.byline]}>
                            {'\n'}
                            {byline}
                        </Text>
                    </ArticleHeadline>
                </ArticleFader>
            </View>
            <ArticleFader buildOrder={3}>
                <Multiline count={4} />
                <View style={[newsHeaderStyles.background]}>
                    <ArticleStandfirst {...{ standfirst }} />
                </View>
            </ArticleFader>
        </View>
    )
}

export { OpinionHeader }
