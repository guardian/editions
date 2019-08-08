import React, { ReactNode } from 'react'
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { Breakpoints } from 'src/theme/breakpoints'
import { WithBreakpoints } from 'src/components/layout/ui/with-breakpoints'
import { ArticleMultiline } from '../article-multiline'
import { getFader } from 'src/components/layout/animators/fader'

export enum WrapLayout {
    narrow,
    tablet,
    tabletLandscape,
}

const styles = StyleSheet.create({
    outer: {
        alignItems: 'stretch',
        paddingHorizontal: metrics.article.sides,
    },
    wrapper: {
        borderRightColor: color.palette.neutral[7],
        borderRightWidth: 1,
        maxWidth: metrics.article.maxWidth,
    },
    wrapperLandscape: {
        maxWidth: metrics.article.maxWidthLandscape,
    },
    wrapperHeader: {
        marginLeft: metrics.article.sides * -1,
    },
    padding: {
        paddingLeft: metrics.article.sidesLandscape - metrics.article.sides,
        paddingRight: metrics.article.sidesLandscape,
    },
    paddingLandscape: {
        paddingLeft: metrics.article.leftRailLandscape,
    },
})

interface PropTypes {
    style?: StyleProp<ViewStyle>
    isTopMost?: boolean
    backgroundColor?: ViewStyle['backgroundColor']
    borderColor?: ViewStyle['borderColor']
    children: ReactNode
    header?: ReactNode
}

const InnerWrapper = ({
    style,
    isTopMost = false,
    children,
    backgroundColor,
    borderColor,
    landscape = false,
    header,
}: PropTypes & { landscape?: boolean }) => (
    <View
        style={[
            style,
            styles.wrapper,
            landscape && styles.wrapperLandscape,
            { borderRightColor: borderColor },
            isTopMost && backgroundColor
                ? {
                      marginTop: metrics.vertical * 2,
                  }
                : {},
        ]}
    >
        <View style={styles.wrapperHeader}>{header}</View>
        <View style={[styles.padding, landscape && styles.paddingLandscape]}>
            {children}
        </View>
    </View>
)

const Wrap = ({ children, backgroundColor, ...props }: PropTypes) => {
    return (
        <View style={[styles.outer, { backgroundColor }]}>
            <WithBreakpoints>
                {{
                    0: () => <>{children}</>,
                    [Breakpoints.tabletVertical]: () => (
                        <InnerWrapper
                            {...{ children, backgroundColor, ...props }}
                        >
                            {children}
                        </InnerWrapper>
                    ),
                    [Breakpoints.tabletLandscape]: () => (
                        <InnerWrapper
                            {...{ children, backgroundColor, ...props }}
                            landscape
                        >
                            {children}
                        </InnerWrapper>
                    ),
                }}
            </WithBreakpoints>
        </View>
    )
}

const ArticleFader = getFader('article')
const multiStyles = StyleSheet.create({
    border: {
        paddingBottom: metrics.vertical / 2,
        borderBottomColor: color.dimLine,
        borderBottomWidth: 1,
    },
})
const MultilineWrap = ({
    byline,
    ...props
}: Exclude<PropTypes, 'header'> & { byline: ReactNode }) => (
    <>
        <Wrap {...props} />
        {byline && (
            <Wrap
                borderColor={props.borderColor}
                style={multiStyles.border}
                header={
                    <ArticleFader>
                        <ArticleMultiline />
                    </ArticleFader>
                }
            >
                <ArticleFader>{byline}</ArticleFader>
            </Wrap>
        )}
    </>
)

export { Wrap, MultilineWrap }
