import React, { ReactNode, useEffect, useState } from 'react'
import {
    StyleProp,
    StyleSheet,
    View,
    ViewStyle,
    ViewProperties,
    LayoutRectangle,
} from 'react-native'
import { useMediaQuery } from 'src/hooks/use-screen'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { MaxWidthWrap } from './max-width'

interface ChildPropTypes {
    children: ReactNode
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
        x: number
    }
    width: number
}

interface ThreeColumnWrapperPropTypes
    extends Exclude<ContentWrapperPropTypes, 'tablet'> {
    borderColor?: ViewStyle['borderColor']
    onWrapLayout?: (wrapLayout: WrapLayout) => void
    rightRail?: (
        position: Breakpoints.zero | Breakpoints.tabletVertical,
    ) => ReactNode
}

export interface WrapperPropTypes
    extends Exclude<ThreeColumnWrapperPropTypes, 'landscape'> {
    style?: StyleProp<
        Pick<ViewStyle, 'paddingVertical' | 'paddingTop' | 'paddingBottom'>
    >
}

const getTotalLayoutWidth = (
    layout: Omit<WrapLayout, 'width'>,
): WrapLayout => ({
    ...layout,
    width: layout.content.width + layout.rail.width + layout.rail.x,
})

const contentWrapStyles = StyleSheet.create({
    root: {
        overflow: 'visible',
        backgroundColor: 'blue',
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
    useEffect(() => {
        if (railLayout !== null && contentLayout !== null) {
            const layout = {
                content: {
                    width: contentLayout.width,
                },
                rail: railLayout,
            }
            onWrapLayout && onWrapLayout(getTotalLayoutWidth(layout))
        }
    }, [railLayout !== null && contentLayout !== null])

    return (
        <View style={threeColWrapStyles.root}>
            <View
                style={[
                    threeColWrapStyles.rightRail,
                    { borderLeftColor: borderColor },
                ]}
            >
                <View
                    onLayout={ev => {
                        setRailLayout(ev.nativeEvent.layout)
                    }}
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

const Wrap = ({ backgroundColor, ...props }: WrapperPropTypes) => {
    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)
    if (!isTablet) {
        return (
            <View style={{ backgroundColor }}>
                <MaxWidthWrap>
                    <ContentWrapper
                        {...props}
                        backgroundColor={backgroundColor}
                        onLayout={ev => {
                            if (props.onWrapLayout) {
                                props.onWrapLayout({
                                    content: {
                                        width: ev.nativeEvent.layout.width,
                                    },
                                    rail: {
                                        width: 0,
                                        x: -1,
                                    },
                                    width: ev.nativeEvent.layout.width,
                                })
                            }
                        }}
                    >
                        {props.children}
                        {props.rightRail && props.rightRail(Breakpoints.zero)}
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
