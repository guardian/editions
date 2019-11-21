import React, { useEffect, useRef, useState } from 'react'
import { Animated, Platform, StyleSheet, View, Easing } from 'react-native'
import ViewPagerAndroid from '@react-native-community/viewpager'
import { CAPIArticle, Collection, Front, Issue } from 'src/common'
import { MaxWidthWrap } from 'src/components/article/wrap/max-width'
import { AnimatedFlatListRef } from 'src/components/front/helpers/helpers'
import { Slider } from 'src/components/slider'
import { clamp } from 'src/helpers/math'
import { getColor } from 'src/helpers/transform'
import { getAppearancePillar } from 'src/hooks/use-article'
import { useDimensions } from 'src/hooks/use-screen'
import { ArticleNavigationProps } from 'src/navigation/helpers/base'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { ArticleScreenBody, OnIsAtTopChange } from '../article/body'
import { useDismissArticle } from 'src/hooks/use-dismiss-article'
import { getArticleDataFromNavigator, ArticleSpec } from '../article-screen'
import { withNavigation } from 'react-navigation'
import { NavigationInjectedProps } from 'react-navigation'
import { BasicArticleHeader } from './header'
import { useNavPosition } from 'src/hooks/use-nav-position'

export interface PathToArticle {
    collection: Collection['key']
    front: Front['key']
    article: CAPIArticle['key']
    issue: Issue['key']
}

export interface SliderSection {
    items: number
    title: string
    color: string
    startIndex: number
}

export interface ArticleTransitionProps {
    startAtHeightFromFrontsItem: number
}

const ANDROID_HEADER_HEIGHT = 130

const styles = StyleSheet.create({
    slider: {
        paddingVertical: metrics.vertical,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: color.line,
        backgroundColor: color.background,
        paddingHorizontal: metrics.horizontal,
    },
    sliderAtTop: {
        borderBottomColor: color.background,
    },
    firstSlider: {
        width: '100%',
        flexShrink: 0,
        flexGrow: 1,
    },
    innerSlider: {
        ...StyleSheet.absoluteFillObject,
    },
    androidPager: {
        flexGrow: 1,
        width: '100%',
    },
    androidHeader: {
        position: 'absolute',
        height: ANDROID_HEADER_HEIGHT,
        left: 0,
        right: 0,
    },
})

type SliderBarProps = {
    section: SliderSection
    sliderPosition: Animated.AnimatedInterpolation
    width: number
    isFirst: boolean
}

const SliderSectionBar = ({
    section,
    sliderPosition,
    width,
    isFirst,
}: SliderBarProps) => {
    const sliderPos = sliderPosition
        .interpolate({
            inputRange: [
                section.startIndex,
                section.startIndex + section.items - 1,
            ],
            outputRange: [
                section.startIndex,
                section.startIndex + section.items - 1,
            ],
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
        })
        .interpolate({
            inputRange: [
                section.startIndex,
                section.startIndex + section.items - 1,
            ],
            outputRange: [0, 1],
        })

    const xValue = sliderPosition.interpolate({
        inputRange: [
            section.startIndex - 1,
            section.startIndex,
            section.startIndex + section.items - 1,
            section.startIndex + section.items,
        ],
        outputRange: [width, 0, 0, -width],
        extrapolate: 'clamp',
    })

    return (
        <Animated.View
            style={[
                isFirst ? styles.firstSlider : styles.innerSlider,
                {
                    transform: [
                        {
                            translateX: xValue,
                        },
                    ],
                },
            ]}
        >
            <Slider
                small={false}
                title={section.title}
                fill={section.color}
                stops={2}
                position={sliderPos}
            />
        </Animated.View>
    )
}

const SliderBar = ({
    sections,
    sliderPosition,
    width,
}: {
    sections: SliderSection[]
    sliderPosition: Animated.AnimatedInterpolation
    width: number
}) => {
    return (
        <MaxWidthWrap>
            {sections.map((section, index) => (
                <SliderSectionBar
                    section={section}
                    sliderPosition={sliderPosition}
                    key={section.title}
                    width={width}
                    isFirst={index === 0}
                />
            ))}
        </MaxWidthWrap>
    )
}

const AndroidHeader = withNavigation(
    ({
        isShown,
        isAtTop,
        sections,
        sliderPosition,
        width,
    }: {
        isShown: boolean
        isAtTop: boolean
        sections: SliderSection[]
        sliderPosition: Animated.AnimatedInterpolation
        width: number
    } & NavigationInjectedProps) => {
        const [top] = useState(new Animated.Value(0))
        useEffect(() => {
            if (isShown) {
                Animated.timing(top, {
                    toValue: 0,
                    easing: Easing.out(Easing.ease),
                    duration: 200,
                }).start()
            } else {
                Animated.timing(top, {
                    toValue: -ANDROID_HEADER_HEIGHT,
                    easing: Easing.out(Easing.ease),
                    duration: 200,
                }).start()
            }
        }, [isShown, top])

        return (
            <Animated.View style={[styles.androidHeader, { top }]}>
                <BasicArticleHeader />
                <View
                    style={[styles.slider, isAtTop ? styles.sliderAtTop : null]}
                >
                    <SliderBar
                        sections={sections}
                        sliderPosition={sliderPosition}
                        width={width}
                    />
                </View>
            </Animated.View>
        )
    },
)

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

    useEffect(() => {
        flatListRef.current &&
            flatListRef.current._component.scrollToIndex({
                index: current,
                animated: false,
            })
    }, [width]) // eslint-disable-line react-hooks/exhaustive-deps

    const { panResponder } = useDismissArticle()

    const currentArticle = flattenedArticles[Math.floor(current)]

    const pillar = getAppearancePillar(currentArticle.appearance)

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
    const { position, setPosition, setTrigger } = useNavPosition()

    if (Platform.OS === 'android')
        return (
            <>
                <ViewPagerAndroid
                    style={styles.androidPager}
                    initialPage={startingPoint}
                    onPageSelected={(ev: any) => {
                        onShouldShowHeaderChange(true)
                        const index = ev.nativeEvent.position
                        setCurrent(index)

                        // Slides the fronts on issue screen in the background if you swipe to new front
                        if (
                            flattenedArticles[index].front !== position.frontId
                        ) {
                            setPosition({
                                frontId: flattenedArticles[index].front,
                                articleIndex: 0,
                            })
                            setTrigger(true)
                        }

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
                                    pillar={pillar}
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

                <AndroidHeader
                    isShown={shouldShowHeader}
                    isAtTop={isAtTop}
                    sliderPosition={sliderPosition}
                    width={width}
                    sections={sliderSections}
                />
            </>
        )

    return (
        <>
            <View
                style={[styles.slider, isAtTop ? styles.sliderAtTop : null]}
                {...panResponder.panHandlers}
            >
                <SliderBar
                    sections={sliderSections}
                    sliderPosition={Animated.divide(
                        sliderPosition,
                        new Animated.Value(width),
                    )}
                    width={width}
                />
            </View>
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
                            setCurrent(
                                clamp(
                                    Math.floor(newPos),
                                    0,
                                    flattenedArticles.length - 1,
                                ),
                            )
                            // Slides the fronts on issue screen in the background if you swipe to new front
                            if (
                                flattenedArticles[current].front !==
                                position.frontId
                            ) {
                                setPosition({
                                    frontId: flattenedArticles[current].front,
                                    articleIndex: 0,
                                })
                                setTrigger(true)
                            }
                        },
                    },
                )}
                maxToRenderPerBatch={1}
                windowSize={2}
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
                        pillar={pillar}
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
