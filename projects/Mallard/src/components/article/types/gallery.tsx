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
import { Wrap } from '../wrap/wrap'
import { palette } from '@guardian/pasteup/palette'
import { Multiline } from 'src/components/multiline'

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
        paddingVertical: metrics.vertical * 0.5,
    },
})

const GalleryItem = ({ element }: { element: ImageElement }) => {
    return (
        <Wrap style={styles.spacer} rightRail={<Caption element={element} />}>
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
        <Wrap
            bleeds
            borderColor={color.palette.neutral[60]}
            style={styles.spacer}
            rightRail={
                <View>
                    <HeadlineText>{headline}</HeadlineText>
                    {standfirst && (
                        <StandfirstText>{standfirst}</StandfirstText>
                    )}
                    {byline && (
                        <View>
                            <Multiline></Multiline>
                            <UiBodyCopy>{byline}</UiBodyCopy>
                        </View>
                    )}
                </View>
            }
        >
            {element && (
                <Image
                    style={{ width: '100%', flexGrow: 1, minHeight: 400 }}
                    source={{
                        uri: imagePath(element),
                    }}
                />
            )}
        </Wrap>
    )
}

const Gallery = ({ gallery }: { gallery: GalleryArticle }) => {
    console.log(gallery)
    return (
        <>
            <View
                style={[
                    styles.background,
                    { backgroundColor: color.palette.neutral[60] },
                ]}
            >
                <GalleryCoverItem
                    element={gallery.image}
                    headline={gallery.headline}
                    byline={gallery.byline}
                    standfirst={gallery.standfirst}
                ></GalleryCoverItem>
            </View>
            <View
                style={[
                    styles.background,
                    { paddingVertical: metrics.vertical * 0.5 },
                ]}
            >
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
