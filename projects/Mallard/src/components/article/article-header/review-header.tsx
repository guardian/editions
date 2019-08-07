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
import { ArticleKicker } from '../article-kicker'
import { Wrap } from './wrap'

const ArticleFader = getFader('article')

const style = StyleSheet.create({
    headline: { paddingBottom: metrics.vertical * 4 },
    standfirst: { paddingBottom: metrics.vertical * 1 },
    byline: { marginBottom: metrics.vertical },
})

const ReviewHeader = ({
    byline,
    kicker,
    headline,
    image,
    standfirst,
}: ArticleHeaderProps) => {
    const [color] = useArticle()
    return (
        <Wrap isTopMost outerStyle={[{ backgroundColor: color.faded }]}>
            {() => (
                <>
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
                    <ArticleFader buildOrder={3}>
                        <ArticleStandfirst
                            style={[style.standfirst]}
                            textStyle={{ color: color.dark }}
                            {...{ standfirst }}
                        />
                        <Multiline color={color.dark} count={4} />
                        <View>
                            <ArticleByline
                                style={[style.byline, { color: color.dark }]}
                            >
                                {byline}
                            </ArticleByline>
                        </View>
                    </ArticleFader>
                </>
            )}
        </Wrap>
    )
}

export { ReviewHeader }
