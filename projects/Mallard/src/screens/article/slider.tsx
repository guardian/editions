import React, { useCallback, useEffect, useRef, useState } from 'react'
import { Animated, Platform, StyleSheet, View, ViewProps } from 'react-native'
import ViewPagerAndroid from '@react-native-community/viewpager'
import { CAPIArticle, Collection, Front, Issue } from 'src/common'
import { MaxWidthWrap } from 'src/components/article/wrap/max-width'
import { AnimatedFlatListRef } from 'src/components/front/helpers/helpers'
import { Slider } from 'src/components/slider'
import { safeInterpolation } from 'src/helpers/math'
import { getColor } from 'src/helpers/transform'
import { useAlphaIn } from 'src/hooks/use-alpha-in'
import { getAppearancePillar } from 'src/hooks/use-article'
import { useDimensions, useMediaQuery } from 'src/hooks/use-screen'
import { ArticleNavigationProps } from 'src/navigation/helpers/base'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { ArticleScreenBody } from '../article/body'
import { useDismissArticle } from 'src/hooks/use-dismiss-article'
import {
    ArticleNavigator,
    getArticleDataFromNavigator,
} from '../article-screen'

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
    slider: {
        paddingVertical: metrics.vertical,
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: color.background,
    },
    innerSlider: {
        width: '100%',
        flexShrink: 0,
        flexGrow: 1,
    },
    sliderBorder: {
        borderBottomColor: color.line,
    },
    androidPager: {
        flexGrow: 1,
        width: '100%',
    },
})

const SliderBar = ({
    position,
    total,
    title,
    color,
    wrapperProps,
}: {
    position: number
    total: number
    title: string
    color: string
    wrapperProps: ViewProps
}) => {
    const sliderPos = useAlphaIn(200, {
        initialValue: 0,
        currentValue: position,
    }).interpolate({
        inputRange: safeInterpolation([0, total - 1]),
        outputRange: safeInterpolation([0, 1]),
    })

    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)

    return (
        <View {...wrapperProps} style={[styles.slider, wrapperProps.style]}>
            <MaxWidthWrap>
                <View
                    style={[
                        styles.innerSlider,
                        isTablet && {
                            marginHorizontal:
                                metrics.fronts.sliderRadius * -0.8,
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
        </View>
    )
}

const ArticleSlider = ({
    path,
    articleNavigator,
}: Required<Pick<ArticleNavigationProps, 'articleNavigator' | 'path'>>) => {
    const [articleIsAtTop, setArticleIsAtTop] = useState(true)

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

    const onTopPositionChange = useCallback((isAtTop: boolean) => {
        setArticleIsAtTop(isAtTop)
    }, [])

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

    if (Platform.OS === 'android')
        return (
            <>
                <SliderBar
                    total={articleNavigator.length}
                    position={current}
                    title={currentArticle.frontName}
                    color={getColor(currentArticle.appearance)}
                    wrapperProps={{
                        style: !articleIsAtTop && styles.sliderBorder,
                    }}
                />
                <ViewPagerAndroid
                    style={styles.androidPager}
                    initialPage={startingPoint}
                    onPageSelected={(ev: any) => {
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
                total={articleNavigator.length}
                position={current}
                title={currentArticle.frontName}
                color={getColor(currentArticle.appearance)}
                wrapperProps={{
                    ...panResponder.panHandlers,
                    style: !articleIsAtTop && styles.sliderBorder,
                }}
            />

            <Animated.FlatList
                ref={(flatList: AnimatedFlatListRef) =>
                    (flatListRef.current = flatList)
                }
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
                onScroll={(ev: any) => {
                    setCurrent(
                        Math.floor(ev.nativeEvent.contentOffset.x / width),
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
                data={
                    isInScroller
                        ? articleNavigator
                        : [path, ...articleNavigator]
                }
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
                        onTopPositionChange={onTopPositionChange}
                        position={index}
                    />
                )}
            />
        </>
    )
}

export { ArticleSlider }
