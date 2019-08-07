import React from 'react'
import { View, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { ArticleImage } from '../article-image'
import { getNavigationPosition } from 'src/helpers/positions'
import { ArticleKicker } from '../article-kicker'
import { ArticleStandfirst } from '../article-standfirst'
import { ArticleHeaderProps } from './types'
import { ArticleByline } from '../article-byline'
import { ArticleHeadline } from '../article-headline'
import { ArticleMultiline } from '../article-multiline'
import { getFader } from 'src/components/layout/animators/fader'
import { Wrap } from './wrap'

const styles = StyleSheet.create({
    background: {
        paddingBottom: metrics.vertical,
    },
    byline: { marginBottom: metrics.vertical },
    bylineBackground: {
        marginTop: metrics.vertical,
        marginBottom: metrics.vertical,
        paddingTop: metrics.vertical / 4,
        width: '100%',
    },
})

const ArticleFader = getFader('article')

const NewsHeader = ({
    byline,
    headline,
    image,
    kicker,
    standfirst,
}: ArticleHeaderProps) => {
    const navigationPosition = getNavigationPosition('article')
    return (
        <Wrap isTopMost style={[styles.background]}>
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
            <ArticleFader buildOrder={3}>
                <ArticleHeadline>{headline}</ArticleHeadline>
            </ArticleFader>
            <ArticleFader buildOrder={4}>
                <ArticleStandfirst
                    style={styles.bylineBackground}
                    {...{ byline, standfirst, navigationPosition }}
                />
                <ArticleMultiline />
            </ArticleFader>
            <ArticleFader buildOrder={5}>
                <ArticleByline style={styles.byline}>{byline}</ArticleByline>
            </ArticleFader>
        </Wrap>
    )
}

export { NewsHeader }
