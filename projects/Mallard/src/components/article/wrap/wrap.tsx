import React, { ReactNode, useEffect, useState, useRef } from 'react'
import {
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
    ViewProperties,
    LayoutRectangle,
    LayoutChangeEvent,
} from 'react-native'
import { useMediaQuery } from 'src/hooks/use-screen'
import { Breakpoints, MINIMUM_BREAKPOINT } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { MaxWidthWrap } from './max-width'

interface ChildPropTypes {
    children?: ReactNode
    header?: ReactNode
    footer?: ReactNode
}

interface ContentWrapperPropTypes extends ChildPropTypes {
    topOffset?: number
    backgroundColor?: ViewStyle['backgroundColor']
    onLayout?: ViewProperties['onLayout']
    style?: StyleProp<
        Pick<ViewStyle, 'paddingVertical' | 'paddingTop' | 'paddingBottom'>
    >
}

export interface WrapLayout {
    content: {
        width: number
    }
    rail: {
        width: number
        contentWidth: number
    }
    width: number
}

interface ThreeColumnWrapperPropTypes
    extends Exclude<ContentWrapperPropTypes, 'tablet'> {
    borderColor?: ViewStyle['borderColor']
    onWrapLayout?: (wrapLayout: WrapLayout) => void
    rightRail?: (
        position: Breakpoints.phone | Breakpoints.tabletVertical,
    ) => ReactNode
}

export interface WrapperPropTypes
    extends Exclude<ThreeColumnWrapperPropTypes, 'landscape'> {
    style?: StyleProp<
        Pick<ViewStyle, 'paddingVertical' | 'paddingTop' | 'paddingBottom'>
    >
}

const contentWrapStyles = StyleSheet.create({
    root: {
        overflow: 'visible',
        width: '100%',
    },
})

const ContentWrapper = ({
    style,
    backgroundColor,
    onLayout,
    ...children
}: ContentWrapperPropTypes) => {
    return (
        <View style={[contentWrapStyles.root, { backgroundColor }]}>
            {children.header && (
                <MaxWidthWrap invert>{children.header}</MaxWidthWrap>
            )}
            <View {...{ onLayout }} style={[style]}>
                {children.children}
            </View>
            {children.footer && (
                <MaxWidthWrap invert>{children.footer}</MaxWidthWrap>
            )}
        </View>
    )
}

const threeColWrapStyles = StyleSheet.create({
    root: {
        flexDirection: 'row-reverse',
        width: '100%',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        overflow: 'visible',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
        overflow: 'visible',
        marginRight: metrics.article.railPaddingLeft,
    },
    rightRail: {
        width: metrics.article.rightRail,
        borderColor: color.line,
        flexShrink: 0,
        borderLeftWidth: 1,
    },
    rightRailContent: {
        maxWidth: metrics.article.rightRail + metrics.article.sides,
        marginRight: metrics.article.sidesTablet * 1.5,
        marginLeft: metrics.article.sidesTablet / 2,
        marginTop: metrics.vertical * -0.25,
    },
})
const ThreeColumnWrapper = ({
    borderColor,
    rightRail,
    backgroundColor,
    onWrapLayout,
    ...innerProps
}: ThreeColumnWrapperPropTypes) => {
    const [railLayout, setRailLayout] = useState<LayoutRectangle | null>(null)
    const [contentLayout, setContentLayout] = useState<LayoutRectangle | null>(
        null,
    )
    const [wrapperLayout, setWrapperLayout] = useState<LayoutRectangle | null>(
        null,
    )
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        if (
            onWrapLayout &&
            railLayout !== null &&
            contentLayout !== null &&
            wrapperLayout !== null
        ) {
            onWrapLayout({
                content: {
                    width: contentLayout.width,
                },
                rail: {
                    width: railLayout.width,
                    contentWidth:
                        railLayout.width -
                        threeColWrapStyles.rightRailContent.marginLeft,
                },
                width: wrapperLayout.width,
            })
        }
    }, [
        (wrapperLayout && wrapperLayout.width) || -1,
        (railLayout && railLayout.width) || -1,
        (contentLayout && contentLayout.width) || -1,
    ])
    /* eslint-enable */

    return (
        <View
            style={threeColWrapStyles.root}
            onLayout={ev => {
                setWrapperLayout(ev.nativeEvent.layout)
            }}
        >
            <View
                style={[
                    threeColWrapStyles.rightRail,
                    { borderLeftColor: borderColor },
                ]}
                onLayout={ev => {
                    setRailLayout(ev.nativeEvent.layout)
                }}
            >
                <View
                    style={[
                        threeColWrapStyles.rightRailContent,
                        innerProps.style,
                    ]}
                >
                    {rightRail && rightRail(Breakpoints.tabletVertical)}
                </View>
            </View>
            <View style={[threeColWrapStyles.content]}>
                <ContentWrapper
                    onLayout={ev => {
                        setContentLayout(ev.nativeEvent.layout)
                    }}
                    backgroundColor={backgroundColor}
                    {...innerProps}
                />
            </View>
        </View>
    )
}

const fromEvent = (e: LayoutChangeEvent): WrapLayout => ({
    content: {
        width: e.nativeEvent.layout.width,
    },
    rail: {
        width: 0,
        contentWidth: 0,
    },
    width: e.nativeEvent.layout.width,
})

const eq = (a: WrapLayout, b: WrapLayout) =>
    a.content.width === b.content.width &&
    a.rail.width === b.rail.width &&
    a.rail.contentWidth === b.rail.contentWidth &&
    a.width === b.width

const Wrap = ({ backgroundColor, ...props }: WrapperPropTypes) => {
    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)
    const wrap = useRef<WrapLayout | null>(null)
    if (!isTablet) {
        return (
            <View style={{ backgroundColor }}>
                <MaxWidthWrap>
                    <ContentWrapper
                        {...props}
                        backgroundColor={backgroundColor}
                        onLayout={e => {
                            if (props.onWrapLayout) {
                                const newWrap = fromEvent(e)
                                if (
                                    !(wrap.current && eq(newWrap, wrap.current))
                                ) {
                                    props.onWrapLayout(newWrap)
                                    wrap.current = newWrap
                                }
                            }
                        }}
                    >
                        {props.children}
                        {props.rightRail && props.rightRail(MINIMUM_BREAKPOINT)}
                    </ContentWrapper>
                </MaxWidthWrap>
            </View>
        )
    }

    return (
        <View style={{ backgroundColor, alignItems: 'center' }}>
            <MaxWidthWrap>
                <ThreeColumnWrapper
                    {...{
                        backgroundColor,
                        ...props,
                    }}
                />
            </MaxWidthWrap>
        </View>
    )
}

export { Wrap }
