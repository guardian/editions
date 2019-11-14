import React, { useEffect, useRef, useState } from 'react'
import { Animated, Platform, StyleSheet, View, Easing } from 'react-native'
import ViewPagerAndroid from '@react-native-community/viewpager'
import { CAPIArticle, Collection, Front, Issue } from 'src/common'
import { MaxWidthWrap } from 'src/components/article/wrap/max-width'
import { AnimatedFlatListRef } from 'src/components/front/helpers/helpers'
import { Slider } from 'src/components/slider'
import { safeInterpolation, clamp } from 'src/helpers/math'
import { getColor } from 'src/helpers/transform'
import { useAlphaIn } from 'src/hooks/use-alpha-in'
import { getAppearancePillar } from 'src/hooks/use-article'
import { useDimensions, useMediaQuery } from 'src/hooks/use-screen'
import { ArticleNavigationProps } from 'src/navigation/helpers/base'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { ArticleScreenBody, OnIsAtTopChange } from '../article/body'
import { useDismissArticle } from 'src/hooks/use-dismiss-article'
import {
    ArticleNavigator,
    getArticleDataFromNavigator,
} from '../article-screen'
import { BasicArticleHeader } from './header'

export interface PathToArticle {
    collection: Collection['key']
    front: Front['key']
    article: CAPIArticle['key']
    issue: Issue['key']
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
    },
    sliderAtTop: {
        borderBottomColor: color.background,
    },
    innerSlider: {
        width: '100%',
        flexShrink: 0,
        flexGrow: 1,
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
    position: number
    total: number
    title: string
    color: string
}
const SliderBar = ({ position, total, title, color }: SliderBarProps) => {
    const sliderPos = useAlphaIn(200, {
        initialValue: 0,
        currentValue: position,
    }).interpolate({
        inputRange: safeInterpolation([0, total - 1]),
        outputRange: safeInterpolation([0, 1]),
    })

    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)

    return (
        <MaxWidthWrap>
            <View
                style={[
                    styles.innerSlider,
                    isTablet && {
                        marginHorizontal: metrics.fronts.sliderRadius * -0.8,
                    },
                ]}
            >
                <Slider
                    small
                    title={title}
                    fill={color}
                    stops={2}
                    position={sliderPos}
                />
            </View>
        </MaxWidthWrap>
    )
}

const AndroidHeader = ({
    isShown,
    isAtTop,
    ...sliderProps
}: { isShown: boolean; isAtTop: boolean } & SliderBarProps) => {
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
            <View style={[styles.slider, isAtTop ? styles.sliderAtTop : null]}>
                <SliderBar {...sliderProps} />
            </View>
        </Animated.View>
    )
}

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
    const { isInScroller, startingPoint } = getArticleDataFromNavigator(
        articleNavigator,
        path,
    )

    const [current, setCurrent] = useState(startingPoint)

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

    const data = isInScroller
        ? articleNavigator
        : [
              {
                  ...path,
                  appearance: { type: 'pillar', name: 'neutral' } as const,
                  frontName: '',
              },
              ...articleNavigator,
          ]

    const currentArticle = data[current]

    const pillar = getAppearancePillar(currentArticle.appearance)

    const [shouldShowHeader, onShouldShowHeaderChange] = useState(true)
    const [isAtTop, onIsAtTopChange] = useIsAtTop(currentArticle.article)

    if (Platform.OS === 'android')
        return (
            <>
                <ViewPagerAndroid
                    style={styles.androidPager}
                    initialPage={startingPoint}
                    onPageSelected={(ev: any) => {
                        onShouldShowHeaderChange(true)
                        setCurrent(ev.nativeEvent.position)
                    }}
                >
                    {data.map((item, index) => (
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
                    total={articleNavigator.length}
                    position={current}
                    title={currentArticle.frontName}
                    color={getColor(currentArticle.appearance)}
                    isShown={shouldShowHeader}
                    isAtTop={isAtTop}
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
                    total={articleNavigator.length}
                    position={current}
                    title={currentArticle.frontName}
                    color={getColor(currentArticle.appearance)}
                />
            </View>

            <Animated.FlatList
                ref={(flatList: AnimatedFlatListRef) =>
                    (flatListRef.current = flatList)
                }
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
                onScroll={(ev: any) => {
                    setCurrent(
                        clamp(
                            Math.floor(ev.nativeEvent.contentOffset.x / width),
                            0,
                            data.length - 1,
                        ),
                    )
                }}
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
                keyExtractor={(item: ArticleNavigator[number]) => item.article}
                data={data}
                renderItem={({
                    item,
                    index,
                }: {
                    item: ArticleNavigator[number]
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
