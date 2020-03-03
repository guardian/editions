import React, { useContext, useState, useEffect } from 'react'
import {
    Modal,
    SafeAreaView,
    View,
    Image,
    Animated,
    Text,
    StyleSheet,
} from 'react-native'
import { LightboxContext, LightboxContextType } from './use-lightbox-modal'
import {
    ImageElement,
    Direction,
    ArticlePillar,
} from '../../../Apps/common/src'
import { useAspectRatio } from 'src/hooks/use-aspect-ratio'
import { CloseModalButton } from 'src/components/button/close-modal-button'
import { useImagePath } from 'src/hooks/use-image-paths'
import { NativeArrow } from 'src/components/article/html/components/icon/native-arrow'
import { getPillarColors } from 'src/helpers/transform'
import { useDimensions } from 'src/hooks/use-config-provider'
import { themeColors } from 'src/components/article/html/helpers/css'
import { ArticleTheme } from 'src/components/article/html/article'
import {
    ProgressIndicator,
    getWindowStart,
    getNewWindowStart,
} from 'src/components/article/progress-indicator'

const styles = StyleSheet.create({
    lightboxPage: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
    },
    background: {
        height: '100%',
        backgroundColor: themeColors(ArticleTheme.Dark).background,
    },
    caption: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 5,
        paddingHorizontal: 10,
    },
    captionText: {
        color: themeColors(ArticleTheme.Dark).dimText,
        paddingLeft: 2,
    },
    closeButton: {
        position: 'absolute',
        zIndex: 1,
        right: 0,
        paddingTop: 10,
        paddingRight: 10,
        top: 0,
    },
    progressWrapper: {
        position: 'absolute',
        bottom: 0,
        paddingBottom: 20,
        width: '100%',
    },
})

const LightboxImage = ({
    image,
    arrowColor,
}: {
    image: ImageElement
    arrowColor: string
}) => {
    const imagePath = useImagePath(image.src, 'full-size')
    const aspectRatio = useAspectRatio(imagePath)

    return (
        <>
            <Image
                source={{
                    uri: imagePath,
                }}
                style={{ aspectRatio }}
            />
            <View style={styles.caption}>
                <NativeArrow fill={arrowColor} direction={Direction.top} />
                {image.caption && (
                    <Text style={styles.captionText}>{image.caption}</Text>
                )}
            </View>
        </>
    )
}

export const LightboxScreen = ({
    images,
    visible,
    closeLightbox,
    pillar,
    index,
}: {
    images: ImageElement[]
    visible: boolean
    closeLightbox: () => void
    pillar: ArticlePillar
    index: number
}) => {
    const pillarColors = getPillarColors(pillar)
    const { width } = useDimensions()
    const [windowStart, setWindowsStart] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(index)

    const numDots = images.length < 6 ? images.length : 6

    useEffect(() => {
        setCurrentIndex(index)
        setWindowsStart(getWindowStart(index, numDots, images.length))
    }, [visible, index, numDots, images.length])

    return (
        <Modal visible={visible}>
            <View style={styles.background}>
                <SafeAreaView>
                    <View style={styles.lightboxPage}>
                        <View style={styles.closeButton}>
                            <CloseModalButton
                                onPress={() => {
                                    closeLightbox()
                                }}
                                color={pillarColors.main}
                            />
                        </View>
                        <View>
                            <Animated.FlatList
                                showsHorizontalScrollIndicator={false}
                                showsVerticalScrollIndicator={false}
                                scrollEventThrottle={1}
                                maxToRenderPerBatch={1}
                                windowSize={2}
                                initialNumToRender={1}
                                horizontal={true}
                                initialScrollIndex={index}
                                pagingEnabled
                                keyExtractor={(item: ImageElement) =>
                                    item.src.path
                                }
                                data={images}
                                onScrollEndDrag={(ev: any) => {
                                    const newIndex =
                                        ev.nativeEvent.targetContentOffset.x /
                                        width
                                    setCurrentIndex(newIndex)
                                    setWindowsStart(
                                        getNewWindowStart(
                                            newIndex,
                                            windowStart,
                                            images.length,
                                            numDots,
                                        ),
                                    )
                                }}
                                getItemLayout={(_: never, index: number) => ({
                                    length: width,
                                    offset: width * index,
                                    index,
                                })}
                                renderItem={({
                                    item,
                                }: {
                                    item: ImageElement
                                    index: number
                                }) => {
                                    return (
                                        <View style={[{ width }]}>
                                            <LightboxImage
                                                image={item}
                                                arrowColor={pillarColors.main}
                                            />
                                        </View>
                                    )
                                }}
                            />
                        </View>
                        <View style={styles.progressWrapper}>
                            <ProgressIndicator
                                currentIndex={currentIndex}
                                imageCount={images.length}
                                windowSize={numDots}
                                windowStart={windowStart}
                            />
                        </View>
                    </View>
                </SafeAreaView>
            </View>
        </Modal>
    )
}

export const Lightbox = () => {
    const lightboxContext: LightboxContextType = useContext(LightboxContext)
    return (
        <LightboxScreen
            images={lightboxContext.images}
            visible={lightboxContext.visible}
            closeLightbox={() => lightboxContext.setLightboxVisible(false)}
            pillar={'sport'}
            index={lightboxContext.index}
        />
    )
}
