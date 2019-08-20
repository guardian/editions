import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { ArticleImage } from '../article-image'
import { ArticleStandfirst } from '../article-standfirst'
import { ArticleHeaderProps } from './types'
import { ArticleHeadline } from '../article-headline'
import Quote from 'src/components/icons/Quote'
import { getFont } from 'src/theme/typography'
import { color } from 'src/theme/color'
import { useArticle } from 'src/hooks/use-article'
import { getFader } from 'src/components/layout/animators/fader'
import { MultilineWrap } from '../wrap/wrap'

const ArticleFader = getFader('article')

const styles = StyleSheet.create({
    innerWrap: {
        paddingBottom: metrics.vertical,
    },
    byline: {
        fontFamily: getFont('titlepiece', 1).fontFamily,
        width: '100%',
        paddingRight: 0,
    },
    cutout: {
        aspectRatio: 1.5,
        transform: [{ scaleX: 2.5 }, { scaleY: 2.5 }],
        marginBottom: metrics.vertical * 2.5,
        marginLeft: -metrics.vertical * 2.5,
    },
    cutoutContainer: {
        flexDirection: 'column',
        alignSelf: 'flex-end',
        flex: 1,
    },
    headlineContainer: {
        flexDirection: 'column',
        flex: 4,
        flexWrap: 'wrap',
    },
    flexRow: {
        display: 'flex',
        flexDirection: 'row',
    },
})

const OpinionHeader = ({
    byline,
    bylineImages,
    headline,
    image,
    standfirst,
}: ArticleHeaderProps) => {
    const [articleColor] = useArticle()
    const font = getFont('headline', 1.5, 'light')

    return (
        <MultilineWrap
            needsTopPadding
            style={styles.innerWrap}
            backgroundColor={color.palette.opinion.faded}
            byline={
                <ArticleFader>
                    <View style={[styles.innerWrap]}>
                        <ArticleStandfirst {...{ standfirst }} />
                    </View>
                </ArticleFader>
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
            <ArticleFader>
                <View style={styles.flexRow}>
                    <View style={styles.headlineContainer}>
                        <ArticleHeadline
                            icon={{
                                width: 80,
                                height: font.lineHeight,
                                element: () => (
                                    <Quote
                                        scale={1.2}
                                        fill={articleColor.main}
                                    />
                                ),
                            }}
                            weight="light"
                            textStyle={[
                                { marginBottom: metrics.vertical },
                                font,
                            ]}
                        >
                            {headline}
                            <Text
                                style={[
                                    { color: articleColor.main },
                                    styles.byline,
                                ]}
                            >
                                {'\n'}
                                {byline}
                            </Text>
                        </ArticleHeadline>
                    </View>
                    {bylineImages && bylineImages.cutout ? (
                        <View style={styles.cutoutContainer}>
                            <ArticleFader>
                                <ArticleImage
                                    style={styles.cutout}
                                    image={bylineImages.cutout}
                                />
                            </ArticleFader>
                        </View>
                    ) : null}
                </View>
            </ArticleFader>
        </MultilineWrap>
    )
}

export { OpinionHeader }
