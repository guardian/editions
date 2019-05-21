import React from 'react'
import { StyleSheet, Image } from 'react-native'

const styles = StyleSheet.create({
    image: {
        width: '100%',
        backgroundColor: 'rgba(0,0,0,.25)',
    },
})

const ArticleImage = ({ image, style }: { image: string; style?: {} }) => (
    <Image
        style={[styles.image, style]}
        source={{
            uri: image,
        }}
    />
)

export { ArticleImage }
