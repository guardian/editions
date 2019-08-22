import React from 'react'
import { StyleSheet, View } from 'react-native'

const styles = StyleSheet.create({
    root: {
        paddingRight: '10%',
    },
})
const HeadlineTypeWrap = ({ children }) => {
    return <View style={styles.root}>{children}</View>
}

export { HeadlineTypeWrap }
