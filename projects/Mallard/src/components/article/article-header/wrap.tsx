import React, { ReactNode } from 'react'
import { View, ViewStyle, StyleProp, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { color } from 'src/theme/color'

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
        <View
            style={[
                outerStyle,
                {
                    alignItems: 'stretch',
                    paddingHorizontal: metrics.articleSides,
                },
            ]}
        >
            <View
                style={[
                    style,
                    {
                        maxWidth: 560,
                        borderRightColor: color.palette.neutral[7],
                        borderRightWidth: 1,
                    },
                    {
                        paddingLeft:
                            metrics.articleSidesWide - metrics.articleSides,
                        paddingRight: metrics.articleSidesWide,
                    },
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
