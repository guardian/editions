import React from 'react'
import { Image, ImageProps, ImageStyle, StyleProp, View } from 'react-native'
import { useAspectRatio } from 'src/hooks/use-aspect-ratio'
import { useImagePath } from 'src/hooks/use-image-paths'
import { Image as IImage, ImageUse } from '../../../../Apps/common/src'

/**
 * This component abstracts away the endpoint for images
 *
 * Bascially it will try to go to the filesystem and if it fails will
 * go to the API
 *
 * This had been implemented using RNFetchBlob.fs.exists, but it's just as slow
 * as this implementation for API calls and seems slower for cache hits
 */
type ImageResourceProps = {
    image: IImage
    use: ImageUse
    style?: StyleProp<ImageStyle>
    setAspectRatio?: boolean
    devUri?: string
} & Omit<ImageProps, 'source'>

const ImageResource = ({
    image,
    style,
    setAspectRatio = false,
    use,
    devUri,
    ...props
}: ImageResourceProps) => {
    const imagePath = useImagePath(image, use)
    const aspectRatio = useAspectRatio(imagePath)
    const styles = [style, setAspectRatio && aspectRatio ? { aspectRatio } : {}]

    return imagePath || devUri ? (
        <Image
            key={imagePath}
            resizeMethod={'resize'}
            {...props}
            style={[styles, style]}
            source={{ uri: devUri || imagePath }}
        />
    ) : (
        <View style={styles}></View>
    )
}

export { ImageResource }
