import React, { useState, useEffect } from 'react'
import { SafeAreaView, View, Animated, StyleSheet } from 'react-native'
import { CreditedImage } from '../../../Apps/common/src'
import { CloseModalButton } from 'src/components/Button/CloseModalButton'
import { getPillarColors } from 'src/helpers/transform'
import { useDimensions } from 'src/hooks/use-config-provider'
import { themeColors } from 'src/components/article/html/helpers/css'
import { ArticleTheme } from 'src/components/article/html/article'
import {
    ProgressIndicator,
    getWindowStart,
    getNewWindowStart,
} from 'src/components/article/progress-indicator'
import { LightboxCaption } from 'src/components/Lightbox/LightboxCaption'
import { LightboxImage } from 'src/components/Lightbox/LightboxImage'
import { TouchableWithoutFeedback } from 'react-native-gesture-handler'
import { palette } from '@guardian/pasteup/palette'
import { NavigationScreenProp } from 'react-navigation'
import { StatusBar } from 'react-native'
import { LightboxNavigationProps } from 'src/navigation/helpers/base'

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
    captionWrapper: {
        position: 'absolute',
        zIndex: 1,
        opacity: 0.8,
        backgroundColor: themeColors(ArticleTheme.Dark).background,
        bottom: 0,
        width: '100%',
    },
    captionText: {
        color: themeColors(ArticleTheme.Dark).dimText,
        paddingLeft: 2,
        paddingBottom: 50,
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

const LightboxScreen = ({
    navigation,
}: {
    navigation: NavigationScreenProp<{}, LightboxNavigationProps>
}) => {
    const images = navigation.getParam('images', [])
    const index = navigation.getParam('index', 0)
    const pillar = navigation.getParam('pillar', 'news')
    const pillarColors = getPillarColors(pillar)
    const { width } = useDimensions()
    const [windowStart, setWindowsStart] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(index)

    const numDots = images.length < 6 ? images.length : 6

    const [captionVisible, setCaptionVisible] = useState(false)

    const [dotsVisible, setDotsVisible] = useState(false)

    const showProgressIndicator = images.length > 1 ? dotsVisible : false

    const [closeButtonVisible, setCloseButtonVisible] = useState(false)

    const handleScrollEndEvent = (ev: any) => {
        const newIndex = Math.ceil(ev.nativeEvent.contentOffset.x / width)
        setCurrentIndex(newIndex)
        setWindowsStart(
            getNewWindowStart(newIndex, windowStart, images.length, numDots),
        )
    }

    const focusOnImageComponent = () => {
        setCaptionVisible(!captionVisible)
        setDotsVisible(!dotsVisible)
        setCloseButtonVisible(!closeButtonVisible)
    }

    useEffect(() => {
        setCaptionVisible(true)
        setDotsVisible(true)
        setCloseButtonVisible(true)
        setCurrentIndex(index)
        setWindowsStart(getWindowStart(index, numDots, images.length))
    }, [index, numDots, images.length])

    return (
        <View style={styles.background}>
            <StatusBar hidden={true} />
            <SafeAreaView>
                <View style={styles.lightboxPage}>
                    <View style={styles.closeButton}>
                        {closeButtonVisible && (
                            <CloseModalButton
                                onPress={() => {
                                    navigation.goBack()
                                }}
                                bgColor={pillarColors.main}
                                borderColor={
                                    pillar === 'neutral'
                                        ? palette.neutral[100]
                                        : pillarColors.main
                                }
                            />
                        )}
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
                            initialScrollIndex={currentIndex}
                            pagingEnabled
                            keyExtractor={(item: CreditedImage) => item.path}
                            key={width}
                            data={images}
                            onMomentumScrollEnd={handleScrollEndEvent}
                            getItemLayout={(_: never, index: number) => ({
                                length: width,
                                offset: width * index,
                                index,
                            })}
                            renderItem={({
                                item,
                            }: {
                                item: CreditedImage
                                index: number
                            }) => {
                                return (
                                    <View
                                        style={[{ width }, styles.imageWrapper]}
                                    >
                                        <TouchableWithoutFeedback
                                            onPress={() =>
                                                focusOnImageComponent()
                                            }
                                        >
                                            <LightboxImage image={item} />
                                        </TouchableWithoutFeedback>
                                        {captionVisible && item.caption && (
                                            <LightboxCaption
                                                caption={item.caption}
                                                pillarColor={
                                                    pillar === 'neutral'
                                                        ? palette.neutral[100]
                                                        : pillarColors.bright //bright since always on a dark background
                                                }
                                                displayCredit={
                                                    item.displayCredit
                                                }
                                                credit={item.credit}
                                            />
                                        )}
                                    </View>
                                )
                            }}
                        />
                    </View>

                    <View style={styles.progressWrapper}>
                        {showProgressIndicator && (
                            <ProgressIndicator
                                currentIndex={currentIndex}
                                imageCount={images.length}
                                windowSize={numDots}
                                windowStart={windowStart}
                            />
                        )}
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}

export { LightboxScreen }
