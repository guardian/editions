import React from 'react'
import { StyleSheet } from 'react-native'
import { color } from 'src/theme/color'
import { getFont } from 'src/theme/typography'
import { ArticleByline } from '../article-byline'
import { CoverImage } from '../article-image'
import { HangyTagKicker } from '../article-kicker/tag-kicker'
import { ArticleStandfirst } from '../article-standfirst'
import { LeftSideBleed } from '../wrap/left-side-bleed'
import { MultilineWrap } from '../wrap/multiline-wrap'
import { HeadlineTypeWrap } from './shared'
import { ArticleHeaderProps } from './types'
import { ArticleHeadline } from '../article-headline'

const styles = StyleSheet.create({
    whiteText: { color: color.palette.neutral[100] },
})

const LongReadHeader = ({
    byline,
    headline,
    image,
    kicker,
    standfirst,
}: ArticleHeaderProps) => {
    return (
        <>
            {image && <CoverImage image={image} />}

            <MultilineWrap
                byline={
                    <ArticleByline style={styles.whiteText}>
                        {byline || ''}
                    </ArticleByline>
                }
                borderColor={styles.whiteText.color}
                backgroundColor={color.palette.neutral[7]}
                multilineColor={styles.whiteText.color}
            >
                <LeftSideBleed
                    backgroundColor={color.palette.neutral[7]}
                    topOffset={getFont('titlepiece', 1).lineHeight * 4}
                >
                    <HeadlineTypeWrap>
                        {kicker ? (
                            <HangyTagKicker>{kicker}</HangyTagKicker>
                        ) : null}
                        <ArticleHeadline
                            weight={'titlepiece'}
                            textStyle={[styles.whiteText]}
                        >
                            {headline}
                        </ArticleHeadline>
                        <ArticleStandfirst
                            standfirst={standfirst}
                            bold
                            textStyle={[styles.whiteText]}
                        ></ArticleStandfirst>
                    </HeadlineTypeWrap>
                </LeftSideBleed>
            </MultilineWrap>
        </>
    )
}

export { LongReadHeader }
