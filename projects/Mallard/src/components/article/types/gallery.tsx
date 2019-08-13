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
import { UiBodyCopy } from 'src/components/styled-text'
import { APIPaths } from 'src/paths'
import { WithBreakpoints } from 'src/components/layout/ui/with-breakpoints'
import { Breakpoints } from 'src/theme/breakpoints'
import { Wrap } from '../wrap/wrap'

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
        paddingTop: metrics.vertical * 1,
        paddingBottom: metrics.vertical * 2,
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
    return (
        <WithBreakpoints>
            {{
                0: () => (
                    <View style={styles.spacer}>
                        <GalleryImage
                            accessibilityLabel={element.alt}
                            src={element.src}
                            style={styles.image}
                        />
                        <Caption element={element} />
                    </View>
                ),
                [Breakpoints.tabletVertical]: () => (
                    <View style={[styles.spacer, { flexDirection: 'row' }]}>
                        <GalleryImage
                            accessibilityLabel={element.alt}
                            src={element.src}
                            style={[styles.image, { width: '75%' }]}
                        />
                        <View
                            style={[
                                {
                                    flexShrink: 1,
                                    marginLeft: metrics.article.sides * 2,
                                    marginRight: metrics.article.sides * 2,
                                },
                            ]}
                        >
                            <Caption element={element} />
                        </View>
                    </View>
                ),
            }}
        </WithBreakpoints>
    )
}

const Gallery = ({ gallery }: { gallery: GalleryArticle }) => {
    console.log(gallery)
    return (
        <View style={styles.background}>
            {gallery.elements.map((element, index) => {
                if (element.id === 'image') {
                    return <GalleryItem element={element} />
                }
                return <Text key={index}>{element.id}</Text>
            })}
        </View>
    )
}

export { Gallery }
