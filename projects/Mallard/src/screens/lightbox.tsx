import React, { useContext, useState, useEffect } from 'react'
import {
    Modal,
    SafeAreaView,
    View,
    Image,
    Animated,
    Text,
    StyleSheet,
    Dimensions,
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
import { useDimensions } from 'src/hooks/use-screen'
import { themeColors } from 'src/components/article/html/helpers/css'
import { ArticleTheme } from 'src/components/article/html/article'
import {
    ProgressIndicator,
    getWindowStart,
    getNewWindowStart,
} from 'src/components/article/progress-indicator'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'

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
    imageWrapper: {
        height: '100%',
    },
    image: {
        position: 'absolute',
        width: '100%',
        // bottom: '30%',
    },
    captionWrapper: {
        position: 'absolute',
        zIndex: 1,
        opacity: 0.8,
        backgroundColor: themeColors(ArticleTheme.Dark).background,
        bottom: 0,
        height: '30%',
        width: '100%',
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

const imageBottom = (portrait: boolean, imageHeight: number) => {
    const tallImage = imageHeight / Dimensions.get('window').height > 0.7
    const bottom = portrait || tallImage ? '0%' : '30%'
    return StyleSheet.create({
        bottomOffset: { bottom: bottom },
    })
}

const LightboxCaption = ({
    caption,
    pillarColor,
    captionVisible,
}: {
    caption?: string
    pillarColor: string
    captionVisible: boolean
}) => {
    return (
        <>
            {captionVisible && caption && (
                <View style={styles.captionWrapper}>
                    <View style={styles.caption}>
                        <NativeArrow
                            fill={pillarColor}
                            direction={Direction.top}
                        />
                        <Text style={styles.captionText}>{caption}</Text>
                    </View>
                </View>
            )}
        </>
    )
}

const LightboxImage = ({ image }: { image: ImageElement }) => {
    const imagePath = useImagePath(image.src, 'full-size')
    const aspectRatio = useAspectRatio(imagePath)
    console.warn(aspectRatio)
    console.warn('fixed: ' + aspectRatio.toFixed())
    return (
        <View style={[styles.image, imageBottom(false, 500)]}>
            <Image
                source={{
                    uri: imagePath,
                }}
                style={[{ aspectRatio }]}
            />
        </View>
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

    const [captionVisible, setCaptionVisible] = useState(false)

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

                        <View style={styles.imageWrapper}>
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
                                        <TouchableWithoutFeedback
                                            onPress={() =>
                                                setCaptionVisible(
                                                    !captionVisible,
                                                )
                                            }
                                        >
                                            <View
                                                style={[
                                                    { width },
                                                    styles.imageWrapper,
                                                ]}
                                            >
                                                <LightboxImage image={item} />
                                                <LightboxCaption
                                                    caption={item.caption}
                                                    pillarColor={
                                                        pillarColors.main
                                                    }
                                                    captionVisible={
                                                        captionVisible
                                                    }
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
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
