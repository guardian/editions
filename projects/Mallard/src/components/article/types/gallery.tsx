import React, { useState, useEffect } from 'react'
import { GalleryArticle } from 'src/common'
import {
    View,
    Text,
    Image,
    StyleProp,
    StyleSheet,
    ImageStyle,
} from 'react-native'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { UiBodyCopy } from 'src/components/styled-text'
import { APIPaths } from 'src/paths'

const galleryImageStyles = StyleSheet.create({
    root: { backgroundColor: color.skeleton },
})
const GalleryImage = ({
    uri,
    accessibilityLabel,
    style,
}: {
    uri: string
    accessibilityLabel?: string
    style: StyleProp<ImageStyle>
}) => {
    const [aspectRatio, setRatio] = useState(1)

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

const styles = StyleSheet.create({
    background: {
        backgroundColor: color.photoBackground,
        paddingHorizontal: metrics.articleSides,
        paddingTop: metrics.vertical / 2,
    },
    image: {
        marginBottom: metrics.vertical * 2,
        width: '100%',
    },
    caption: {
        marginBottom: metrics.vertical * 2,
        marginTop: metrics.vertical * -1.5,
        color: color.textOverPhotoBackground,
    },
})
const Gallery = ({ gallery }: { gallery: GalleryArticle }) => {
    console.log(gallery)
    return (
        <View style={styles.background}>
            {gallery.elements.map((element, index) => {
                if (element.id === 'image') {
                    return (
                        <>
                            <GalleryImage
                                key={index}
                                accessibilityLabel={element.alt}
                                uri={`${APIPaths.mediaBackend}${APIPaths.media(
                                    'issue',
                                    'phone',
                                    element.src.source,
                                    element.src.path,
                                )}`}
                                style={styles.image}
                            />
                            {element.caption || element.copyright ? (
                                <UiBodyCopy style={styles.caption}>
                                    {[element.caption, element.copyright]
                                        .filter(Boolean)
                                        .join(' - ')}
                                </UiBodyCopy>
                            ) : null}
                        </>
                    )
                }
                return <Text key={index}>{element.id}</Text>
            })}
        </View>
    )
}

export { Gallery }
