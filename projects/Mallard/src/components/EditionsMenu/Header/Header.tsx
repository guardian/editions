import React from 'react'
import { View, StyleSheet } from 'react-native'
import { TitlepieceText } from 'src/components/styled-text'

const styles = StyleSheet.create({
    container: {
        paddingTop: 4,
        paddingLeft: 96,
        paddingBottom: 38,
        flex: 1,
    },
    text: { fontSize: 24, lineHeight: 30 },
})

const EditionsMenuHeader = ({ children }: { children: string }) => (
    <View style={styles.container}>
        <TitlepieceText style={styles.text}>{children}</TitlepieceText>
    </View>
)

export { EditionsMenuHeader }
