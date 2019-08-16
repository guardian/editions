import React, { ReactNode } from 'react'
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { Breakpoints, getClosestBreakpoint } from 'src/theme/breakpoints'
import { ArticleMultiline } from '../article-multiline'
import { getFader } from 'src/components/layout/animators/fader'
import { useDimensions } from 'src/hooks/use-screen'

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
    style?: StyleProp<
        Pick<ViewStyle, 'paddingVertical' | 'paddingTop' | 'paddingBottom'>
    >
}

interface ThreeColumnWrapperPropTypes
    extends Exclude<ContentWrapperPropTypes, 'tablet'> {
    backgroundColor?: ViewStyle['backgroundColor']
    borderColor?: ViewStyle['borderColor']
    rightRail?: ReactNode
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
    ...children
}: ContentWrapperPropTypes) => {
    if (bleeds) return <EdgeToEdgeContentWrapper {...children} />
    return (
        <View
            style={[
                contentWrapStyles.root,
                tablet && contentWrapStyles.rootTablet,
            ]}
        >
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

const tabletWrapStyles = StyleSheet.create({
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
    ...innerProps
}: ThreeColumnWrapperPropTypes) => {
    const { width } = useDimensions()
    const landscape = width >= Breakpoints.tabletLandscape

    return (
        <View style={tabletWrapStyles.root}>
            <View style={tabletWrapStyles.content}>
                <ContentWrapper tablet {...innerProps} />
            </View>
            <View
                style={[
                    tabletWrapStyles.rightRail,
                    { borderLeftColor: borderColor },
                    landscape && tabletWrapStyles.rightRailLandscape,
                ]}
            >
                {rightRail && (
                    <View
                        style={[
                            tabletWrapStyles.rightRailContent,
                            innerProps.style,
                        ]}
                    >
                        {rightRail}
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
            <View style={[props.style, { backgroundColor }]}>
                <ContentWrapper {...props} />
                {props.rightRail && (
                    <ContentWrapper>{props.rightRail}</ContentWrapper>
                )}
            </View>
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
    ...props
}: Exclude<WrapperPropTypes, 'header' | 'style' | 'footer'> & {
    byline: ReactNode
}) => (
    <>
        <Wrap
            style={[!!props.backgroundColor && multiStyles.paddingTop]}
            {...props}
        />
        {byline && (
            <Wrap
                backgroundColor={props.backgroundColor}
                borderColor={props.borderColor}
                style={[multiStyles.byline]}
                header={
                    <ArticleFader>
                        <ArticleMultiline />
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
