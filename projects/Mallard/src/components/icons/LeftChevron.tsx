import React from 'react'
import { Text, StyleSheet } from 'react-native'
import { useAppAppearance } from 'src/theme/appearance'
import { getFont } from 'src/theme/typography'

const LeftChevron = () => {
    const styles = StyleSheet.create({
        icon: {
            ...getFont('icon', 1),
            color: useAppAppearance().color,
        },
    })

    return <Text style={styles.icon}>{'\uE00A'}</Text>
}

export { LeftChevron }
