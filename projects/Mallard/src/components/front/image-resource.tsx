import React from 'react'
import { Image as IImage } from '../../../../common/src'
import { Image, StyleProp, ImageStyle } from 'react-native'
import { useImagePath } from 'src/hooks/use-image-paths'

/**
 * This component abstracts away the endpoint for images
 *
 * Bascially it will try to go to the filesystem and if it fails will
 * go to the API
 *
 * This had been implemented using RNFetchBlob.fs.exists, but it's just as slow
 * as this implementation for API calls and seems slower for cache hits
 */
const ImageResource = ({
    image,
    style,
}: {
    image: IImage
    style?: StyleProp<ImageStyle>
}) => {
    const path = useImagePath(image)

    return <Image style={style} source={{ uri: path }} />
}

export { ImageResource }
