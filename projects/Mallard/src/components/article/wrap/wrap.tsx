import React, { ReactNode, ReactElement } from 'react'
import { View, ViewStyle, StyleProp, StyleSheet, Text } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { Breakpoints, getClosestBreakpoint } from 'src/theme/breakpoints'
import { getFader } from 'src/components/layout/animators/fader'
import { useDimensions, useMediaQuery } from 'src/hooks/use-screen'
import { getFont } from 'src/theme/typography'
import { Multiline } from 'src/components/multiline'
import { ariaHidden } from 'src/helpers/a11y'
import { MaxWidthWrap } from './max-width'

export enum WrapLayout {
    narrow,
    tablet,
    tabletLandscape,
}

interface ChildPropTypes {
    children: ReactNode
    header?: ReactNode
    footer?: ReactNode
}

interface ContentWrapperPropTypes extends ChildPropTypes {
    tablet?: boolean
    topOffset?: number
    backgroundColor?: ViewStyle['backgroundColor']
    style?: StyleProp<
        Pick<ViewStyle, 'paddingVertical' | 'paddingTop' | 'paddingBottom'>
    >
}

interface ThreeColumnWrapperPropTypes
    extends Exclude<ContentWrapperPropTypes, 'tablet'> {
    borderColor?: ViewStyle['borderColor']
    rightRail?: (
        position: Breakpoints.zero | Breakpoints.tabletVertical,
    ) => ReactNode
}

interface WrapperPropTypes
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
    tablet,
    style,
    topOffset,
    backgroundColor,
    ...children
}: ContentWrapperPropTypes) => {
    const useMobileTopOffset = !!topOffset && !tablet
    const useTabletTopOffset = !!topOffset && tablet
    return (
        <View
            style={[
                contentWrapStyles.root,
                { backgroundColor },
                useMobileTopOffset && {
                    marginTop: (topOffset || 0) * -1,
                    marginRight: metrics.article.sidesTablet,
                    width: 'auto',
                },
            ]}
        >
            {useMobileTopOffset && (
                <View
                    {...ariaHidden}
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor,
                            right: '-10%',
                            top: topOffset || 0,
                        },
                    ]}
                ></View>
            )}
            {useTabletTopOffset && (
                <View
                    {...ariaHidden}
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor,
                            left: '-100%',
                            right: metrics.article.railPaddingLeft * -1,
                            top: 0,
                        },
                    ]}
                ></View>
            )}
            {children.header && (
                <MaxWidthWrap invert>{children.header}</MaxWidthWrap>
            )}
            <View style={[style]}>{children.children}</View>
            {children.footer && (
                <MaxWidthWrap invert>{children.footer}</MaxWidthWrap>
            )}
        </View>
    )
}

const threeColWrapStyles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
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
        paddingRight: metrics.article.sidesTablet * 1.5,
        paddingLeft: metrics.article.sidesTablet / 2,
        marginTop: metrics.vertical * -0.25,
    },
})
const ThreeColumnWrapper = ({
    borderColor,
    rightRail,
    topOffset,
    backgroundColor,
    ...innerProps
}: ThreeColumnWrapperPropTypes) => {
    return (
        <View style={threeColWrapStyles.root}>
            <View
                style={[
                    threeColWrapStyles.content,
                    !!topOffset && {
                        marginTop: topOffset * -1,
                        backgroundColor,
                    },
                ]}
            >
                <ContentWrapper
                    backgroundColor={backgroundColor}
                    topOffset={topOffset}
                    tablet
                    {...innerProps}
                />
            </View>
            <View
                style={[
                    threeColWrapStyles.rightRail,
                    { borderLeftColor: borderColor },
                ]}
            >
                {rightRail && (
                    <View
                        style={[
                            threeColWrapStyles.rightRailContent,
                            innerProps.style,
                        ]}
                    >
                        {rightRail(Breakpoints.tabletVertical)}
                    </View>
                )}
            </View>
        </View>
    )
}

const Wrap = ({ backgroundColor, ...props }: WrapperPropTypes) => {
    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)
    if (!isTablet) {
        return (
            <View style={!props.topOffset && { backgroundColor }}>
                <MaxWidthWrap>
                    <ContentWrapper
                        {...props}
                        backgroundColor={backgroundColor}
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

const ArticleFader = getFader('article')
const multiStyles = StyleSheet.create({
    byline: {
        paddingBottom: metrics.vertical,
        paddingTop: metrics.vertical / 6,
        minHeight: getFont('text', 1).lineHeight * 2.75,
    },
    paddingTop: {
        paddingTop: metrics.vertical,
    },
    bylineBorder: {
        borderBottomColor: color.dimLine,
        borderBottomWidth: 1,
    },
    topBorder: {
        height: StyleSheet.hairlineWidth,
        width: '100%',
        backgroundColor: color.line,
    },
})

const MultilineWrap = ({
    byline,
    needsTopPadding = false,
    multilineColor = color.line,
    ...props
}: Exclude<WrapperPropTypes, 'header' | 'style' | 'footer'> & {
    needsTopPadding?: boolean
    byline: ReactNode
    multilineColor?: string
}) => (
    <>
        {needsTopPadding && (
            <View {...ariaHidden} style={[multiStyles.topBorder]}></View>
        )}
        <Wrap {...props} style={[needsTopPadding && multiStyles.paddingTop]} />
        {byline && (
            <Wrap
                backgroundColor={props.backgroundColor}
                borderColor={props.borderColor}
                style={[multiStyles.byline]}
                header={
                    <ArticleFader>
                        <Multiline count={4} color={multilineColor} />
                    </ArticleFader>
                }
                footer={
                    !props.backgroundColor && (
                        <ArticleFader>
                            <View style={multiStyles.bylineBorder} />
                        </ArticleFader>
                    )
                }
            >
                <ArticleFader>{byline}</ArticleFader>
            </Wrap>
        )}
    </>
)

export { Wrap, MultilineWrap }
