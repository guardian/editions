import React, { ReactNode, useState } from 'react'
import { StyleSheet, ImageBackground, View, Text } from 'react-native'
import { CreditedImage } from '../../common'
import { useMediaQuery } from 'src/hooks/use-screen'
import { Breakpoints } from 'src/theme/breakpoints'
import { useImagePath } from 'src/hooks/use-image-paths'
import { Button } from '../button/button'
import { useArticle } from 'src/hooks/use-article'
import { color } from 'src/theme/color'
import { UiBodyCopy } from '../styled-text'

const styles = StyleSheet.create({
    wrapper: {
        backgroundColor: 'black',
        padding: 10,
        width: '100%',
    },
    credit: {
        color: color.palette.neutral[100],
    },
    button: {
        position: 'absolute',
        bottom: 10,
        right: 10,
    },
    buttonText: {
        color: color.palette.neutral[100],
    },
    proxy: { position: 'absolute', bottom: 0, left: 0 },
})

interface PropTypes {
    image: CreditedImage
    style?: {}
    proxy?: ReactNode
    aspectRatio?: number
}

const ArticleImage = ({ image, style, proxy, aspectRatio }: PropTypes) => {
    const isLandscape = useMediaQuery(
        width => width >= Breakpoints.tabletLandscape,
    )

    const defaultAspectRatio = isLandscape ? 2 : 1.5

    const path = useImagePath(image)

    const [showCredit, setShowCredit] = useState(false)
    const toggleCredit = () => setShowCredit(curr => !curr)
    const [colors] = useArticle()

    return (
        <View
            style={[
                style,
                styles.wrapper,
                { aspectRatio: aspectRatio ? aspectRatio : defaultAspectRatio },
            ]}
        >
            {image.credit && (
                <UiBodyCopy
                    weight="bold"
                    style={[
                        styles.credit,
                        {
                            display: showCredit ? 'flex' : 'none',
                        },
                    ]}
                >
                    {image.credit}
                </UiBodyCopy>
            )}
            <ImageBackground
                resizeMethod={'resize'}
                style={[
                    StyleSheet.absoluteFillObject,
                    {
                        display: showCredit ? 'none' : 'flex',
                    },
                ]}
                source={{
                    uri: path,
                }}
            >
                {proxy && <View style={styles.proxy}>{proxy}</View>}
            </ImageBackground>
            {image.credit && (
                <Button
                    alt="Toggle credit"
                    icon={showCredit ? '' : ''}
                    onPress={toggleCredit}
                    style={styles.button}
                    buttonStyles={{
                        backgroundColor: colors.bright,
                    }}
                    textStyles={styles.buttonText}
                />
            )}
        </View>
    )
}

const CoverImage = ({
    small,
    ...props
}: Omit<PropTypes, 'style' | 'aspectRatio'> & { small?: boolean }) => {
    return <ArticleImage {...props} aspectRatio={small ? 1.18 : 0.95} />
}

export { ArticleImage, CoverImage }
