import React from 'react'
import { StyleSheet, View } from 'react-native'
import { HeadlineText } from 'src/components/styled-text'
import { useDimensions, useMediaQuery } from 'src/hooks/use-screen'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { ArticleByline } from '../article-byline'
import { ArticleImage } from '../article-image'
import { HangyTagKicker } from '../article-kicker/tag-kicker'
import { ArticleStandfirst } from '../article-standfirst'
import { LeftSideBleed } from '../wrap/left-side-bleed'
import { MultilineWrap } from '../wrap/multiline-wrap'
import { ArticleHeaderProps } from './types'

const styles = StyleSheet.create({
    whiteText: { color: color.palette.neutral[100] },
    kicker: {
        color: color.palette.neutral[100],
        padding: metrics.article.sides,
        paddingVertical: metrics.vertical / 2,
        height: metrics.vertical * 4,
        marginTop: metrics.vertical * -4,
        width: 'auto',
        textAlign: 'left',
        flexShrink: 1,
        fontFamily: getFont('headline', 1, 'bold').fontFamily,
    },
    kickerHolder: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    headline: {
        fontFamily: getFont('titlepiece', 1).fontFamily,
        marginTop: metrics.vertical / 2,
        marginBottom: metrics.vertical * 3.5,
        marginRight: metrics.horizontal * 4,
    },
})

const LongReadHeader = ({
    byline,
    headline,
    image,
    kicker,
    standfirst,
}: ArticleHeaderProps) => {
    const { height } = useDimensions()
    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)
    return (
        <>
            {image && (
                <ArticleImage
                    style={{ width: '100%', height: height * 0.8 }}
                    image={image}
                />
            )}

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
                    <View style={{ paddingBottom: metrics.vertical * 2 }}>
                        {kicker ? (
                            <HangyTagKicker>{kicker}</HangyTagKicker>
                        ) : null}
                        <HeadlineText
                            style={[styles.whiteText, styles.headline]}
                        >
                            {headline}
                        </HeadlineText>
                        <ArticleStandfirst
                            standfirst={standfirst}
                            textStyle={[
                                styles.whiteText,
                                isTablet && {
                                    fontFamily: getFont('headline', 1, 'bold')
                                        .fontFamily,
                                },
                            ]}
                        ></ArticleStandfirst>
                    </View>
                </LeftSideBleed>
            </MultilineWrap>
        </>
    )
}

export { LongReadHeader }
