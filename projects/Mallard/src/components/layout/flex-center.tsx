import React, { ReactNode } from 'react'
import { StyleSheet, View, ViewStyle, StyleProp } from 'react-native'

/*
Super simple centerer helper to put 
things in the middle of the screen
*/

const styles = StyleSheet.create({
    root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})

const FlexCenter = ({
    children,
    style,
}: {
    children: ReactNode
    style?: StyleProp<ViewStyle>
}) => <View style={[styles.root, style]}>{children}</View>

export { FlexCenter }
