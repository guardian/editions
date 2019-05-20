import React from 'react'
import { StyleSheet, View } from 'react-native'
import { color } from '../theme/color'

const styles = StyleSheet.create({
    container: {
        width: 80,
        height: 40,
        backgroundColor: 'yellow',
    },
    arrow: {
        width: '50%',
        height: 10,
        backgroundColor: color.text,
        position: 'absolute',
        borderRadius: 999,
    },
})

const Chevron = () => (
    <View style={styles.container}>
        <View
            style={[
                styles.arrow,
                {
                    transform: [{ rotate: '10deg' }],
                },
            ]}
        />
        <View
            style={[
                styles.arrow,
                {
                    right: 0,
                    backgroundColor: 'blue',
                    transform: [{ rotate: '-10deg' }],
                },
            ]}
        />
    </View>
)

export { Chevron }
