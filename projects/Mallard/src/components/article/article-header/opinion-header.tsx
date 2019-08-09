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
import { Wrap, MultilineWrap } from './wrap'

const ArticleFader = getFader('article')

const styles = StyleSheet.create({
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
    const font = getFont('headline', 1.5, 'light')
    return (
        <MultilineWrap
            isTopMost
            bylineHasBackgroundColor
            multilineBleeds={false}
            style={styles.innerWrap}
            backgroundColor={color.palette.opinion.faded}
            byline={
                <ArticleFader>
                    <View style={[styles.innerWrap]}>
                        <ArticleStandfirst {...{ standfirst }} />
                    </View>
                </ArticleFader>
            }
        >
            {image ? (
                <ArticleFader>
                    <ArticleImage
                        style={{
                            aspectRatio: 1.5,
                            marginBottom: metrics.vertical / 4,
                        }}
                        image={image}
                    />
                </ArticleFader>
            ) : null}
            <ArticleFader>
                <ArticleHeadline
                    icon={{
                        width: 60,
                        height: font.lineHeight,
                        element: () => <Quote fill={articleColor.main} />,
                    }}
                    weight="light"
                    textStyle={[{ marginBottom: metrics.vertical }, font]}
                >
                    {headline}
                    <Text style={[{ color: articleColor.main }, styles.byline]}>
                        {'\n'}
                        {byline}
                    </Text>
                </ArticleHeadline>
            </ArticleFader>
        </MultilineWrap>
    )
}

export { OpinionHeader }
