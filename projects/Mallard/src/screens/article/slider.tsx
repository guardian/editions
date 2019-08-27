import React, { useEffect, useRef, useState } from 'react'
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { Appearance, CAPIArticle, Collection, Front, Issue } from 'src/common'
import { MaxWidthWrap } from 'src/components/article/wrap/max-width'
import { AnimatedFlatListRef } from 'src/components/front/helpers/helpers'
import { Fader } from 'src/components/layout/animators/fader'
import { Slider } from 'src/components/slider'
import { safeInterpolation } from 'src/helpers/math'
import { getColor } from 'src/helpers/transform'
import { useAlphaIn } from 'src/hooks/use-alpha-in'
import { getAppearancePillar } from 'src/hooks/use-article'
import { useDimensions, useMediaQuery } from 'src/hooks/use-screen'
import { ArticleNavigationProps } from 'src/navigation/helpers/base'
import { ArticleNavigatorInjectedProps } from 'src/navigation/navigators/article'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { ArticleScreenBody } from '../article/body'
import { PathToArticle } from './slider'

export interface PathToArticle {
    collection: Collection['key']
    front: Front['key']
    article: CAPIArticle['key']
    issue: Issue['key']
}

export interface ArticleTransitionProps {
    startAtHeightFromFrontsItem: number
}

export interface ArticleNavigator {
    articles: PathToArticle[]
    appearance: Appearance
    frontName: string
}

const getData = (
    navigator: ArticleNavigator,
    currentArticle: PathToArticle,
): {
    isInScroller: boolean
    startingPoint: number
} => {
    const startingPoint = navigator.articles.findIndex(
        ({ article }) => currentArticle.article === article,
    )
    if (startingPoint < 0) return { isInScroller: false, startingPoint: 0 }
    return { startingPoint, isInScroller: true }
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
})

const SliderBar = ({
    position,
    total,
    title,
    color,
    style,
}: {
    position: number
    total: number
    title: string
    color: string
    style: StyleProp<ViewStyle>
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
        <View style={[styles.slider, style]}>
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
    onDismissStateChanged,
}: Required<Pick<ArticleNavigationProps, 'articleNavigator' | 'path'>> &
    ArticleNavigatorInjectedProps) => {
    const pillar = getAppearancePillar(articleNavigator.appearance)

    const [articleIsAtTop, setArticleIsAtTop] = useState(true)

    const { isInScroller, startingPoint } = getData(articleNavigator, path)
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

    return (
        <>
            <Fader>
                <SliderBar
                    total={articleNavigator.articles.length}
                    position={current}
                    title={articleNavigator.frontName}
                    color={getColor(articleNavigator.appearance)}
                    style={!articleIsAtTop && styles.sliderBorder}
                />
            </Fader>
            <Animated.FlatList
                ref={(flatList: AnimatedFlatListRef) =>
                    (flatListRef.current = flatList)
                }
                showsHorizontalScrollIndicator={false}
                showsVerticalScrollIndicator={false}
                scrollEventThrottle={1}
                onScroll={(ev: any) => {
                    onDismissStateChanged && onDismissStateChanged(true)
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
                keyExtractor={(item: ArticleNavigator['articles'][0]) =>
                    item.article
                }
                removeClippedSubviews={true}
                data={
                    isInScroller
                        ? articleNavigator.articles
                        : [path, ...articleNavigator.articles]
                }
                renderItem={({
                    item,
                    index,
                }: {
                    item: ArticleNavigator['articles'][0]
                    index: number
                }) => (
                    <ArticleScreenBody
                        width={width}
                        path={item}
                        pillar={pillar}
                        onTopPositionChange={isAtTop => {
                            setArticleIsAtTop(isAtTop)
                            onDismissStateChanged &&
                                onDismissStateChanged(isAtTop)
                        }}
                        position={index}
                    />
                )}
            />
        </>
    )
}

export { ArticleSlider }
