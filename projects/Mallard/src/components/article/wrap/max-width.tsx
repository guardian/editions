import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
import { useMediaQuery } from 'src/hooks/use-screen'
import { Breakpoints } from 'src/theme/breakpoints'
import { metrics } from 'src/theme/spacing'

const maxWidthStyles = StyleSheet.create({
    maxWidth: {
        maxWidth: metrics.article.maxWidth,
        alignItems: 'stretch',
        justifyContent: 'center',
        flexDirection: 'row',
        overflow: 'visible',
    },
    padding: {
        marginHorizontal: metrics.article.sides,
    },
    paddingTablet: {
        marginHorizontal: metrics.article.sidesTablet,
    },
    inverted: {
        marginHorizontal: metrics.article.sides * -1,
    },
    invertedTablet: {
        marginLeft: 0,
        marginRight: metrics.article.railPaddingLeft * -1,
    },
})

export const MaxWidthWrap = ({ children }: { children: ReactNode }) => {
    const isTablet = useMediaQuery(width => width >= Breakpoints.tabletVertical)
    return (
        <View
            style={[
                maxWidthStyles.maxWidth,
                maxWidthStyles.padding,
                isTablet && maxWidthStyles.paddingTablet,
            ]}
        >
            {children}
        </View>
    )
}
