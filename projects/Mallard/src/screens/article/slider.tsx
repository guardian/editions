import React, { useCallback, useEffect, useRef, useState } from 'react'
import {
    Animated,
    Platform,
    StyleSheet,
    View,
    ViewProps,
    Easing,
} from 'react-native'
import ViewPagerAndroid from '@react-native-community/viewpager'
import { CAPIArticle, Collection, Front, Issue } from 'src/common'
import { MaxWidthWrap } from 'src/components/article/wrap/max-width'
import { AnimatedFlatListRef } from 'src/components/front/helpers/helpers'
import { Slider } from 'src/components/slider'
import { clamp } from 'src/helpers/math'
import { getColor } from 'src/helpers/transform'
// import { useAlphaIn } from 'src/hooks/use-alpha-in'
import { getAppearancePillar } from 'src/hooks/use-article'
import { useDimensions, useMediaQuery } from 'src/hooks/use-screen'
import { ArticleNavigationProps } from 'src/navigation/helpers/base'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { ArticleScreenBody } from '../article/body'
import { useDismissArticle } from 'src/hooks/use-dismiss-article'
import { getArticleDataFromNavigator, ArticleSpec } from '../article-screen'

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

const styles = StyleSheet.create({
    slider: {
        paddingVertical: metrics.vertical,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: color.background,
    },
    firstSlider: {
        width: '100%',
        flexShrink: 0,
        flexGrow: 1,
        paddingLeft: 2,
        paddingRight: 2,
    },
    innerSlider: {
        ...StyleSheet.absoluteFillObject,
        paddingLeft: 2,
        paddingRight: 2,
    },
    sliderBorder: {
        borderBottomColor: color.line,
    },
    androidPager: {
        flexGrow: 1,
        width: '100%',
    },
})

const SliderSectionBar = ({
    section,
    animatedValue,
    width,
    isFirst,
}: {
    section: SliderSection
    animatedValue: Animated.AnimatedInterpolation
    width: number
    isFirst: boolean
}) => {
    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)
    const [sliderPos] = useState(() =>
        animatedValue
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
            }),
    )

    const xValue = animatedValue.interpolate({
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
                isTablet && {
                    marginHorizontal: metrics.fronts.sliderRadius * -0.8,
                },
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
    wrapperProps,
    animatedValue,
    width,
}: {
    sections: SliderSection[]
    wrapperProps: ViewProps
    animatedValue: Animated.AnimatedInterpolation
    width: number
}) => {
    return (
        <View {...wrapperProps} style={[styles.slider, wrapperProps.style]}>
            <MaxWidthWrap>
                {sections.map((section, index) => (
                    <SliderSectionBar
                        section={section}
                        animatedValue={animatedValue}
                        key={section.title}
                        width={width}
                        isFirst={index === 0}
                    />
                ))}
            </MaxWidthWrap>
        </View>
    )
}

const ArticleSlider = ({
    path,
    articleNavigator,
}: Required<Pick<ArticleNavigationProps, 'articleNavigator' | 'path'>>) => {
    const [articleIsAtTop, setArticleIsAtTop] = useState(true)

    const { startingPoint, flattenedArticles } = getArticleDataFromNavigator(
        articleNavigator,
        path,
    )
    const [current, setCurrent] = useState(startingPoint)
    const [animatedValue] = useState(new Animated.Value(startingPoint))

    const { width } = useDimensions()
    const flatListRef = useRef<AnimatedFlatListRef | undefined>()

    useEffect(() => {
        flatListRef.current &&
            flatListRef.current._component.scrollToIndex({
                index: current,
                animated: false,
            })
    }, [width]) // eslint-disable-line react-hooks/exhaustive-deps

    const onTopPositionChange = useCallback((isAtTop: boolean) => {
        setArticleIsAtTop(isAtTop)
    }, [])

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

    if (Platform.OS === 'android')
        return (
            <>
                <SliderBar
                    sections={sliderSections}
                    wrapperProps={{
                        style: !articleIsAtTop && styles.sliderBorder,
                    }}
                    animatedValue={animatedValue}
                    width={width}
                />
                <ViewPagerAndroid
                    style={styles.androidPager}
                    initialPage={startingPoint}
                    onPageSelected={(ev: any) => {
                        setCurrent(ev.nativeEvent.position)
                        Animated.timing(animatedValue, {
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
                                    onTopPositionChange={onTopPositionChange}
                                    position={index}
                                />
                            ) : null}
                        </View>
                    ))}
                </ViewPagerAndroid>
            </>
        )

    return (
        <>
            <SliderBar
                sections={sliderSections}
                wrapperProps={{
                    ...panResponder.panHandlers,
                    style: !articleIsAtTop && styles.sliderBorder,
                }}
                animatedValue={Animated.divide(
                    animatedValue,
                    new Animated.Value(width),
                )}
                width={width}
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
                                contentOffset: { x: animatedValue },
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
                        onTopPositionChange={onTopPositionChange}
                        position={index}
                    />
                )}
            />
        </>
    )
}

export { ArticleSlider }
