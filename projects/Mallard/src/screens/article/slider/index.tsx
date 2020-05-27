import ViewPagerAndroid from '@react-native-community/viewpager'
import React, { useEffect, useRef, useState } from 'react'
import { Animated, Platform, StyleSheet, View } from 'react-native'
import { AnimatedFlatListRef } from 'src/components/front/helpers/helpers'
import { supportsAnimation } from 'src/helpers/features'
import { clamp } from 'src/helpers/math'
import { getColor } from 'src/helpers/transform'
import { getAppearancePillar } from 'src/hooks/use-article'
import { useDismissArticle } from 'src/hooks/use-dismiss-article'
import { useSetNavPosition } from 'src/hooks/use-nav-position'
import { useDimensions } from 'src/hooks/use-config-provider'
import { ArticleSpec, getArticleDataFromNavigator } from '../../article-screen'
import { ArticleScreenBody, OnIsAtTopChange } from '../body'
import { ArticleNavigator } from 'src/screens/article-screen'
import { PathToArticle } from 'src/paths'
import {
    SliderHeaderHighEnd,
    HEADER_HIGH_END_HEIGHT,
} from './SliderHeaderHighEnd'
import { HEADER_LOW_END_HEIGHT, SliderHeaderLowEnd } from './SliderHeaderLowEnd'
import { SliderSection } from './types'
import { useIsPreview } from 'src/hooks/use-settings'
import { PreviewControls } from 'src/components/article/preview-controls'
import { issueDateFromId } from './slider-helpers'
import { NavigationScreenProp } from 'react-navigation'

export interface ArticleTransitionProps {
    startAtHeightFromFrontsItem: number
}

const styles = StyleSheet.create({
    androidPager: {
        flexGrow: 1,
        width: '100%',
    },
})

/**
 * We keep track of which articles are scrolled or not so that when we swipe
 * left and right we know whether to show a bottom border to the slider.
 */
const useIsAtTop = (currentArticleKey: string): [boolean, OnIsAtTopChange] => {
    const [scrolledSet, setScrolledSet] = useState(new Set())

    const onIsAtTopChange = (isAtTop: boolean, articleKey: string) => {
        if (scrolledSet.has(articleKey) !== isAtTop) return
        const newSet = new Set(scrolledSet)

        if (isAtTop) newSet.delete(articleKey)
        else newSet.add(articleKey)

        setScrolledSet(newSet)
    }

    const isAtTop = !scrolledSet.has(currentArticleKey)
    return [isAtTop, onIsAtTopChange]
}

const ArticleSlider = React.memo(
    ({
        path,
        articleNavigator,
        navigation,
    }: {
        path: PathToArticle
        articleNavigator: ArticleNavigator
        navigation: NavigationScreenProp<{}>
    }) => {
        const {
            startingPoint,
            flattenedArticles,
        } = getArticleDataFromNavigator(articleNavigator, path)
        const [current, setCurrent] = useState(startingPoint)
        const [sliderPosition] = useState(new Animated.Value(0))
        const [position, setPosition] = useState<
            Animated.AnimatedInterpolation
        >(new Animated.Value(0))

        const { width } = useDimensions()
        const flatListRef = useRef<AnimatedFlatListRef | undefined>()
        const viewPagerRef = useRef<ViewPagerAndroid | null>()

        const preview = useIsPreview()

        useEffect(() => {
            flatListRef.current &&
                flatListRef.current._component.scrollToIndex({
                    index: current,
                    animated: false,
                })
        }, [width]) // eslint-disable-line react-hooks/exhaustive-deps

        const { panResponder } = useDismissArticle()

        const currentArticle = flattenedArticles[Math.floor(current)]

        const sliderSections = articleNavigator.reduce(
            (sectionsWithStartIndex, frontSpec) => {
                const sections = sectionsWithStartIndex.sections.concat({
                    items: frontSpec.articleSpecs.length,
                    title: frontSpec.frontName,
                    color: getColor(frontSpec.appearance),
                    startIndex: sectionsWithStartIndex.sectionCounter,
                })
                return {
                    sectionCounter:
                        sectionsWithStartIndex.sectionCounter +
                        frontSpec.articleSpecs.length,
                    sections: sections,
                }
            },
            { sectionCounter: 0, sections: [] as SliderSection[] },
        ).sections

        const getFrontNameAndPosition = () => {
            const displaySection = sliderSections.filter(
                section =>
                    section.startIndex <= current &&
                    section.startIndex + section.items > current,
            )

            return {
                title: displaySection[0].title,
                numOfItems: displaySection[0].items,
                color: displaySection[0].color,
                subtitle: currentArticle.collection,
                startIndex: displaySection[0].startIndex,
                position,
                editionDate: issueDateFromId(path.publishedIssueId),
            }
        }
        const sliderDetails = getFrontNameAndPosition()

        const [shouldShowHeader, onShouldShowHeaderChange] = useState(true)
        const [isAtTop, onIsAtTopChange] = useIsAtTop(currentArticle.article)
        const setNavPosition = useSetNavPosition()

        const scroller = (index: number) => {
            if (Platform.OS === 'ios') {
                if (flatListRef && flatListRef.current) {
                    flatListRef.current._component.scrollToIndex({
                        index,
                        animated: true,
                    })
                }
            } else {
                if (viewPagerRef && viewPagerRef.current) {
                    viewPagerRef.current.setPage(index)
                }
            }
        }

        const goNext = () => {
            scroller(
                current === flattenedArticles.length - 1
                    ? flattenedArticles.length - 1
                    : current + 1,
            )
        }

        const goPrevious = () => {
            scroller(current === 0 ? 0 : current - 1)
        }

        // Slides the fronts on issue screen in the background
        // if you swipe to new front
        const slideToFrontFor = (newIndex: number) => {
            // Slides the fronts on issue screen in the background if you swipe to new front
            const frontId = flattenedArticles[newIndex].front
            if (frontId === flattenedArticles[current].front) return
            setNavPosition({ frontId, articleIndex: 0 })
        }

        if (Platform.OS === 'android')
            return (
                <>
                    <ViewPagerAndroid
                        style={styles.androidPager}
                        initialPage={startingPoint}
                        ref={viewPager => {
                            viewPagerRef.current = viewPager
                        }}
                        onPageSelected={(ev: any) => {
                            onShouldShowHeaderChange(true)
                            const newIndex = ev.nativeEvent.position
                            setCurrent(newIndex)
                            slideToFrontFor(newIndex)
                            setPosition(newIndex)
                        }}
                    >
                        {flattenedArticles.map((item, index) => (
                            <View key={index}>
                                {index >= current - 1 &&
                                index <= current + 1 ? (
                                    <ArticleScreenBody
                                        navigation={navigation}
                                        width={width}
                                        path={item}
                                        pillar={getAppearancePillar(
                                            item.appearance,
                                        )}
                                        position={index}
                                        onShouldShowHeaderChange={
                                            onShouldShowHeaderChange
                                        }
                                        shouldShowHeader={shouldShowHeader}
                                        topPadding={HEADER_LOW_END_HEIGHT}
                                        onIsAtTopChange={onIsAtTopChange}
                                    />
                                ) : null}
                            </View>
                        ))}
                    </ViewPagerAndroid>

                    <SliderHeaderLowEnd
                        isShown={shouldShowHeader}
                        isAtTop={isAtTop}
                        sliderDetails={sliderDetails}
                    />

                    {preview && (
                        <PreviewControls
                            goNext={goNext}
                            goPrevious={goPrevious}
                        />
                    )}
                </>
            )

        return (
            <>
                <Animated.FlatList
                    ref={(flatList: AnimatedFlatListRef) =>
                        (flatListRef.current = flatList)
                    }
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                    scrollEventThrottle={1}
                    onScroll={Animated.event(
                        [
                            {
                                nativeEvent: {
                                    contentOffset: { x: sliderPosition },
                                },
                            },
                        ],
                        {
                            useNativeDriver: true,
                            listener: (ev: any) => {
                                onShouldShowHeaderChange(true)
                                const newPos =
                                    ev.nativeEvent.contentOffset.x / width
                                const newIndex = clamp(
                                    Math.ceil(newPos),
                                    0,
                                    flattenedArticles.length - 1,
                                )
                                setCurrent(newIndex)
                                slideToFrontFor(newIndex)

                                const position = Animated.divide(
                                    ev.nativeEvent.contentOffset.x,
                                    new Animated.Value(width),
                                )
                                setPosition(position)
                            },
                        },
                    )}
                    maxToRenderPerBatch={1}
                    windowSize={1.5}
                    initialNumToRender={1}
                    horizontal={true}
                    initialScrollIndex={startingPoint}
                    pagingEnabled
                    getItemLayout={(_: never, index: number) => ({
                        length: width,
                        offset: width * index,
                        index,
                    })}
                    keyExtractor={(item: ArticleSpec) => item.article}
                    data={flattenedArticles}
                    renderItem={({
                        item,
                        index,
                    }: {
                        item: ArticleSpec
                        index: number
                    }) => (
                        <ArticleScreenBody
                            navigation={navigation}
                            width={width}
                            path={item}
                            pillar={getAppearancePillar(item.appearance)}
                            position={index}
                            onShouldShowHeaderChange={onShouldShowHeaderChange}
                            shouldShowHeader={shouldShowHeader}
                            topPadding={
                                supportsAnimation()
                                    ? HEADER_HIGH_END_HEIGHT
                                    : HEADER_LOW_END_HEIGHT
                            }
                            onIsAtTopChange={onIsAtTopChange}
                        />
                    )}
                />

                {!supportsAnimation() && (
                    <SliderHeaderLowEnd
                        isShown={shouldShowHeader}
                        isAtTop={isAtTop}
                        sliderDetails={sliderDetails}
                    />
                )}

                {supportsAnimation() && (
                    <SliderHeaderHighEnd
                        isShown={shouldShowHeader}
                        isAtTop={isAtTop}
                        panResponder={panResponder}
                        sliderDetails={sliderDetails}
                    />
                )}

                {preview && (
                    <PreviewControls goNext={goNext} goPrevious={goPrevious} />
                )}
            </>
        )
    },
)

export { ArticleSlider }
