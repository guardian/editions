import React, { ReactElement } from 'react'
import { View, StyleSheet } from 'react-native'
import { metrics } from 'src/theme/spacing'
import { useIssueScreenSize } from 'src/screens/issue/use-size'

const styles = StyleSheet.create({
    outer: {
        paddingLeft: metrics.horizontal,
        paddingRight: metrics.horizontal,
        marginBottom: 0,
        marginTop: 0,
        height: metrics.fronts.sliderRadius * 2,
    },
})

const Wrapper = ({
    children,
    scrubber,
}: {
    scrubber: ReactElement
    children: ReactElement
}) => {
    const { card, container } = useIssueScreenSize()
    return (
        <>
            <View style={styles.outer}>{scrubber}</View>
            <View style={{ height: card.height, width: container.width }}>
                {children}
            </View>
        </>
    )
}

export { Wrapper }
