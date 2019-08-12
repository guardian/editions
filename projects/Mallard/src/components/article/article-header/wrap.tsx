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
        paddingRight: metrics.article.sides,
        marginLeft: metrics.article.sides,
    },
    wrapper: {
        borderRightColor: color.palette.neutral[7],
        borderRightWidth: 1,
        width: metrics.article.maxWidth,
    },
    wrapperLandscape: {
        width:
            metrics.article.maxWidthLandscape +
            metrics.article.leftRailLandscape,
    },
    padding: {
        marginLeft: metrics.article.sidesLandscape,
        paddingRight: metrics.article.sidesLandscape * 1.25,
    },
    paddingLandscape: {
        marginLeft: metrics.article.leftRailLandscape,
    },
})

interface PropTypes {
    style?: StyleProp<ViewStyle>
    innerStyle?: StyleProp<ViewStyle>
    isTopMost?: boolean
    backgroundColor?: ViewStyle['backgroundColor']
    borderColor?: ViewStyle['borderColor']
    children: ReactNode
    header?: ReactNode
}

const InnerWrapper = ({
    style,
    innerStyle,
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
        {header && (
            <View style={[styles.padding, { paddingRight: 0 }]}>{header}</View>
        )}
        <View
            style={[
                innerStyle,
                styles.padding,
                landscape && styles.paddingLandscape,
            ]}
        >
            {children}
        </View>
    </View>
)

const Wrap = ({ children, backgroundColor, ...props }: PropTypes) => {
    return (
        <View style={{ backgroundColor }}>
            <WithBreakpoints>
                {{
                    0: () => (
                        <>
                            <View
                                style={[
                                    props.style,
                                    props.innerStyle,
                                    styles.outer,
                                ]}
                            >
                                {props.header}
                                {children}
                            </View>
                        </>
                    ),
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
                            landscape={true}
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
    byline: {
        paddingBottom: metrics.vertical / 2,
    },
    bylineBorder: {
        borderBottomColor: color.dimLine,
        borderBottomWidth: 1,
    },
})
const MultilineWrap = ({
    byline,
    ...props
}: Exclude<PropTypes, 'header'> & {
    byline: ReactNode
}) => (
    <>
        <Wrap {...props} />
        {byline && (
            <Wrap
                backgroundColor={props.backgroundColor}
                borderColor={props.borderColor}
                style={[multiStyles.byline]}
                innerStyle={!props.backgroundColor && multiStyles.bylineBorder}
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
