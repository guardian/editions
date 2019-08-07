import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { ArticleImage } from '../article-image'
import { ArticleStandfirst } from '../article-standfirst'
import { ArticleHeaderProps } from './types'
import { Multiline } from '../../multiline'
import { ArticleHeadline } from '../article-headline'
import Quote from 'src/components/icons/Quote'
import { getFont } from 'src/theme/typography'
import { color } from 'src/theme/color'
import { useArticle } from 'src/hooks/use-article'
import { getFader } from 'src/components/layout/animators/fader'
import { Wrap } from './wrap'

const ArticleFader = getFader('article')

const styles = StyleSheet.create({
    background: {
        backgroundColor: color.palette.opinion.faded,
    },
    innerWrap: {
        paddingBottom: metrics.vertical,
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
    const [articleColor] = useArticle()
    return (
        <Wrap style={styles.innerWrap} outerStyle={[styles.background]}>
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
                <ArticleHeadline textStyle={{ marginBottom: metrics.vertical }}>
                    <Quote fill={articleColor.main} />
                    {headline}
                    <Text style={[{ color: articleColor.main }, styles.byline]}>
                        {'\n'}
                        {byline}
                    </Text>
                </ArticleHeadline>
            </ArticleFader>
            <ArticleFader buildOrder={3}>
                <Multiline count={4} color={color.line} />
                <View style={[styles.innerWrap]}>
                    <ArticleStandfirst {...{ standfirst }} />
                </View>
            </ArticleFader>
        </Wrap>
    )
}

export { OpinionHeader }
