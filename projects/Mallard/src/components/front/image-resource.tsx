import React from 'react'
import { Image, ImageProps, ImageStyle, StyleProp } from 'react-native'
import { useAspectRatio } from 'src/hooks/use-aspect-ratio'
import { useImagePath } from 'src/hooks/use-image-paths'
import { Image as IImage } from '../../../../common/src'

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
    style?: StyleProp<ImageStyle>
    setAspectRatio?: boolean
} & Omit<ImageProps, 'source'>

const ImageResource = ({
    image,
    style,
    setAspectRatio = false,
    ...props
}: ImageResourceProps) => {
    const path = useImagePath(image)
    const aspectRatio = useAspectRatio(path)
    return (
        <Image
            resizeMethod={'resize'}
            {...props}
            style={[
                style,
                setAspectRatio && aspectRatio ? { aspectRatio } : {},
            ]}
            source={{ uri: path }}
        />
    )
}

export { ImageResource }
