import React, { useEffect, useRef, useState } from 'react'
import { Animated, Platform, StyleSheet, View, Easing } from 'react-native'
import ViewPagerAndroid from '@react-native-community/viewpager'
import { CAPIArticle, Collection, Front, Issue } from 'src/common'
import { AnimatedFlatListRef } from 'src/components/front/helpers/helpers'
import { clamp } from 'src/helpers/math'
import { getColor } from 'src/helpers/transform'
import { getAppearancePillar } from 'src/hooks/use-article'
import { useDimensions } from 'src/hooks/use-screen'
import { ArticleNavigationProps } from 'src/navigation/helpers/base'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { ArticleScreenBody, OnIsAtTopChange } from '../body'
import { useDismissArticle } from 'src/hooks/use-dismiss-article'
import { getArticleDataFromNavigator, ArticleSpec } from '../../article-screen'
import { useSetNavPosition } from 'src/hooks/use-nav-position'
import { LowEndHeader, ANDROID_HEADER_HEIGHT } from './headerLowEnd'
import { SliderSection } from './types'
import { HighEndHeader } from './headerHighEnd'

export interface PathToArticle {
    collection: Collection['key']
    front: Front['key']
    article: CAPIArticle['key']
    issue: Issue['key']
}

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

const ArticleSlider = ({
    path,
    articleNavigator,
}: Required<
    Pick<ArticleNavigationProps, 'articleNavigator' | 'path'>
> & {}) => {
    const { startingPoint, flattenedArticles } = getArticleDataFromNavigator(
        articleNavigator,
        path,
    )

    const [current, setCurrent] = useState(startingPoint)
    const [sliderPosition] = useState(new Animated.Value(startingPoint))

    const { width } = useDimensions()
    const flatListRef = useRef<AnimatedFlatListRef | undefined>()
    const viewPagerRef = useRef<ViewPagerAndroid | null>()

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

                        Animated.timing(sliderPosition, {
                            duration: 200,
                            toValue: ev.nativeEvent.position,
                            easing: Easing.linear,
                            useNativeDriver: true,
                        }).start()
                    }}
                >
                    {flattenedArticles.map((item, index) => (
                        <View key={index}>
                            {index >= current - 1 && index <= current + 1 ? (
                                <ArticleScreenBody
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
                                    topPadding={ANDROID_HEADER_HEIGHT}
                                    onIsAtTopChange={onIsAtTopChange}
                                />
                            ) : null}
                        </View>
                    ))}
                </ViewPagerAndroid>

                <LowEndHeader
                    isShown={shouldShowHeader}
                    isAtTop={isAtTop}
                    sliderPosition={sliderPosition}
                    width={width}
                    sections={sliderSections}
                    goNext={goNext}
                    goPrevious={goPrevious}
                />
            </>
        )

    return (
        <>
            <HighEndHeader
                isShown={shouldShowHeader}
                isAtTop={isAtTop}
                sections={sliderSections}
                sliderPosition={sliderPosition}
                width={width}
                goNext={goNext}
                goPrevious={goPrevious}
                panResponder={panResponder}
            />
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
                            const newPos =
                                ev.nativeEvent.contentOffset.x / width
                            const newIndex = clamp(
                                Math.floor(newPos),
                                0,
                                flattenedArticles.length - 1,
                            )
                            setCurrent(newIndex)
                            slideToFrontFor(newIndex)
                        },
                    },
                )}
                maxToRenderPerBatch={1}
                windowSize={1.5}
                removeClippedSubviews={true}
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
                        width={width}
                        path={item}
                        pillar={getAppearancePillar(item.appearance)}
                        position={index}
                        onShouldShowHeaderChange={onShouldShowHeaderChange}
                        shouldShowHeader={shouldShowHeader}
                        topPadding={0}
                        onIsAtTopChange={onIsAtTopChange}
                    />
                )}
            />
        </>
    )
}

export { ArticleSlider }
