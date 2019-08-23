import React, { ReactNode } from 'react'
import { StyleSheet, ImageBackground, View } from 'react-native'
import { imagePath } from 'src/paths'
import { Image as ImageT } from '../../common'
import { useMediaQuery } from 'src/hooks/use-screen'
import { Breakpoints } from 'src/theme/breakpoints'

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
    aspectRatio,
}: {
    image: ImageT
    style?: {}
    proxy?: ReactNode
    aspectRatio?: number
}) => {
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

export { ArticleImage }
