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

const ContentWrapper = ({
    tablet,
    style,
    topOffset,
    backgroundColor,
    ...children
}: ContentWrapperPropTypes) => {
    const useMobileTopOffset = !!topOffset && !tablet
    return (
        <View
            style={[
                contentWrapStyles.root,
                tablet && contentWrapStyles.rootTablet,
                { backgroundColor },
                useMobileTopOffset && {
                    marginTop: (topOffset || 0) * -1,
                    width: '95%',
                },
            ]}
        >
            {useMobileTopOffset ? (
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
            ) : (
                <View
                    {...ariaHidden}
                    style={[
                        StyleSheet.absoluteFill,
                        {
                            backgroundColor,
                            left: '-100%',
                            top: 0,
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
    )
}

const threeColWrapStyles = StyleSheet.create({
    root: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'stretch',
        justifyContent: 'flex-start',
        maxWidth: metrics.article.maxWidth,
        overflow: 'visible',
    },
    content: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-end',
    },
    rightRail: {
        width: metrics.article.rightRail,
        borderColor: color.line,
        flexShrink: 0,
        borderLeftWidth: 1,
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
        <View style={{ backgroundColor, alignItems: 'center' }}>
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
    topBorder: { height: 1, width: '100%', backgroundColor: color.line },
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
