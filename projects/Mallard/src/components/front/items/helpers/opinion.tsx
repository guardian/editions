import React from 'react'
import { ImageStyle, StyleProp } from 'react-native'
import FastImage from 'react-native-fast-image'
import { Image as ImageType } from 'src/common'
import { useImagePath } from 'src/hooks/use-image-paths'

const cutoutStyles = {
    root: {
        aspectRatio: 1.2,
        width: '100%',
    },
}

export const BylineCutout = ({
    cutout,
    style,
}: {
    cutout: ImageType
    style?: StyleProp<ImageStyle>
}) => (
    <FastImage
        resizeMode={'contain'}
        source={{
            uri: useImagePath(cutout),
        }}
        style={[cutoutStyles.root, style]}
    />
)
