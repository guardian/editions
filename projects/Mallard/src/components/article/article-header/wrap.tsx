import React, { ReactNode } from 'react'
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'

const styles = StyleSheet.create({
    outer: {
        alignItems: 'stretch',
        paddingHorizontal: metrics.articleSides,
    },
    tablet: {
        maxWidth: metrics.articlePage.maxWidth,
        borderRightColor: color.palette.neutral[7],
        borderRightWidth: 1,
        paddingLeft: metrics.articleSidesWide - metrics.articleSides,
        paddingRight: metrics.articleSidesWide,
    },
    wide: {
        marginLeft:
            metrics.articlePage.leftRailLandscape -
            metrics.articleSidesWide -
            metrics.articleSides,
        maxWidth: metrics.articlePage.maxWidth,
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
    children: ReactNode
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
                {children}
            </View>
        </View>
    )
}

export { Wrap }
