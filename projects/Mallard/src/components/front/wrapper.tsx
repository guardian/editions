import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'

const styles = StyleSheet.create({
    inner: { height: metrics.frontsPageHeight },
    outer: {
        padding: metrics.horizontal,
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
        <>
            <View style={styles.outer}>{scrubber}</View>
            <View style={styles.inner}>{children}</View>
        </>
    )
}

export { Wrapper }
