import React, { ReactNode } from 'react'
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'
import { Breakpoints } from 'src/theme/breakpoints'
import { WithBreakpoints } from 'src/components/layout/ui/with-breakpoints'

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
    tablet: {
        maxWidth: metrics.article.maxWidth,
        borderRightColor: color.palette.neutral[7],
        borderRightWidth: 1,
        paddingLeft: metrics.article.sidesLandscape - metrics.article.sides,
        paddingRight: metrics.article.sidesLandscape,
    },
    tabletLandscape: {
        marginLeft:
            metrics.article.leftRailLandscape -
            (metrics.article.sidesLandscape - metrics.article.sides),
        maxWidth: metrics.article.maxWidthLandscape,
    },
})

const Wrap = ({
    style,
    isTopMost = false,
    outerStyle,
    children,
}: {
    style?: StyleProp<
        Pick<ViewStyle, 'paddingTop' | 'paddingBottom' | 'paddingVertical'>
    >
    isTopMost?: boolean
    outerStyle?: StyleProp<Pick<ViewStyle, 'backgroundColor' | 'flex'>>
    children: (l: WrapLayout) => ReactNode
}) => {
    return (
        <View style={[outerStyle, styles.outer]}>
            <WithBreakpoints>
                {{
                    0: () => <>{children(WrapLayout.narrow)}</>,
                    [Breakpoints.tabletVertical]: () => (
                        <View
                            style={[
                                style,
                                styles.tablet,
                                isTopMost &&
                                outerStyle &&
                                'backgroundColor' in
                                    StyleSheet.flatten(outerStyle)
                                    ? {
                                          marginTop: metrics.vertical * 2,
                                      }
                                    : {},
                            ]}
                        >
                            {children(WrapLayout.tablet)}
                        </View>
                    ),
                    [Breakpoints.tabletLandscape]: () => (
                        <View
                            style={[
                                style,
                                styles.tablet,
                                styles.tabletLandscape,
                                isTopMost &&
                                outerStyle &&
                                'backgroundColor' in
                                    StyleSheet.flatten(outerStyle)
                                    ? {
                                          marginTop: metrics.vertical * 2,
                                      }
                                    : {},
                            ]}
                        >
                            {children(WrapLayout.tabletLandscape)}
                        </View>
                    ),
                }}
            </WithBreakpoints>
        </View>
    )
}

export { Wrap }
