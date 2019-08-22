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
import { ArticleHeadline } from '../article-headline'

const ImmersiveHeader = ({
    byline,
    headline,
    image,
    standfirst,
}: ArticleHeaderProps) => {
    const [colors] = useArticle()
    return (
        <>
            {image && <CoverImage image={image} />}

            <MultilineWrap byline={<ArticleByline>{byline}</ArticleByline>}>
                <LeftSideBleed
                    backgroundColor={color.palette.neutral[100]}
                    topOffset={getFont('titlepiece', 1).lineHeight * 4}
                >
                    <HeadlineTypeWrap>
                        <ArticleHeadline
                            weight={'titlepiece'}
                            textStyle={[{ color: colors.dark }]}
                        >
                            {headline}
                        </ArticleHeadline>
                        <ArticleStandfirst
                            standfirst={standfirst}
                            textStyle={[{ marginBottom: metrics.vertical * 2 }]}
                        ></ArticleStandfirst>
                    </HeadlineTypeWrap>
                </LeftSideBleed>
            </MultilineWrap>
        </>
    )
}

export { ImmersiveHeader }
