import React from 'react'
import { View, StyleSheet } from 'react-native'
import { ArticleImage } from '../article-image'
import { longReadHeaderStyles } from '../styles'
import { ArticleHeaderProps } from './types'
import { Multiline } from '../../multiline'
import { ArticleByline } from '../article-byline'
import {
    HeadlineText,
    HeadlineKickerText,
    StandfirstText,
} from 'src/components/styled-text'
import { color } from 'src/theme/color'
import { MultilineWrap } from '../wrap/wrap'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { ArticleStandfirst } from '../article-standfirst'
import { useArticle } from 'src/hooks/use-article'
import { Breakpoints } from 'src/theme/breakpoints'
import { useMediaQuery } from 'src/hooks/use-screen'

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
    kickerMobile: {
        marginLeft: metrics.article.sides * -1,
    },
    kickerHolder: {
        flexDirection: 'column',
        alignItems: 'flex-start',
    },
    headline: {
        fontFamily: getFont('titlepiece', 1).fontFamily,
        marginTop: 0,
        marginBottom: metrics.vertical * 2,
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
    const [articleColor] = useArticle()
    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)
    return (
        <>
            {image && (
                <ArticleImage
                    style={{ width: '100%', height: 300 }}
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
                    {kicker ? (
                        <View style={styles.kickerHolder}>
                            <HeadlineKickerText
                                style={[
                                    styles.kicker,
                                    !isTablet && styles.kickerMobile,
                                    {
                                        backgroundColor: articleColor.main,
                                    },
                                ]}
                            >
                                {kicker}
                            </HeadlineKickerText>
                        </View>
                    ) : null}
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
