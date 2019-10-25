import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'
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
})

export const MaxWidthWrap = ({ children }: { children: ReactNode }) => {
    return (
        <View style={[maxWidthStyles.maxWidth, maxWidthStyles.padding]}>
            {children}
        </View>
    )
}
