import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

/*
Super simple centerer helper to put 
things in the middle of the screen
*/

const styles = StyleSheet.create({
    root: { flex: 1, alignItems: 'center', justifyContent: 'center' },
})

const FlexCenter = ({ children }: { children: ReactNode }) => (
    <View style={styles.root}>{children}</View>
)

export { FlexCenter }
