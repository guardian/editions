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
import { useArticle } from 'src/hooks/use-article'

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
    const [articleColor] = useArticle()
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
                        <View
                            style={{
                                backgroundColor: 'blue',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                            }}
                        >
                            <HeadlineKickerText
                                style={{
                                    color: color.palette.neutral[100],
                                    padding: metrics.horizontal / 2,
                                    paddingVertical: metrics.vertical / 2,
                                    height: metrics.vertical * 4,
                                    marginTop: metrics.vertical * -4,
                                    width: 'auto',
                                    textAlign: 'left',
                                    flexShrink: 1,
                                    backgroundColor: articleColor.main,
                                    fontFamily: getFont('headline', 1, 'bold')
                                        .fontFamily,
                                }}
                            >
                                {kicker}
                            </HeadlineKickerText>
                        </View>
                    ) : null}
                    <HeadlineText
                        style={[
                            styles.whiteText,
                            {
                                fontFamily: getFont('titlepiece', 1).fontFamily,
                                marginTop: 0,
                                marginBottom: metrics.vertical * 2,
                                marginRight: metrics.horizontal * 4,
                            },
                        ]}
                        weight="bold"
                    >
                        {headline}
                    </HeadlineText>
                    {standfirst && (
                        <ArticleStandfirst
                            standfirst={standfirst}
                            textStyle={[
                                styles.whiteText,
                                {
                                    fontFamily: getFont('headline', 1, 'bold')
                                        .fontFamily,
                                },
                            ]}
                        ></ArticleStandfirst>
                    )}
                </View>
            </MultilineWrap>
        </>
    )
}

export { LongReadHeader }
