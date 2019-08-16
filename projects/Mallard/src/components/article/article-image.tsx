import React, { ReactNode } from 'react'
import { StyleSheet, ImageBackground, View } from 'react-native'
import { imagePath } from 'src/paths'
import { Image as ImageT } from '../../common'

const styles = StyleSheet.create({
    image: {
        width: '100%',
    },
    proxy: { position: 'absolute', bottom: 0, left: 0 },
})

const ArticleImage = ({
    image,
    style,
    proxy,
}: {
    image: ImageT
    style?: {}
    proxy?: ReactNode
}) => {
    return (
        <ImageBackground
            style={[styles.image, style]}
            source={{
                uri: imagePath(image),
            }}
        >
            {proxy && <View style={styles.proxy}>{proxy}</View>}
        </ImageBackground>
    )
}

export { ArticleImage }
