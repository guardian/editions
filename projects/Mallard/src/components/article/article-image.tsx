import React from 'react'
import { StyleSheet, Image } from 'react-native'
import { APIPaths } from 'src/paths'
import { Image as ImageT } from '../../common'
const styles = StyleSheet.create({
    image: {
        width: '100%',
    },
})

const ArticleImage = ({ image, style }: { image: ImageT; style?: {} }) => {
    const imagePath = `${APIPaths.mediaBackend}${APIPaths.media(
        'issue',
        'phone',
        image.source,
        image.path,
    )}`
    return (
        <Image
            style={[styles.image, style]}
            source={{
                uri: imagePath,
            }}
        />
    )
}

export { ArticleImage }
