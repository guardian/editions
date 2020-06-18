import React, { useState, useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { CloseModalButton } from 'src/components/Button/CloseModalButton'
import { getPillarColors } from 'src/helpers/transform'
import { themeColors } from 'src/components/article/html/helpers/css'
import { ArticleTheme } from 'src/components/article/html/article'
import { LightboxCaption } from 'src/components/Lightbox/LightboxCaption'
import {
    ProgressIndicator,
    getWindowStart,
    getNewWindowStart,
} from 'src/components/article/progress-indicator'
import { palette } from '@guardian/pasteup/palette'
import { NavigationScreenProp } from 'react-navigation'
import { StatusBar } from 'react-native'
import { LightboxNavigationProps } from 'src/navigation/helpers/base'
import ImageViewer from 'react-native-image-zoom-viewer'
import { selectImagePath } from 'src/hooks/use-image-paths'
import { useApiUrl } from 'src/hooks/use-settings'
import { useIssueSummary } from 'src/hooks/use-issue-summary'
import { Image } from 'src/common'
import { useDimensions } from 'src/hooks/use-config-provider'
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
        alignSelf: 'center',
        height: '100%',
        width: '100%',
        resizeMode: 'contain',
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
        paddingTop: 20,
        paddingRight: 20,
        top: 0,
    },
    progressWrapper: {
        position: 'absolute',
        bottom: 0,
        paddingBottom: 20,
        width: '100%',
        zIndex: 2,
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
    const [windowStart, setWindowsStart] = useState(0)
    const [currentIndex, setCurrentIndex] = useState(index)

    const numDots = images.length < 6 ? images.length : 6

    const [captionVisible, setCaptionVisible] = useState(false)

    const [dotsVisible, setDotsVisible] = useState(false)

    const showProgressIndicator = images.length > 1 ? dotsVisible : false

    const [closeButtonVisible, setCloseButtonVisible] = useState(false)

    const [scrollInProgress, setScrollInProgress] = useState(false)

    const [imagePaths, setImagePaths] = useState([''])

    const { width, height } = useDimensions()

    const handleScrollStartEvent = () => {
        setScrollInProgress(true)
    }
    const handleOnMoveEvent = (index: number) => {
        setCurrentIndex(index)
        setWindowsStart(
            getNewWindowStart(index, windowStart, images.length, numDots),
        )
        setScrollInProgress(false)
    }

    const apiUrl = useApiUrl() || ''
    const { issueId } = useIssueSummary()

    const focusOnImageComponent = () => {
        setCaptionVisible(!captionVisible)
        setDotsVisible(!dotsVisible)
        setCloseButtonVisible(!closeButtonVisible)
    }

    const lightboxImages = []
    for (let i = 0; i < images.length; i++) {
        lightboxImages.push({
            url: imagePaths[i],
            width: width,
            height: height,
            props: {
                alignSelf: 'center',
                height: '100%',
                width: '100%',
                resizeMode: 'contain',
            },
        })
    }
    useEffect(() => {
        const getImagePathFromImage = async (image: Image) => {
            if (issueId && image) {
                const { localIssueId, publishedIssueId } = issueId
                const imagePath = await selectImagePath(
                    apiUrl,
                    localIssueId,
                    publishedIssueId,
                    image,
                    'full-size',
                )
                return imagePath
            }
            return ''
        }
        const fetchImagePaths = async () => {
            return await Promise.all(
                images.map(image => getImagePathFromImage(image)),
            )
        }
        fetchImagePaths().then(imagePaths => setImagePaths(imagePaths))
    }, [apiUrl, images, issueId, width, height])

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
                    <ImageViewer
                        imageUrls={lightboxImages}
                        index={index}
                        renderIndicator={() => <View />} // empty indicator
                        onClick={focusOnImageComponent}
                        onMove={handleScrollStartEvent}
                        onChange={index => handleOnMoveEvent(index || 0)} // seems that first index is nil?
                        saveToLocalByLongPress={false}
                        footerContainerStyle={{
                            position: 'absolute',
                            bottom: 0,
                            width: '100%',
                        }}
                        renderFooter={() => (
                            <View pointerEvents="none">
                                <View style={styles.progressWrapper}>
                                    {showProgressIndicator && (
                                        <ProgressIndicator
                                            currentIndex={currentIndex}
                                            imageCount={images.length}
                                            windowSize={numDots}
                                            windowStart={windowStart}
                                            scrollInProgress={scrollInProgress}
                                        />
                                    )}
                                </View>
                                {captionVisible &&
                                    images[currentIndex].caption && (
                                        <LightboxCaption
                                            caption={
                                                images[currentIndex].caption ||
                                                ''
                                            }
                                            pillarColor={
                                                pillar === 'neutral'
                                                    ? palette.neutral[100]
                                                    : pillarColors.bright //bright since always on a dark background
                                            }
                                            displayCredit={
                                                images[currentIndex]
                                                    .displayCredit
                                            }
                                            credit={images[currentIndex].credit}
                                        />
                                    )}
                            </View>
                        )}
                    />
                </View>
            </View>
        </View>
    )
}

export { LightboxScreen }
