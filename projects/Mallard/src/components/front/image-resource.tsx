import React, { useState } from 'react'
import {
    Image,
    ImageProps,
    ImageStyle,
    StyleProp,
    View,
    PixelRatio,
} from 'react-native'
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

const ImageResourceWithWidth = ({
    image,
    style,
    setAspectRatio = false,
    width,
    ...props
}: ImageResourceProps & { width: number }) => {
    const path = useImagePath(image, width)
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

const ImageResource = (props: ImageResourceProps) => {
    const [width, setWidth] = useState<number | null>(null)
    return width ? (
        <ImageResourceWithWidth
            width={width}
            {...props}
        ></ImageResourceWithWidth>
    ) : (
        <View
            style={[props.style]}
            onLayout={ev => {
                setWidth(
                    PixelRatio.getPixelSizeForLayoutSize(
                        ev.nativeEvent.layout.width,
                    ),
                )
            }}
        ></View>
    )
}

export { ImageResource }
