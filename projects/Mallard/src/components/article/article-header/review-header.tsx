import React from 'react'
import { View } from 'react-native'
import { Stars } from 'src/components/stars/stars'
import { useArticle } from 'src/hooks/use-article'
import { metrics } from 'src/theme/spacing'
import { ArticleByline } from '../article-byline'
import { ArticleHeadline } from '../article-headline'
import { ArticleImage } from '../article-image'
import { ArticleKicker } from '../article-kicker/normal-kicker'
import { ArticleStandfirst } from '../article-standfirst'
import { MultilineWrap } from '../wrap/multiline-wrap'
import { ArticleHeaderProps } from './types'
import { HeadlineTypeWrap } from './shared'

const ReviewHeader = ({
    byline,
    kicker,
    headline,
    image,
    standfirst,
    starRating,
}: ArticleHeaderProps) => {
    const [color] = useArticle()
    return (
        <MultilineWrap
            needsTopPadding
            byline={
                <ArticleByline style={[{ color: color.dark }]}>
                    {byline}
                </ArticleByline>
            }
            backgroundColor={color.faded}
            borderColor={color.dark}
        >
            {image ? (
                <ArticleImage
                    proxy={starRating && <Stars rating={starRating} />}
                    style={{
                        aspectRatio: 1.5,
                        marginBottom: metrics.vertical / 4,
                    }}
                    image={image}
                />
            ) : null}
            {kicker ? <ArticleKicker kicker={kicker} /> : null}
            <HeadlineTypeWrap>
                <View>
                    <ArticleHeadline
                        weight={'bold'}
                        textStyle={{ color: color.dark }}
                    >
                        {headline}
                    </ArticleHeadline>
                </View>

                <ArticleStandfirst
                    textStyle={{ color: color.dark }}
                    {...{ standfirst }}
                />
            </HeadlineTypeWrap>
        </MultilineWrap>
    )
}

export { ReviewHeader }
