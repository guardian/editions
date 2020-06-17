import React from 'react'
import { Newspaper } from 'src/components/icons/Newspaper'
import { TouchableOpacity, StyleSheet, View } from 'react-native'
import { color } from 'src/theme/color'
import { LeftChevron } from 'src/components/icons/LeftChevron'

const styles = StyleSheet.create({
    button: {
        alignItems: 'center',
        backgroundColor: color.palette.sport.pastel,
        borderRadius: 24,
        justifyContent: 'center',
        height: 42,
        width: 42,
    },
})

const EditionsMenuButton = ({
    onPress,
    selected = false,
}: {
    onPress: () => void
    selected?: boolean
}) => (
    <TouchableOpacity
        accessibilityRole="button"
        accessibilityHint="Editions Menu"
        onPress={onPress}
        style={styles.button}
    >
        {selected ? <LeftChevron /> : <Newspaper />}
    </TouchableOpacity>
)

export { EditionsMenuButton }
