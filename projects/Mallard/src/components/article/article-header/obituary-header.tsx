import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useArticle } from 'src/hooks/use-article'
import { color } from 'src/theme/color'
import { ArticleByline } from '../article-byline'
import { ArticleHeadline } from '../article-headline'
import { CoverImage } from '../article-image'
import { ArticleStandfirst } from '../article-standfirst'
import { MultilineWrap } from '../wrap/multiline-wrap'
import { HeadlineTypeWrap } from './shared'
import { ArticleHeaderProps } from './types'
import { HangyTagKicker } from '../article-kicker/tag-kicker'

const styles = StyleSheet.create({
    whiteText: { color: color.palette.neutral[100] },
})

const ObituaryHeader = ({
    byline,
    headline,
    image,
    kicker,
    standfirst,
}: ArticleHeaderProps) => {
    const [colors] = useArticle()
    return (
        <>
            {image && <CoverImage small image={image} />}

            <View
                style={{
                    borderTopWidth: 1,
                    borderColor: color.palette.neutral[100],
                }}
            >
                <MultilineWrap
                    backgroundColor={colors.main}
                    multilineColor={color.palette.neutral[100]}
                    borderColor={color.palette.neutral[100]}
                    byline={
                        <ArticleByline style={[styles.whiteText]}>
                            {byline}
                        </ArticleByline>
                    }
                >
                    {kicker ? (
                        <HangyTagKicker translate={-1}>{kicker}</HangyTagKicker>
                    ) : null}
                    <HeadlineTypeWrap>
                        <ArticleHeadline
                            weight={'titlepiece'}
                            textStyle={[styles.whiteText]}
                        >
                            {headline}
                        </ArticleHeadline>
                        <ArticleStandfirst
                            textStyle={[styles.whiteText]}
                            standfirst={standfirst}
                            bold
                        />
                    </HeadlineTypeWrap>
                </MultilineWrap>
            </View>
        </>
    )
}

export { ObituaryHeader }
