import React, { ReactNode } from 'react'
import { ImageBackground, StyleSheet, View } from 'react-native'
import { useDimensions, useMediaQuery } from 'src/hooks/use-screen'
import { imagePath } from 'src/paths'
import { Breakpoints } from 'src/theme/breakpoints'
import { Image as ImageT } from '../../common'

const styles = StyleSheet.create({
    image: {
        width: '100%',
    },
    proxy: { position: 'absolute', bottom: 0, left: 0 },
})

interface PropTypes {
    image: ImageT
    style?: {}
    proxy?: ReactNode
    aspectRatio?: number
}

const ArticleImage = ({ image, style, proxy, aspectRatio }: PropTypes) => {
    const isLandscape = useMediaQuery(
        width => width >= Breakpoints.tabletLandscape,
    )

    const defaultAspectRatio = isLandscape ? 2 : 1.5

    return (
        <ImageBackground
            style={[
                styles.image,
                style,
                {
                    aspectRatio: aspectRatio ? aspectRatio : defaultAspectRatio,
                },
            ]}
            source={{
                uri: imagePath(image),
            }}
        >
            {proxy && <View style={styles.proxy}>{proxy}</View>}
        </ImageBackground>
    )
}

const CoverImage = ({ ...props }: Omit<PropTypes, 'style' | 'aspectRatio'>) => {
    const { height } = useDimensions()
    return (
        <ArticleImage
            {...props}
            style={{ width: '100%', height: height * 0.75 }}
        />
    )
}

export { ArticleImage, CoverImage }
