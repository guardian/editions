import React from 'react'
import { StyleSheet } from 'react-native'
import { getFader } from 'src/components/layout/animators/fader'
import { metrics } from 'src/theme/spacing'
import { ArticleByline } from '../article-byline'
import { ArticleHeadline } from '../article-headline'
import { ArticleImage } from '../article-image'
import { ArticleKicker } from '../article-kicker/normal-kicker'
import { ArticleStandfirst } from '../article-standfirst'
import { MultilineWrap } from '../wrap/multiline-wrap'
import { HeadlineTypeWrap } from './shared'
import { ArticleHeaderProps } from './types'

const styles = StyleSheet.create({
    background: {
        paddingBottom: metrics.vertical,
    },
    byline: { marginBottom: metrics.vertical },
    standfirst: {
        flex: 0,
        marginTop: metrics.vertical * 4,
        marginBottom: metrics.vertical,
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
    return (
        <MultilineWrap
            style={[styles.background]}
            byline={
                <ArticleByline style={styles.byline}>{byline}</ArticleByline>
            }
        >
            {image ? (
                <ArticleFader>
                    <ArticleImage
                        style={{
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
            <HeadlineTypeWrap>
                <ArticleFader>
                    <ArticleHeadline>{headline}</ArticleHeadline>
                </ArticleFader>
                <ArticleFader>
                    <ArticleStandfirst
                        style={styles.standfirst}
                        {...{ standfirst }}
                    />
                </ArticleFader>
            </HeadlineTypeWrap>
        </MultilineWrap>
    )
}

export { NewsHeader }
