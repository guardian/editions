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
import { useImagePath, useScaledImage } from 'src/hooks/use-image-paths'
import { Image as IImage, ImageUse } from '../../../../common/src'

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
} & Omit<ImageProps, 'source'>

const ScaledImageResource = ({
    imagePath,
    style,
    width,
    ...props
}: {
    width: number
    imagePath: string
    style?: StyleProp<ImageStyle>
}) => {
    const uri = useScaledImage(imagePath, width)
    return (
        <Image
            resizeMethod={'resize'}
            {...props}
            style={style}
            source={{ uri }}
        />
    )
}

const ImageResource = ({
    image,
    style,
    setAspectRatio = false,
    use, //eslint-disable-line
    ...props
}: ImageResourceProps) => {
    const [width, setWidth] = useState<number | null>(null)
    const imagePath = useImagePath(image, 'full-size') //TODO: This should be changed to use once we have a good amount of content published with trail thumbs
    const aspectRatio = useAspectRatio(imagePath)
    const styles = [style, setAspectRatio && aspectRatio ? { aspectRatio } : {}]

    return width && imagePath ? (
        <ScaledImageResource
            key={imagePath} // an attempt to fix https://github.com/facebook/react-native/issues/9195
            width={width}
            imagePath={imagePath}
            style={styles}
            {...props}
        ></ScaledImageResource>
    ) : (
        <View
            style={styles}
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
