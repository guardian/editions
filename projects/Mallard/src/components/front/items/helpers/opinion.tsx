import React from 'react'
import { Image, ImageStyle, StyleProp } from 'react-native'
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
    <Image
        resizeMode={'contain'}
        source={{
            uri: useImagePath(cutout),
        }}
        style={[cutoutStyles.root, style]}
    />
)
