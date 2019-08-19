import React from 'react'
import { View, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { ArticleImage } from '../article-image'
import { ArticleStandfirst } from '../article-standfirst'
import { ArticleHeaderProps } from './types'
import { Multiline } from '../../multiline'
import { ArticleHeadline } from '../article-headline'
import { useArticle } from 'src/hooks/use-article'
import { getFader } from 'src/components/layout/animators/fader'
import { ArticleByline } from '../article-byline'
import { ArticleKicker } from '../article-kicker/normal-kicker'
import { Wrap, MultilineWrap } from '../wrap/wrap'
import { Stars } from 'src/components/stars/stars'

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
