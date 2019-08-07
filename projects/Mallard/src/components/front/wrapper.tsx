import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'

const styles = StyleSheet.create({
    wrapper: {
        height: metrics.fronts.blockHeight,
    },
    inner: { height: metrics.fronts.cardHeight },
    outer: {
        paddingLeft: metrics.horizontal,
        paddingRight: metrics.horizontal,
        marginBottom: 0,
        marginTop: 0,
    },
})

const Wrapper = ({
    children,
    scrubber,
}: {
    scrubber: ReactElement
    children: ReactElement
}) => {
    return (
        <View style={styles.wrapper}>
            <View style={styles.outer}>{scrubber}</View>
            <View style={styles.inner}>{children}</View>
        </View>
    )
}

export { Wrapper }
