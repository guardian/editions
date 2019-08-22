import React from 'react'
import { StyleSheet } from 'react-native'
import { HeadlineText } from 'src/components/styled-text'
import { useArticle } from 'src/hooks/use-article'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { ArticleByline } from '../article-byline'
import { CoverImage } from '../article-image'
import { ArticleStandfirst } from '../article-standfirst'
import { LeftSideBleed } from '../wrap/left-side-bleed'
import { MultilineWrap } from '../wrap/multiline-wrap'
import { HeadlineTypeWrap } from './shared'
import { ArticleHeaderProps } from './types'
import { Grayscale, MultiplyBlendColor } from 'react-native-image-filter-kit'
import { ArticleHeadline } from '../article-headline'

const styles = StyleSheet.create({
    kicker: {
        color: color.palette.neutral[100],
        padding: metrics.article.sides,
        paddingVertical: metrics.vertical / 2,
        height: metrics.vertical * 4,
        marginTop: metrics.vertical * -4,
        width: 'auto',
        textAlign: 'left',
        flexShrink: 1,
        fontFamily: getFont('headline', 1, 'bold').fontFamily,
    },
    kickerHolder: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    headline: {
        fontFamily: getFont('titlepiece', 1).fontFamily,
    },
})

const ObituaryHeader = ({
    byline,
    headline,
    image,
    standfirst,
}: ArticleHeaderProps) => {
    const [colors, { pillar }] = useArticle()
    return (
        <>
            {image && (
                <MultiplyBlendColor
                    srcColor={
                        pillar === 'culture' ? colors.pastel : colors.faded
                    }
                    dstImage={
                        <Grayscale
                            image={<CoverImage small image={image} />}
                        ></Grayscale>
                    }
                ></MultiplyBlendColor>
            )}

            <MultilineWrap byline={<ArticleByline>{byline}</ArticleByline>}>
                <LeftSideBleed
                    backgroundColor={color.palette.neutral[100]}
                    topOffset={getFont('titlepiece', 1).lineHeight * 4}
                >
                    <HeadlineTypeWrap>
                        <ArticleHeadline
                            weight={'titlepiece'}
                            textStyle={[
                                styles.headline,
                                {
                                    color: colors.dark,
                                },
                            ]}
                        >
                            {headline}
                        </ArticleHeadline>
                        <ArticleStandfirst
                            standfirst={standfirst}
                            bold
                        ></ArticleStandfirst>
                    </HeadlineTypeWrap>
                </LeftSideBleed>
            </MultilineWrap>
        </>
    )
}

export { ObituaryHeader }
