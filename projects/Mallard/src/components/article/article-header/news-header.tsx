import React from 'react'
import { StyleSheet } from 'react-native'
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
        width: '100%',
    },
})

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
                <ArticleImage
                    style={{
                        marginBottom: metrics.vertical / 4,
                    }}
                    image={image}
                />
            ) : null}

            {kicker ? <ArticleKicker kicker={kicker} /> : null}
            <HeadlineTypeWrap>
                <ArticleHeadline>{headline}</ArticleHeadline>
                <ArticleStandfirst
                    style={styles.standfirst}
                    {...{ standfirst }}
                />
            </HeadlineTypeWrap>
        </MultilineWrap>
    )
}

export { NewsHeader }
