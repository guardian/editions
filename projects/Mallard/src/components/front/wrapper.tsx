import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { useIssueScreenSize } from 'src/screens/issue/context'

const styles = StyleSheet.create({
    wrapper: {
        height: metrics.fronts.blockHeight,
    },
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
    const { card } = useIssueScreenSize()
    return (
        <View style={styles.wrapper}>
            <View style={styles.outer}>{scrubber}</View>
            <View style={{ height: card.height }}>{children}</View>
        </View>
    )
}

export { Wrapper }
