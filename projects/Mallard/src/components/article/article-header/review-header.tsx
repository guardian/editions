import React from 'react'
import { StyleSheet, View } from 'react-native'
import { getFader } from 'src/components/layout/animators/fader'
import { Stars } from 'src/components/stars/stars'
import { useArticle } from 'src/hooks/use-article'
import { metrics } from 'src/theme/spacing'
import { ArticleByline } from '../article-byline'
import { ArticleHeadline } from '../article-headline'
import { ArticleImage } from '../article-image'
import { ArticleKicker } from '../article-kicker/normal-kicker'
import { ArticleStandfirst } from '../article-standfirst'
import { MultilineWrap } from '../wrap/wrap'
import { ArticleHeaderProps } from './types'

const ArticleFader = getFader('article')

const style = StyleSheet.create({
    standfirst: {
        paddingBottom: metrics.vertical * 1,
        marginTop: metrics.vertical * 4,
    },
    byline: { marginBottom: metrics.vertical },
})

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
                <ArticleFader>
                    <ArticleByline
                        style={[style.byline, { color: color.dark }]}
                    >
                        {byline}
                    </ArticleByline>
                </ArticleFader>
            }
            backgroundColor={color.faded}
            borderColor={color.dark}
        >
            <>
                {image ? (
                    <ArticleFader>
                        <ArticleImage
                            proxy={starRating && <Stars rating={starRating} />}
                            style={{
                                aspectRatio: 1.5,
                                marginBottom: metrics.vertical / 4,
                            }}
                            image={image}
                        />
                    </ArticleFader>
                ) : null}
                {kicker ? (
                    <ArticleFader>
                        <ArticleKicker kicker={kicker} />
                    </ArticleFader>
                ) : null}
                <ArticleFader>
                    <View>
                        <ArticleHeadline
                            weight={'bold'}
                            textStyle={{ color: color.dark }}
                        >
                            {headline}
                        </ArticleHeadline>
                    </View>
                </ArticleFader>
                <ArticleFader>
                    <ArticleStandfirst
                        style={[style.standfirst]}
                        textStyle={{ color: color.dark }}
                        {...{ standfirst }}
                    />
                </ArticleFader>
            </>
        </MultilineWrap>
    )
}

export { ReviewHeader }
