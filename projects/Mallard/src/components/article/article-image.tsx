import React, { ReactNode } from 'react'
import { StyleSheet, ImageBackground, View } from 'react-native'
import { APIPaths } from 'src/paths'
import { Image as ImageT } from '../../common'
const styles = StyleSheet.create({
    image: {
        width: '100%',
    },
})

const ArticleImage = ({
    image,
    style,
    proxy,
}: {
    image: ImageT
    style?: {}
    proxy: ReactNode
}) => {
    const imagePath = `${APIPaths.mediaBackend}${APIPaths.media(
        'issue',
        'phone',
        image.source,
        image.path,
    )}`
    return (
        <ImageBackground
            style={[styles.image, style]}
            source={{
                uri: imagePath,
            }}
        >
            <View style={{ position: 'absolute', bottom: 0, left: 0 }}>
                {proxy}
            </View>
        </ImageBackground>
    )
}

export { ArticleImage }
