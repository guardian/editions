import React from 'react'
import { StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { ArticleImage } from '../article-image'
import { ArticleKicker } from '../article-kicker/normal-kicker'
import { ArticleStandfirst } from '../article-standfirst'
import { ArticleHeaderProps } from './types'
import { ArticleByline } from '../article-byline'
import { ArticleHeadline } from '../article-headline'
import { getFader } from 'src/components/layout/animators/fader'
import { MultilineWrap } from '../wrap/wrap'

const styles = StyleSheet.create({
    background: {
        paddingBottom: metrics.vertical,
    },
    byline: { marginBottom: metrics.vertical },
    standfirst: {
        flex: 0,
        marginTop: metrics.vertical * 4,
        marginBottom: metrics.vertical / 4,
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
                <ArticleHeadline>{headline}</ArticleHeadline>
            </ArticleFader>
            <ArticleFader>
                <ArticleStandfirst
                    style={styles.standfirst}
                    {...{ standfirst }}
                />
            </ArticleFader>
        </MultilineWrap>
    )
}

export { NewsHeader }
