import React, { ReactNode } from 'react'
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native'
import { ariaHidden } from 'src/helpers/a11y'
import { useMediaQuery } from 'src/hooks/use-screen'
import { Breakpoints } from 'src/theme/breakpoints'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
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
    tablet,
    style,
    backgroundColor,
    ...children
}: ContentWrapperPropTypes) => {
    return (
        <View style={[contentWrapStyles.root, { backgroundColor }]}>
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
    backgroundColor,
    ...innerProps
}: ThreeColumnWrapperPropTypes) => {
    return (
        <View style={threeColWrapStyles.root}>
            <View style={[threeColWrapStyles.content]}>
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
    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)
    if (!isTablet) {
        return (
            <View style={{ backgroundColor }}>
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

export { Wrap }
