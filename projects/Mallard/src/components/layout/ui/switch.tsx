import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import { color } from 'src/theme/color'
import { metrics } from 'src/theme/spacing'
import { TouchableOpacity } from 'react-native'
import { Button, ButtonAppearance } from 'src/components/button/button'

export type ThreeWaySwitchValue = null | boolean

const styles = StyleSheet.create({
    firstChild: {
        marginRight: metrics.horizontal / 2,
    },
    row: {
        flexDirection: 'row',
    },
})

const ThreeWaySwitch = ({
    value,
    onValueChange,
}: {
    value: ThreeWaySwitchValue
    onValueChange: (value: boolean | null) => void
}) => {
    return (
        <View style={styles.row}>
            <Button
                accessible={value === true}
                accessibilityHint={'Tap to turn Off'}
                style={styles.firstChild}
                onPress={() => onValueChange(true)}
                appearance={
                    value === true
                        ? ButtonAppearance.skeletonActive
                        : ButtonAppearance.skeleton
                }
            >
                On
            </Button>
            <Button
                accessible={value === false}
                accessibilityHint={'Tap to turn On'}
                onPress={() => onValueChange(false)}
                appearance={
                    value === false
                        ? ButtonAppearance.skeletonActive
                        : ButtonAppearance.skeleton
                }
            >
                Off
            </Button>
        </View>
    )
}
export { ThreeWaySwitch }
