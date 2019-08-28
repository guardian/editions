import React, { useState, useEffect } from 'react'
import { Image as IImage } from '../../../../common/src'
import { Image, StyleProp, ImageStyle, ImageProps } from 'react-native'
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
type ImageResourceProps = {
    image: IImage
    style?: StyleProp<ImageStyle>
    onGetPath?: (path: string) => void
} & Omit<ImageProps, 'source'>

const ImageResource = ({
    image,
    style,
    onGetPath,
    ...props
}: ImageResourceProps) => {
    const path = useImagePath(image)
    useEffect(() => {
        onGetPath && path && onGetPath(path)
    }, [path, onGetPath])
    return <Image {...props} style={style} source={{ uri: path }} />
}

const AutoSizedImageResource = ({
    ...props
}: Omit<ImageResourceProps, 'onGetPath'>) => {
    const [aspectRatio, setRatio] = useState(1)

    return (
        <ImageResource
            {...props}
            style={[
                {
                    aspectRatio,
                },
                props.style,
            ]}
            onGetPath={path => {
                Image.getSize(
                    path,
                    (width, height) => {
                        setRatio(width / height)
                    },
                    () => {},
                )
            }}
        />
    )
}

export { ImageResource, AutoSizedImageResource }
