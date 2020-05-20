import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Image as IImage } from '../../../../Apps/common/src'
import { useImagePath } from 'src/hooks/use-image-paths'
import { useAspectRatio } from 'src/hooks/use-aspect-ratio'

const styles = StyleSheet.create({
    image: {
        alignSelf: 'center',
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
    },
})

const LightboxImage = ({ image }: { image: IImage }) => {
    const imagePath = useImagePath(image, 'full-size')
    return (
        <Image
            style={styles.image}
            source={{
                uri: imagePath,
            }}
        />
    )
}

export { LightboxImage }
