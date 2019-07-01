import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { TouchableOpacity } from 'react-native'

export type ThreeWaySwitchValue = null | boolean

const styles = StyleSheet.create({
    edge: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: color.primary,
        flexDirection: 'row',
        borderRadius: 2,
    },
    side: {
        color: color.primary,
        padding: metrics.horizontal,
        paddingVertical: metrics.vertical / 2,
    },
    selectedSide: {
        backgroundColor: color.primary,
        color: color.textOverPrimary,
    },
})

const ThreeWaySwitch = ({ value }: { value: ThreeWaySwitchValue }) => {
    return (
        <View style={styles.edge}>
            <Text style={[styles.side, value === true && styles.selectedSide]}>
                Yes
            </Text>
            <Text style={[styles.side, value === false && styles.selectedSide]}>
                No
            </Text>
        </View>
    )
}

const TouchableThreeWaySwitch = ({
    value,
    onValueChange,
}: {
    value: ThreeWaySwitchValue
    onValueChange?: () => void
}) => (
    <TouchableOpacity onPress={onValueChange}>
        <ThreeWaySwitch value={value} />
    </TouchableOpacity>
)

export { ThreeWaySwitch, TouchableThreeWaySwitch }
