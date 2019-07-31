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
import { ArticleByline } from '../article-byline'
import { ArticleKicker } from '../article-kicker'

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

const style = StyleSheet.create({
    sides: { paddingHorizontal: metrics.articleSides },
    headline: { paddingBottom: metrics.vertical * 4 },
    standfirst: { paddingBottom: metrics.vertical * 1 },
})

const ReviewHeader = ({
    byline,
    kicker,
    headline,
    image,
    standfirst,
}: ArticleHeaderProps) => {
    const [color] = useArticle()
    const navigationPosition = getNavigationPosition('article')
    return (
        <View style={[{ backgroundColor: color.faded }]}>
            <View style={style.sides}>
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
                {kicker ? (
                    <ArticleFader buildOrder={2}>
                        <ArticleKicker kicker={kicker} />
                    </ArticleFader>
                ) : null}
                <ArticleFader buildOrder={2}>
                    <View style={style.headline}>
                        <ArticleHeadline
                            weight={'bold'}
                            textStyle={{ color: color.dark }}
                        >
                            {headline}
                        </ArticleHeadline>
                    </View>
                </ArticleFader>
            </View>
            <ArticleFader buildOrder={3}>
                <ArticleStandfirst
                    style={[style.sides, style.standfirst]}
                    textStyle={{ color: color.dark }}
                    {...{ standfirst }}
                />
                <Multiline color={color.dark} count={4} />
                <View style={style.sides}>
                    <ArticleByline
                        style={[newsHeaderStyles.byline, { color: color.dark }]}
                    >
                        {byline}
                    </ArticleByline>
                </View>
            </ArticleFader>
        </View>
    )
}

export { ReviewHeader }
