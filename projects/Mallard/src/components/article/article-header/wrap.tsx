import React, { ReactNode } from 'react'
import { View, ViewStyle, StyleProp } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { palette } from '@guardian/pasteup/palette'
import { color } from 'src/theme/color'

const Wrap = ({
    style,
    outerStyle,
    children,
}: {
    style?: StyleProp<
        Pick<ViewStyle, 'paddingTop' | 'paddingBottom' | 'paddingVertical'>
    >
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
                ]}
            >
                {children}
            </View>
        </View>
    )
}

export { Wrap }
