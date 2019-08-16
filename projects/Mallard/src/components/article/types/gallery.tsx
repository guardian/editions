import React, { useState, useEffect } from 'react'
import { GalleryArticle, ImageElement, Image as ImageType } from 'src/common'
import {
    View,
    Text,
    Image,
    StyleProp,
    StyleSheet,
    ImageStyle,
    TextStyle,
} from 'react-native'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import {
    UiBodyCopy,
    HeadlineText,
    StandfirstText,
} from 'src/components/styled-text'
import { APIPaths, imagePath } from 'src/paths'
import { Wrap, MultilineWrap } from '../wrap/wrap'
import { ArticleByline } from '../article-byline'
import { getFont } from 'src/theme/typography'
import { useArticle } from 'src/hooks/use-article'
import { BigArrow, BigArrowDirection } from 'src/components/icons/BigArrow'
import { Breakpoints } from 'src/theme/breakpoints'

const galleryImageStyles = StyleSheet.create({
    root: { backgroundColor: color.skeleton },
})
const GalleryImage = ({
    src,
    accessibilityLabel,
    style,
}: {
    src: ImageType
    accessibilityLabel?: string
    style: StyleProp<ImageStyle>
}) => {
    const [aspectRatio, setRatio] = useState(1)
    const uri = `${APIPaths.mediaBackend}${APIPaths.media(
        'issue',
        'phone',
        src.source,
        src.path,
    )}`

    useEffect(() => {
        Image.getSize(
            uri,
            (width, height) => {
                setRatio(width / height)
            },
            () => {},
        )
    }, [uri])

    return (
        <Image
            accessibilityLabel={accessibilityLabel}
            source={{ uri }}
            style={[
                style,
                galleryImageStyles.root,
                {
                    aspectRatio,
                },
            ]}
        />
    )
}

const captionStyles = StyleSheet.create({
    root: {
        color: color.textOverPhotoBackground,
        ...getFont('sans', 0.9),
    },
})
const Caption = ({
    element,
    style,
}: {
    element: ImageElement
    style?: StyleProp<TextStyle>
}) =>
    element.caption || element.copyright ? (
        <UiBodyCopy style={[style, captionStyles.root]}>
            {[element.caption, element.copyright].filter(Boolean).join(' - ')}
        </UiBodyCopy>
    ) : null

const styles = StyleSheet.create({
    background: {
        backgroundColor: color.photoBackground,
    },
    image: {
        width: '100%',
    },
    spacer: {
        paddingVertical: metrics.vertical * 0.6,
    },
    whiteText: { color: color.palette.neutral[100] },
    arrowContainer: {
        paddingLeft: 10,
    },
    arrowContainerMobile: {
        paddingBottom: metrics.vertical,
    },
    arrow: { position: 'absolute', top: 3, left: -2 },
})

const GalleryItem = ({ element }: { element: ImageElement }) => {
    const [color] = useArticle()
    return (
        <Wrap
            borderColor={styles.whiteText.color}
            style={styles.spacer}
            rightRail={size => (
                <View
                    style={[
                        styles.arrowContainer,
                        size < Breakpoints.tabletVertical &&
                            styles.arrowContainerMobile,
                    ]}
                >
                    <View style={styles.arrow}>
                        <BigArrow
                            direction={
                                size < Breakpoints.tabletVertical
                                    ? BigArrowDirection.top
                                    : BigArrowDirection.left
                            }
                            scale={1.2}
                            fill={color.main}
                        ></BigArrow>
                    </View>
                    <Caption element={element} />
                </View>
            )}
        >
            <GalleryImage
                accessibilityLabel={element.alt}
                src={element.src}
                style={styles.image}
            />
        </Wrap>
    )
}

const GalleryCoverItem = ({
    element,
    headline,
    byline,
    standfirst,
}: {
    element?: ImageType
    headline: GalleryArticle['headline']
    byline: GalleryArticle['byline']
    standfirst: GalleryArticle['standfirst']
}) => {
    return (
        <>
            {element && (
                <Image
                    style={{ width: '100%', flexGrow: 1, minHeight: 400 }}
                    source={{
                        uri: imagePath(element),
                    }}
                />
            )}

            <MultilineWrap
                byline={
                    <ArticleByline style={styles.whiteText}>
                        {byline || ''}
                    </ArticleByline>
                }
                borderColor={styles.whiteText.color}
                multilineColor={styles.whiteText.color}
            >
                <View style={{ paddingBottom: metrics.vertical * 2 }}>
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
                        <StandfirstText style={styles.whiteText}>
                            {standfirst}
                        </StandfirstText>
                    )}
                </View>
            </MultilineWrap>
        </>
    )
}

const Gallery = ({ gallery }: { gallery: GalleryArticle }) => {
    return (
        <>
            <View style={[styles.background]}>
                <GalleryCoverItem
                    element={gallery.image}
                    headline={gallery.headline}
                    byline={gallery.byline}
                    standfirst={gallery.standfirst}
                ></GalleryCoverItem>
            </View>
            <View
                style={{
                    height: 1,
                    width: '100%',
                    backgroundColor: color.palette.neutral[46],
                    marginTop: -1,
                }}
            ></View>
            <View style={[styles.background]}>
                {gallery.elements.map((element, index) => {
                    if (element.id === 'image') {
                        return <GalleryItem element={element} />
                    }
                    return <Text key={index}>{element.id}</Text>
                })}
            </View>
        </>
    )
}

export { Gallery }
