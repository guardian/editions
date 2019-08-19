import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ArticleImage } from '../article-image'
import { ArticleHeaderProps } from './types'
import { ArticleByline } from '../article-byline'
import { HeadlineText } from 'src/components/styled-text'
import { color } from 'src/theme/color'
import { MultilineWrap } from '../wrap/wrap'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { ArticleStandfirst } from '../article-standfirst'
import { Breakpoints } from 'src/theme/breakpoints'
import { useMediaQuery, useDimensions } from 'src/hooks/use-screen'
import { HangyTagKicker } from '../article-kicker/tag-kicker'

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
                topOffset={getFont('titlepiece', 1).lineHeight * 4}
                borderColor={styles.whiteText.color}
                backgroundColor={color.palette.neutral[7]}
                multilineColor={styles.whiteText.color}
            >
                <View style={{ paddingBottom: metrics.vertical * 2 }}>
                    {kicker ? <HangyTagKicker>{kicker}</HangyTagKicker> : null}
                    <HeadlineText style={[styles.whiteText, styles.headline]}>
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
            </MultilineWrap>
        </>
    )
}

export { LongReadHeader }
