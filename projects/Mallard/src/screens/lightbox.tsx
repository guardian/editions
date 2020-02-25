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

const styles = StyleSheet.create({
    lightboxPage: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    background: {
        height: '100%',
        backgroundColor: themeColors(ArticleTheme.Dark).background,
    },
    caption: {
        display: 'flex',
        flexDirection: 'row',
        paddingTop: 5,
        paddingHorizontal: 5,
    },
    captionText: {
        color: themeColors(ArticleTheme.Dark).dimText,
    },
    closeButton: {
        position: 'absolute',
        zIndex: 1,
        right: 0,
        paddingTop: 10,
        paddingRight: 10,
    },
    progressIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressWrapper: {
        position: 'absolute',
        bottom: 0,
        paddingBottom: 20,
        width: '100%',
    },
})

type ProgressType = 'current' | 'small' | 'big'

type ProgressIndicatorProps = {
    imageCount: number
    currentIndex: number
    windowStart: number
    windowSize: number
}

const progressStyle = (type: ProgressType) => {
    const diameter = type === 'small' ? 5 : 10
    const colour =
        type === 'current' ? 'white' : themeColors(ArticleTheme.Dark).line
    return {
        width: diameter,
        height: diameter,
        borderRadius: diameter / 2,
        backgroundColor: colour,
        margin: 3,
    }
}

const ProgressCircle = ({ type }: { type: ProgressType }) => {
    return <View style={progressStyle(type)} />
}

const ProgressIndicator = ({
    imageCount,
    currentIndex,
    windowStart,
    windowSize,
}: ProgressIndicatorProps) => {
    const current = currentIndex - windowStart
    const showStarter = windowStart > 0
    const showEnd = imageCount > windowStart + windowSize
    const circles = Array(windowSize)
        .fill('', 0)
        .map((e, index) =>
            (showStarter && index === 0) ||
            (showEnd && index === windowSize - 1)
                ? 'small'
                : index === current
                ? 'current'
                : 'big',
        )

    return (
        <View style={styles.progressIndicator}>
            {circles.map((t, i) => (
                <ProgressCircle type={t} key={`circle-${i}`} />
            ))}
        </View>
    )
}

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

    const maxDots = 6

    const resetProgressState = () => {
        setCurrentIndex(index)

        if (index >= maxDots) {
            // if we're not at the start or the end stick the dot in the middle
            if (index < images.length - maxDots) {
                setWindowsStart(index - 2)
            } else {
                setWindowsStart(images.length - maxDots)
            }
        } else {
            setWindowsStart(0)
        }
    }

    useEffect(() => resetProgressState(), [visible])

    console.log(Dimensions.get('window').width)

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
                            keyExtractor={(item: ImageElement) => item.src.path}
                            data={images}
                            onScrollEndDrag={(ev: any) => {
                                const newIndex =
                                    ev.nativeEvent.targetContentOffset.x / width
                                setCurrentIndex(newIndex)
                                console.log(
                                    'newindex, windowStart, maxDots',
                                    newIndex,
                                    windowStart,
                                    maxDots,
                                )
                                if (
                                    newIndex >= windowStart + maxDots - 1 &&
                                    newIndex < images.length - 1
                                ) {
                                    setWindowsStart(windowStart + 1)
                                }
                                if (
                                    newIndex <= windowStart &&
                                    windowStart > 0
                                ) {
                                    setWindowsStart(windowStart - 1)
                                }
                            }}
                            getItemLayout={(_: never, index: number) => ({
                                length: width,
                                offset: width * index,
                                index,
                            })}
                            renderItem={({
                                item,
                                index,
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
                        <View style={styles.progressWrapper}>
                            <ProgressIndicator
                                currentIndex={currentIndex}
                                imageCount={images.length}
                                windowSize={maxDots}
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
