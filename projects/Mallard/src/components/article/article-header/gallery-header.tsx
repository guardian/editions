import React from 'react'
import { StyleSheet, View } from 'react-native'
import { GalleryArticle, Image as ImageType } from 'src/common'
import { HeadlineText } from 'src/components/styled-text'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { getFont } from 'src/theme/typography'
import { ArticleByline } from '../article-byline'
import { ArticleStandfirst } from '../article-standfirst'
import { MultilineWrap } from '../wrap/multiline-wrap'

const styles = StyleSheet.create({
    whiteText: { color: color.palette.neutral[100] },
    cutoutWrapper: {
        flexBasis: '40%',
        marginLeft: '-10%',
        marginRight: '-5%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
    bodyWrapper: {
        flexShrink: 1,
        paddingBottom: metrics.vertical * 2,
    },
    top: {
        flexDirection: 'row',
    },
})

export interface GalleryHeaderProps {
    headline: GalleryArticle['headline']
    byline: GalleryArticle['byline']
    standfirst: GalleryArticle['standfirst']
}
const GalleryHeader = ({
    headline,
    byline,
    standfirst,
}: GalleryHeaderProps) => {
    return (
        <MultilineWrap
            byline={
                <ArticleByline style={styles.whiteText}>
                    {byline || ''}
                </ArticleByline>
            }
            borderColor={styles.whiteText.color}
            backgroundColor={color.photoBackground}
            multilineColor={styles.whiteText.color}
        >
            <View style={styles.top}>
                <View style={styles.bodyWrapper}>
                    <HeadlineText
                        style={[
                            styles.whiteText,
                            {
                                fontFamily: getFont('titlepiece', 1).fontFamily,
                                marginTop: metrics.vertical,
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
                            textStyle={styles.whiteText}
                        ></ArticleStandfirst>
                    )}
                </View>
            </View>
        </MultilineWrap>
    )
}

export { GalleryHeader }
