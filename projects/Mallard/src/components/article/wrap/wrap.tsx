import React, { ReactNode } from 'react'
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { Breakpoints, getClosestBreakpoint } from 'src/theme/breakpoints'
import { getFader } from 'src/components/layout/animators/fader'
import { useDimensions, useMediaQuery } from 'src/hooks/use-screen'
import { getFont } from 'src/theme/typography'
import { Multiline } from 'src/components/multiline'
import { ariaHidden } from 'src/helpers/a11y'

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
    bleeds?: boolean
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
        maxWidth: metrics.article.maxWidthLandscape,
        width: '100%',
        paddingLeft: metrics.article.sides,
    },
    rootTablet: {
        paddingLeft: metrics.article.sidesTablet,
    },
    inner: {
        paddingRight: metrics.article.sides,
    },
    innerTablet: {
        paddingRight: metrics.article.sidesTablet * 1.25,
    },
})

const EdgeToEdgeContentWrapper = ({
    header,
    footer,
    children,
}: Pick<ContentWrapperPropTypes, 'header' | 'footer' | 'children'>) => (
    <>
        {header}
        {footer}
        {children}
    </>
)

const ContentWrapper = ({
    tablet,
    style,
    bleeds,
    topOffset,
    backgroundColor,
    ...children
}: ContentWrapperPropTypes) => {
    if (bleeds) return <EdgeToEdgeContentWrapper {...children} />
    const useMobileTopOffset = !!topOffset && !tablet
    return (
        <>
            <View
                style={[
                    contentWrapStyles.root,
                    { backgroundColor },
                    tablet && contentWrapStyles.rootTablet,
                    useMobileTopOffset && {
                        marginTop: (topOffset || 0) * -1,
                        width: '95%',
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
                {children.header}
                <View
                    style={[
                        style,
                        contentWrapStyles.inner,
                        tablet && contentWrapStyles.innerTablet,
                    ]}
                >
                    {children.children}
                </View>
                {children.footer}
            </View>
        </>
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
    },
    rightRail: {
        width: metrics.article.rightRail,
        flexShrink: 0,
        borderLeftWidth: 1,
    },
    rightRailLandscape: {
        width: metrics.article.rightRailLandscape,
    },
    rightRailContent: {
        maxWidth: metrics.article.rightRail + metrics.article.sidesTablet * 1.5,
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
    const landscape = useMediaQuery(
        width => width >= Breakpoints.tabletLandscape,
    )

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
                <ContentWrapper tablet {...innerProps} />
            </View>
            <View
                style={[
                    threeColWrapStyles.rightRail,
                    { borderLeftColor: borderColor },
                    landscape && threeColWrapStyles.rightRailLandscape,
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
    const { width } = useDimensions()
    const breakpoint = getClosestBreakpoint(
        [0, Breakpoints.tabletVertical, Breakpoints.tabletLandscape],
        width,
    )

    if (breakpoint < Breakpoints.tabletVertical) {
        return (
            <ContentWrapper {...props} backgroundColor={backgroundColor}>
                {props.children}
                {props.rightRail && props.rightRail(Breakpoints.zero)}
            </ContentWrapper>
        )
    }

    return (
        <View style={{ backgroundColor }}>
            <ThreeColumnWrapper
                {...{
                    backgroundColor,
                    ...props,
                }}
            />
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
