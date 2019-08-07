import React, { ReactNode } from 'react'
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'

export enum WrapLayout {
    narrow,
    tablet,
    wide,
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
    wide: {
        marginLeft:
            metrics.article.leftRailLandscape -
            metrics.article.sidesLandscape -
            metrics.article.sides,
        maxWidth: metrics.article.maxWidth,
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
            <View
                style={[
                    style,
                    styles.tablet,
                    styles.wide,
                    isTopMost &&
                    outerStyle &&
                    'backgroundColor' in StyleSheet.flatten(outerStyle)
                        ? {
                              paddingTop: metrics.vertical * 2,
                          }
                        : {},
                ]}
            >
                {children(WrapLayout.narrow)}
            </View>
        </View>
    )
}

export { Wrap }
