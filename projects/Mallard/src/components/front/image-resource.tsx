import React, { useState, useEffect } from 'react'
import { Image as IImage } from '../../../../common/src'
import { Image, StyleProp, ImageStyle, ImageProps } from 'react-native'
import { useImagePath } from 'src/hooks/use-image-paths'
import { APIPaths } from 'src/paths'

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
} & Omit<ImageProps, 'source'>

const ImageResource = ({ image, style, ...props }: ImageResourceProps) => {
    const path = useImagePath(image)

    return <Image {...props} style={style} source={{ uri: path }} />
}

const AutoSizedImageResource = ({ image, ...props }: ImageResourceProps) => {
    const [aspectRatio, setRatio] = useState(1)
    const path = useImagePath(image)

    useEffect(() => {
        path &&
            Image.getSize(
                path,
                (width, height) => {
                    setRatio(width / height)
                },
                () => {},
            )
    }, [path])

    return (
        <Image
            {...props}
            style={[
                {
                    aspectRatio,
                },
                props.style,
            ]}
            source={{ uri: path }}
        />
    )
}

export { ImageResource, AutoSizedImageResource }
