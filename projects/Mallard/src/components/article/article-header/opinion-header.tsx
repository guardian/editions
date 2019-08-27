import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
    StyleProp,
    ImageStyle,
} from 'react-native'
import { metrics } from 'src/theme/spacing'
import { ArticleImage } from '../article-image'
import { ArticleStandfirst } from '../article-standfirst'
import { ArticleHeaderProps } from './types'
import { ArticleHeadline } from '../article-headline'
import Quote from 'src/components/icons/Quote'
import { getFont } from 'src/theme/typography'
import { color } from 'src/theme/color'
import { useArticle } from 'src/hooks/use-article'
import { MultilineWrap } from '../wrap/multiline-wrap'
import { HeadlineTypeWrap } from './shared'
import { Fader } from 'src/components/layout/animators/fader'
import { Image as ImageType } from 'src/common'
import { imagePath } from 'src/paths'

const ArticleFader = Fader

const styles = StyleSheet.create({
    innerWrap: {
        paddingBottom: metrics.vertical,
    },
    byline: {
        fontFamily: getFont('titlepiece', 1).fontFamily,
        width: '100%',
        paddingRight: 0,
    },
    headlineContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    flexRow: {
        flexDirection: 'row',
        width: '100%',
    },
    cutoutContainer: {
        flexBasis: '40%',
        marginLeft: '-20%',
        marginRight: '-5%',
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
    },
})

const cutoutStyles = {
    root: {
        aspectRatio: 1.2,
        width: '100%',
    },
}

export const BylineCutout = ({
    cutout,
    style,
}: {
    cutout: ImageType
    style?: StyleProp<ImageStyle>
}) => (
    <Image
        resizeMode={'contain'}
        source={{ uri: imagePath(cutout) }}
        style={[cutoutStyles.root, style]}
    />
)

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
                    <HeadlineTypeWrap>
                        <View style={[styles.innerWrap]}>
                            <ArticleStandfirst {...{ standfirst }} />
                        </View>
                    </HeadlineTypeWrap>
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
                        <HeadlineTypeWrap>
                            <ArticleHeadline
                                icon={{
                                    width: 38,
                                    element: scale => (
                                        <Quote
                                            scale={0.9 / scale}
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
                        </HeadlineTypeWrap>
                    </View>
                    {bylineImages && bylineImages.cutout ? (
                        <View style={styles.cutoutContainer}>
                            <BylineCutout cutout={bylineImages.cutout} />
                        </View>
                    ) : null}
                </View>
            </ArticleFader>
        </MultilineWrap>
    )
}

export { OpinionHeader }
