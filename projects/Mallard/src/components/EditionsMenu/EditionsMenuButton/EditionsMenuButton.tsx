import React from 'react'
import { Editions } from 'src/components/icons/Editions'
import { TouchableOpacity, StyleSheet } from 'react-native'
import { color } from 'src/theme/color'
import { LeftChevron } from 'src/components/icons/LeftChevron'

const styles = (selected: boolean) =>
    StyleSheet.create({
        button: {
            alignItems: 'center',
            backgroundColor: selected
                ? color.palette.sport.pastel
                : 'transparent',
            borderRadius: 24,
            justifyContent: 'center',
            height: 42,
            width: 42,
        },
    })

const EditionsMenuButton = ({
    onPress,
    selected = false,
    darkVersion = false,
}: {
    onPress: () => void
    selected?: boolean
    darkVersion?: boolean
}) => (
    <TouchableOpacity
        accessibilityRole="button"
        accessibilityLabel="Regions and specials editions menu"
        onPress={onPress}
        style={styles(selected).button}
    >
        {selected ? <LeftChevron /> : <Editions darkVersion={darkVersion} />}
    </TouchableOpacity>
)

export { EditionsMenuButton }
