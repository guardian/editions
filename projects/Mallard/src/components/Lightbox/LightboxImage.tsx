import React from 'react'
import { View, Image, StyleSheet } from 'react-native'
import { Image as IImage } from '../../../../Apps/common/src'
import { useImagePath } from 'src/hooks/use-image-paths'
import { useAspectRatio } from 'src/hooks/use-aspect-ratio'

const styles = StyleSheet.create({
    image: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
    },
})

const LightboxImage = ({ image }: { image: IImage }) => {
    const imagePath = useImagePath(image, 'full-size')
    console.log(imagePath)
    const aspectRatio = useAspectRatio(imagePath)
    return (
        <View style={styles.image}>
            <Image
                source={{
                    uri: imagePath,
                }}
                style={{ aspectRatio }}
            />
        </View>
    )
}

export { LightboxImage }
